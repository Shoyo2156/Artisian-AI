from datetime import datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import relationship

from database.db import Base


class BuyerRequest(Base):
    __tablename__ = "buyer_requests"

    id = Column(String(64), primary_key=True, index=True)
    product_id = Column(String(64), ForeignKey("products.id"), nullable=True, index=True)
    artisan_id = Column(String(64), ForeignKey("users.id"), nullable=False, index=True)
    buyer_name = Column(String(160), nullable=False)
    buyer_organization = Column(String(160), default="")
    quantity = Column(Integer, default=1)
    offered_price = Column(Float, default=0)
    message = Column(Text, default="")
    status = Column(String(32), default="pending", index=True)
    request_date = Column(DateTime, default=datetime.utcnow)
    title = Column(String(255), default="")
    product_image = Column(Text, default="")
    expected_delivery = Column(String(80), default="")
    messages = Column(JSON, default=list)

    artisan = relationship("User", back_populates="buyer_requests")
    product = relationship("Product", back_populates="buyer_requests")
