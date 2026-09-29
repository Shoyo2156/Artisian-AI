from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.db import get_db
from models.notification import Notification
from models.user import User
from services.deps import get_active_artisan
from services.serializers import notification_to_frontend

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("")
def list_notifications(db: Session = Depends(get_db), artisan: User = Depends(get_active_artisan)):
    rows = (
        db.query(Notification)
        .filter(Notification.user_id == artisan.id)
        .order_by(Notification.created_at.desc())
        .all()
    )
    return [notification_to_frontend(n) for n in rows]


@router.patch("/{notification_id}/read")
def mark_read(
    notification_id: str,
    db: Session = Depends(get_db),
    artisan: User = Depends(get_active_artisan),
):
    item = (
        db.query(Notification)
        .filter(Notification.id == notification_id, Notification.user_id == artisan.id)
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Notification not found")
    item.is_read = True
    db.commit()
    db.refresh(item)
    return notification_to_frontend(item)


@router.patch("/read-all")
def mark_all_read(db: Session = Depends(get_db), artisan: User = Depends(get_active_artisan)):
    rows = db.query(Notification).filter(Notification.user_id == artisan.id, Notification.is_read.is_(False)).all()
    for item in rows:
        item.is_read = True
    db.commit()
    return {"ok": True, "updated": len(rows)}
