from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.db import get_db
from models.buyer_request import BuyerRequest
from models.product import Product
from models.user import User
from schemas.common import ProfileUpdate
from services.deps import get_active_artisan
from services.serializers import artisan_to_frontend

router = APIRouter(prefix="/profile", tags=["profile"])


def _stats(db: Session, user: User) -> dict:
    products = db.query(Product).filter(Product.artisan_id == user.id).all()
    requests = db.query(BuyerRequest).filter(BuyerRequest.artisan_id == user.id).count()
    published = [p for p in products if p.status == "published"]
    return {
        "totalProducts": len(products),
        "activeListings": len(published),
        "buyerEnquiries": requests,
        "monthlyEarnings": int(sum((p.recommended_price or 0) * 0.18 for p in published)) or 14500,
    }


@router.get("")
def get_profile(db: Session = Depends(get_db), artisan: User = Depends(get_active_artisan)):
    return artisan_to_frontend(artisan, _stats(db, artisan))


@router.put("")
def update_profile(
    payload: ProfileUpdate,
    db: Session = Depends(get_db),
    artisan: User = Depends(get_active_artisan),
):
    data = payload.model_dump(exclude_none=True)
    if "name" in data:
        artisan.name = data["name"]
    if "role" in data or "business_type" in data:
        artisan.business_type = data.get("business_type") or data.get("role")
    if "primaryCraft" in data or "craft_type" in data:
        artisan.craft_type = data.get("craft_type") or data.get("primaryCraft")
    if "phone" in data or "mobile" in data:
        raw = "".join(ch for ch in str(data.get("mobile") or data.get("phone")) if ch.isdigit())[-10:]
        if len(raw) == 10:
            artisan.mobile = raw
    if "bio" in data:
        artisan.bio = data["bio"]
    if "avatar" in data or "profile_image" in data:
        artisan.profile_image = data.get("profile_image") or data.get("avatar")
    if "experienceYears" in data or "years_experience" in data:
        artisan.years_experience = data.get("years_experience") or data.get("experienceYears")
    if "preferred_language" in data:
        artisan.preferred_language = data["preferred_language"]
    if "location" in data or "region" in data:
        artisan.region = data.get("region") or data.get("location")
        parts = [p.strip() for p in (artisan.region or "").split(",") if p.strip()]
        if parts:
            artisan.state = data.get("state") or parts[-1]
    if "state" in data:
        artisan.state = data["state"]
    if "verification_status" in data:
        artisan.verification_status = data["verification_status"]
    db.commit()
    db.refresh(artisan)
    return artisan_to_frontend(artisan, _stats(db, artisan))
