import os
import uuid
from pathlib import Path

from fastapi import APIRouter, File, UploadFile

from services.pricing_service import recommend_pricing
from schemas.product import PricingRequest

router = APIRouter(tags=["uploads-pricing-ai"])

UPLOAD_DIR = Path(__file__).resolve().parent.parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
PUBLIC_URL = os.getenv("API_PUBLIC_URL", "http://localhost:8000")


@router.post("/uploads/product-image")
async def upload_product_image(file: UploadFile = File(...)):
    suffix = Path(file.filename or "image.jpg").suffix or ".jpg"
    filename = f"{uuid.uuid4().hex}{suffix.lower()}"
    dest = UPLOAD_DIR / filename
    contents = await file.read()
    dest.write_bytes(contents)
    url = f"{PUBLIC_URL}/uploads/{filename}"
    return {"url": url, "filename": filename}


@router.post("/pricing/recommend")
def pricing_recommend(payload: PricingRequest):
    return recommend_pricing(
        payload.material_cost,
        payload.labour_cost,
        payload.other_cost,
        payload.category or "Pottery",
    )
