from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import relationship

from database.db import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(String(64), primary_key=True, index=True)
    artisan_id = Column(String(64), ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    hindi_title = Column(String(255), default="")
    description = Column(Text, default="")
    category = Column(String(80), default="Pottery")
    material = Column(String(255), default="")
    tags = Column(JSON, default=list)
    badges = Column(JSON, default=list)
    original_image = Column(Text, default="")
    enhanced_image = Column(Text, default="")
    voice_transcription = Column(Text, default="")
    detected_language = Column(String(20), default="hi")
    english_description = Column(Text, default="")
    hindi_description = Column(Text, default="")
    product_story = Column(Text, default="")
    hindi_story = Column(Text, default="")
    craft_technique = Column(String(255), default="")
    craft_origin = Column(String(255), default="")
    material_cost = Column(Float, default=0)
    labour_cost = Column(Float, default=0)
    other_cost = Column(Float, default=0)
    production_cost = Column(Float, default=0)
    recommended_price = Column(Float, default=0)
    min_price = Column(Float, default=0)
    max_price = Column(Float, default=0)
    status = Column(String(32), default="draft", index=True)
    views = Column(Integer, default=0)
    likes_count = Column(Integer, default=0)
    buyer_requests_count = Column(Integer, default=0)
    in_stock = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    artisan = relationship("User", back_populates="products")
    buyer_requests = relationship("BuyerRequest", back_populates="product")
