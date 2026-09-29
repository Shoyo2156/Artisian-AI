from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from database.db import get_db
from models.user import User
from services.auth_service import decode_token

DEMO_MOBILE = "9876543210"


def _user_from_header(authorization: str | None, db: Session) -> User | None:
    if not authorization or not authorization.lower().startswith("bearer "):
        return None
    token = authorization.split(" ", 1)[1].strip()
    user_id = decode_token(token)
    if not user_id:
        return None
    return db.query(User).filter(User.id == user_id).first()


def get_current_user(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> User:
    user = _user_from_header(authorization, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    return user


def get_active_artisan(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> User:
    """JWT user when present; otherwise the seeded demo artisan so SIH screens stay filled."""
    user = _user_from_header(authorization, db)
    if user:
        return user
    demo = db.query(User).filter(User.mobile == DEMO_MOBILE).first()
    if demo:
        return demo
    first = db.query(User).first()
    if not first:
        raise HTTPException(status_code=404, detail="No artisan accounts found. Run seed.py")
    return first
