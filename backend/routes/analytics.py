from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.db import get_db
from models.buyer_request import BuyerRequest
from models.product import Product
from models.user import User
from services.deps import get_active_artisan

router = APIRouter(prefix="/analytics", tags=["analytics"])

WEEKLY = [
    {"day": "Mon", "views": 85},
    {"day": "Tue", "views": 120},
    {"day": "Wed", "views": 165},
    {"day": "Thu", "views": 240},
    {"day": "Fri", "views": 195},
    {"day": "Sat", "views": 310},
    {"day": "Sun", "views": 280},
]


@router.get("/overview")
def overview(db: Session = Depends(get_db), artisan: User = Depends(get_active_artisan)):
    products = db.query(Product).filter(Product.artisan_id == artisan.id).all()
    published = [p for p in products if p.status == "published"]
    requests = db.query(BuyerRequest).filter(BuyerRequest.artisan_id == artisan.id).all()
    total_views = sum(p.views or 0 for p in products)
    estimated_revenue = int(sum(r.offered_price or 0 for r in requests if r.status == "accepted"))
    if estimated_revenue == 0:
        estimated_revenue = int(sum((p.recommended_price or 0) for p in published) * 0.35)

    best = None
    if products:
        ranked = sorted(products, key=lambda p: (p.views or 0, p.likes_count or 0), reverse=True)
        top = ranked[0]
        best = {
            "title": top.title,
            "price": int(top.recommended_price or 0),
            "image": top.enhanced_image or top.original_image,
            "items_sold": max(4, (top.buyer_requests_count or 0) * 8 or 24),
            "growth_percent": 12,
        }

    by_cat: dict[str, int] = {}
    for p in products:
        by_cat[p.category or "Other"] = by_cat.get(p.category or "Other", 0) + (p.views or 0)
    max_views = max(by_cat.values()) if by_cat else 1
    category_performance = [
        {"category": cat, "score": int(round((views / max_views) * 100))}
        for cat, views in sorted(by_cat.items(), key=lambda x: x[1], reverse=True)
    ]
    if not category_performance:
        category_performance = [
            {"category": "Diyas", "score": 98},
            {"category": "Pashmina", "score": 86},
            {"category": "Silk Zari", "score": 92},
            {"category": "Dhokra", "score": 74},
        ]

    scale = max(total_views / 1395, 0.6)
    monthly_trend = [{"day": row["day"], "views": int(row["views"] * scale)} for row in WEEKLY]

    return {
        "total_products": len(products),
        "active_listings": len(published),
        "total_views": total_views,
        "buyer_requests": len(requests),
        "estimated_revenue": estimated_revenue,
        "best_product": best,
        "monthly_trend": monthly_trend,
        "category_performance": category_performance,
        "demand_change_percent": 18,
    }
