from datetime import datetime
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload

from database.db import get_db
from models.notification import Notification
from models.product import Product
from models.user import User
from schemas.common import ProductWrite
from services.deps import get_active_artisan
from services.pricing_service import recommend_price
from services.serializers import apply_product_payload, product_to_frontend

router = APIRouter(tags=["products"])


def _pricing_from_payload(data: dict) -> dict:
    breakdown = data.get("costBreakdown") or {}
    material = float(data.get("material_cost") or breakdown.get("material") or 0)
    labour = float(data.get("labour_cost") or breakdown.get("labor") or breakdown.get("labour") or 0)
    other = float(data.get("other_cost") or breakdown.get("other") or 0)
    if material or labour or other:
        return recommend_price(material, labour, other, data.get("category"))
    return None


@router.post("/products")
def create_product(
    payload: ProductWrite,
    db: Session = Depends(get_db),
    artisan: User = Depends(get_active_artisan),
):
    data = payload.model_dump(exclude_none=True)
    product = Product(
        id=f"prod_{uuid4().hex[:10]}",
        artisan_id=artisan.id,
        title=data.get("title") or "Untitled Craft",
        status=data.get("status") or "draft",
        created_at=datetime.utcnow(),
        badges=data.get("badges") or ["Handmade", "Verified Artisan"],
        tags=data.get("tags") or [],
        in_stock=True,
    )
    apply_product_payload(product, data, _pricing_from_payload(data))
    db.add(product)
    db.commit()
    db.refresh(product)
    product.artisan = artisan
    return product_to_frontend(product, artisan)


@router.get("/products")
def list_products(
    db: Session = Depends(get_db),
    artisan: User = Depends(get_active_artisan),
):
    rows = (
        db.query(Product)
        .options(joinedload(Product.artisan))
        .filter(Product.artisan_id == artisan.id)
        .order_by(Product.created_at.desc())
        .all()
    )
    return [product_to_frontend(p, p.artisan) for p in rows]


@router.get("/products/{product_id}")
def get_product(product_id: str, db: Session = Depends(get_db)):
    product = db.query(Product).options(joinedload(Product.artisan)).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product.views = (product.views or 0) + 1
    db.commit()
    db.refresh(product)
    return product_to_frontend(product, product.artisan)


@router.put("/products/{product_id}")
def update_product(
    product_id: str,
    payload: ProductWrite,
    db: Session = Depends(get_db),
    artisan: User = Depends(get_active_artisan),
):
    product = db.query(Product).filter(Product.id == product_id, Product.artisan_id == artisan.id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    data = payload.model_dump(exclude_none=True)
    apply_product_payload(product, data, _pricing_from_payload(data))
    db.commit()
    db.refresh(product)
    product.artisan = artisan
    return product_to_frontend(product, artisan)


@router.delete("/products/{product_id}")
def delete_product(
    product_id: str,
    db: Session = Depends(get_db),
    artisan: User = Depends(get_active_artisan),
):
    product = db.query(Product).filter(Product.id == product_id, Product.artisan_id == artisan.id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return {"ok": True}


@router.post("/products/{product_id}/publish")
def publish_product(
    product_id: str,
    db: Session = Depends(get_db),
    artisan: User = Depends(get_active_artisan),
):
    product = db.query(Product).filter(Product.id == product_id, Product.artisan_id == artisan.id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product.status = "published"
    note = Notification(
        id=f"notif_{uuid4().hex[:10]}",
        user_id=artisan.id,
        title="Craft Published Successfully! 🎉",
        message=f'"{product.title}" is now live on Artisan AI Marketplace with Verified Artisan badge.',
        type="product_published",
        is_read=False,
        action_target="my_products",
        related_id=product.id,
        created_at=datetime.utcnow(),
    )
    db.add(note)
    db.commit()
    db.refresh(product)
    product.artisan = artisan
    return product_to_frontend(product, artisan)


@router.get("/marketplace")
def marketplace(
    search: str | None = Query(default=None),
    category: str | None = Query(default=None),
    region: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    q = (
        db.query(Product)
        .options(joinedload(Product.artisan))
        .filter(Product.status == "published")
    )
    rows = q.order_by(Product.created_at.desc()).all()
    results = []
    search_l = (search or "").lower().strip()
    category_l = (category or "").strip()
    region_l = (region or "").lower().strip()
    for product in rows:
        if category_l and category_l.lower() not in ("all", "") and product.category != category_l:
            if category_l.lower() not in (product.category or "").lower():
                continue
        hay = " ".join(
            [
                product.title or "",
                product.category or "",
                product.material or "",
                " ".join(product.tags or []),
                product.artisan.name if product.artisan else "",
                product.artisan.region if product.artisan else "",
            ]
        ).lower()
        if search_l and search_l not in hay:
            continue
        loc = (product.artisan.region if product.artisan else "") + " " + (product.artisan.state if product.artisan else "")
        if region_l and region_l not in loc.lower():
            continue
        results.append(product_to_frontend(product, product.artisan))
    return results
