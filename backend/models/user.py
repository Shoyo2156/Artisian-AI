from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, Text
from sqlalchemy.orm import relationship

from database.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    mobile = Column(String(20), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    craft_type = Column(String(80), default="Pottery")
    state = Column(String(80), default="Gujarat")
    region = Column(String(120), default="Bhuj, Gujarat")
    preferred_language = Column(String(10), default="en")
    years_experience = Column(Integer, default=0)
    business_type = Column(String(120), default="Artisan")
    profile_image = Column(Text, default="")
    verification_status = Column(String(40), default="verified")
    bio = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)

    products = relationship("Product", back_populates="artisan")
    buyer_requests = relationship("BuyerRequest", back_populates="artisan")
    notifications = relationship("Notification", back_populates="user")
