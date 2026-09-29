import uuid
from pathlib import Path

from typing import Any

from fastapi import APIRouter, Body, File, HTTPException, UploadFile

from config import settings
from schemas.common import PricingRequest
from services import ai_demo
from services.pricing_service import recommend_price

router = APIRouter(tags=["tools"])

UPLOAD_DIR = Path(__file__).resolve().parent.parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}


@router.post("/uploads/product-image")
async def upload_product_image(file: UploadFile = File(...)):
    content_type = (file.content_type or "").lower()
    if content_type not in ALLOWED_TYPES and not (file.filename or "").lower().endswith(
        (".jpg", ".jpeg", ".png", ".webp", ".gif")
    ):
        raise HTTPException(status_code=400, detail="Upload a JPG, PNG, WEBP, or GIF image")
    suffix = Path(file.filename or "image.jpg").suffix or ".jpg"
    name = f"{uuid.uuid4().hex}{suffix.lower()}"
    dest = UPLOAD_DIR / name
    data = await file.read()
    dest.write_bytes(data)
    base = settings.API_PUBLIC_URL.rstrip("/")
    return {"url": f"{base}/uploads/{name}", "filename": name}


@router.post("/pricing/recommend")
def pricing_recommend(payload: PricingRequest):
    return recommend_price(payload.material_cost, payload.labour_cost, payload.other_cost, payload.category)


@router.post("/ai/catalog")
def ai_catalog(payload: dict[str, Any] = Body(default={})):
    return ai_demo.demo_catalog(payload)


@router.post("/ai/story")
def ai_story(payload: dict[str, Any] = Body(default={})):
    return ai_demo.demo_story(payload)


@router.post("/ai/enhance-image")
def ai_enhance(payload: dict[str, Any] = Body(default={})):
    return ai_demo.demo_enhance_image(payload.get("image_url") or payload.get("original_image"))


@router.post("/ai/transcribe")
def ai_transcribe(payload: dict[str, Any] = Body(default={})):
    return ai_demo.demo_transcribe(payload)
