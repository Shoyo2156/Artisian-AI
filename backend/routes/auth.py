from datetime import datetime
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.db import get_db
from models.user import User
from schemas.common import LoginRequest, RegisterRequest
from services.auth_service import create_access_token, hash_password, verify_password
from services.deps import get_current_user
from services.serializers import artisan_to_frontend

router = APIRouter(prefix="/auth", tags=["auth"])


def _digits(mobile: str) -> str:
    return "".join(ch for ch in (mobile or "") if ch.isdigit())[-10:]


def _location_parts(location: str | None, state: str | None, region: str | None):
    loc = location or region or "Bhuj, Gujarat"
    parts = [p.strip() for p in loc.split(",") if p.strip()]
    st = state or (parts[-1] if parts else "Gujarat")
    return loc, st


@router.post("/register")
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    mobile = _digits(payload.mobile)
    if len(mobile) != 10:
        raise HTTPException(status_code=400, detail="Enter a 10-digit mobile number")
    existing = db.query(User).filter(User.mobile == mobile).first()
    if existing:
        raise HTTPException(status_code=400, detail="An artisan with this mobile already exists")

    region, state = _location_parts(payload.location, payload.state, payload.region)
    user = User(
        id=f"artisan_{uuid4().hex[:10]}",
        name=payload.name,
        mobile=mobile,
        password_hash=hash_password(payload.password),
        craft_type=payload.craft_type or "Pottery",
        state=state,
        region=region,
        preferred_language=payload.preferred_language or "en",
        years_experience=payload.years_experience or 0,
        business_type=payload.business_type or "Artisan",
        profile_image=payload.profile_image
        or "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
        verification_status="pending",
        bio="",
        created_at=datetime.utcnow(),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {
        "access_token": create_access_token(user.id),
        "token_type": "bearer",
        "user": artisan_to_frontend(user),
    }


@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    mobile = _digits(payload.mobile)
    user = db.query(User).filter(User.mobile == mobile).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid mobile or password")
    return {
        "access_token": create_access_token(user.id),
        "token_type": "bearer",
        "user": artisan_to_frontend(user),
    }


@router.get("/me")
def me(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    from models.buyer_request import BuyerRequest
    from models.product import Product

    products = db.query(Product).filter(Product.artisan_id == user.id).all()
    requests = db.query(BuyerRequest).filter(BuyerRequest.artisan_id == user.id).count()
    extra = {
        "totalProducts": len(products),
        "activeListings": len([p for p in products if p.status == "published"]),
        "buyerEnquiries": requests,
        "monthlyEarnings": int(sum((p.recommended_price or 0) * 0.2 for p in products if p.status == "published")),
    }
    return artisan_to_frontend(user, extra)
