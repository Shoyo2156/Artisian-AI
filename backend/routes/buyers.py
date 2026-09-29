from datetime import datetime, timedelta
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.db import get_db
from models.buyer_request import BuyerRequest
from models.notification import Notification
from models.product import Product
from models.user import User
from schemas.common import BuyerRequestCreate, BuyerStatusUpdate, ChatMessageCreate
from services.deps import get_active_artisan
from services.serializers import buyer_request_to_frontend

router = APIRouter(prefix="/buyer-requests", tags=["buyer-requests"])

ALLOWED_STATUS = {"pending", "accepted", "rejected", "declined"}


@router.post("")
def create_request(
    payload: BuyerRequestCreate,
    db: Session = Depends(get_db),
    artisan: User = Depends(get_active_artisan),
):
    product = None
    if payload.product_id:
        product = db.query(Product).filter(Product.id == payload.product_id).first()
    artisan_id = payload.artisan_id or (product.artisan_id if product else artisan.id)
    image = payload.product_image or (product.enhanced_image if product else "")
    title = payload.title or (f"Bulk enquiry for {payload.quantity} {product.title}" if product else "New buyer enquiry")
    req = BuyerRequest(
        id=f"order_{uuid4().hex[:10]}",
        product_id=payload.product_id,
        artisan_id=artisan_id,
        buyer_name=payload.buyer_name or "Marketplace Buyer",
        buyer_organization=payload.buyer_organization or "",
        quantity=payload.quantity or 1,
        offered_price=payload.offered_price or 0,
        message=payload.message or "",
        status="pending",
        request_date=datetime.utcnow(),
        title=title,
        product_image=image,
        expected_delivery=payload.expected_delivery or (datetime.utcnow() + timedelta(days=21)).strftime("%d %b, %Y"),
        messages=[{"sender": "buyer", "text": payload.message or "We would like to place a bulk order.", "time": "Just now"}],
    )
    db.add(req)
    if product:
        product.buyer_requests_count = (product.buyer_requests_count or 0) + 1
    note = Notification(
        id=f"notif_{uuid4().hex[:10]}",
        user_id=artisan_id,
        title="New Bulk Order Request",
        message=f"{req.buyer_name} sent an enquiry for {req.quantity} pieces valued at ₹{int(req.offered_price):,}.",
        type="buyer_request",
        is_read=False,
        action_target="insights",
        related_id=req.id,
        created_at=datetime.utcnow(),
    )
    db.add(note)
    db.commit()
    db.refresh(req)
    return buyer_request_to_frontend(req)


@router.get("")
def list_requests(
    db: Session = Depends(get_db),
    artisan: User = Depends(get_active_artisan),
):
    rows = (
        db.query(BuyerRequest)
        .filter(BuyerRequest.artisan_id == artisan.id)
        .order_by(BuyerRequest.request_date.desc())
        .all()
    )
    return [buyer_request_to_frontend(r) for r in rows]


@router.patch("/{request_id}/status")
def update_status(
    request_id: str,
    payload: BuyerStatusUpdate,
    db: Session = Depends(get_db),
    artisan: User = Depends(get_active_artisan),
):
    req = db.query(BuyerRequest).filter(BuyerRequest.id == request_id, BuyerRequest.artisan_id == artisan.id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Buyer request not found")
    status = (payload.status or "").lower()
    if status not in ALLOWED_STATUS:
        raise HTTPException(status_code=400, detail="Status must be pending, accepted, or rejected")
    if status == "declined":
        status = "rejected"
    req.status = status
    db.commit()
    db.refresh(req)
    return buyer_request_to_frontend(req)


@router.post("/{request_id}/messages")
def add_message(
    request_id: str,
    payload: ChatMessageCreate,
    db: Session = Depends(get_db),
    artisan: User = Depends(get_active_artisan),
):
    req = db.query(BuyerRequest).filter(BuyerRequest.id == request_id, BuyerRequest.artisan_id == artisan.id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Buyer request not found")
    messages = list(req.messages or [])
    messages.append(
        {
            "sender": payload.sender if payload.sender in ("buyer", "artisan") else "artisan",
            "text": payload.text,
            "time": "Just now",
        }
    )
    req.messages = messages
    db.commit()
    db.refresh(req)
    return buyer_request_to_frontend(req)
