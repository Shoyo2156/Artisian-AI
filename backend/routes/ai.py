from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Optional

from services.pricing_service import recommend_pricing

router = APIRouter(prefix="/ai", tags=["ai-demo"])


class CatalogRequest(BaseModel):
    transcript: Optional[str] = None
    title: Optional[str] = None
    category: Optional[str] = None
    image_url: Optional[str] = None


class StoryRequest(BaseModel):
    title: Optional[str] = None
    materials: Optional[str] = None
    location: Optional[str] = "Bhuj, Gujarat"


class EnhanceRequest(BaseModel):
    image_url: Optional[str] = None


class TranscribeRequest(BaseModel):
    language: Optional[str] = "hi"
    sample: Optional[str] = None


@router.post("/catalog")
def demo_catalog(payload: CatalogRequest):
    """Placeholder catalog generator. Returns realistic demo copy, not live AI."""
    return {
        "title": payload.title or "Terracotta Hand-Painted Heritage Vase",
        "hindiTitle": "हस्तनिर्मित मिट्टी का चित्रित फूलदान",
        "story": "In the heart of rural Gujarat, the rhythmic turning of the potter's wheel has been preserved across generations. This terracotta vase is shaped by hand using alluvial river silt, sun-dried for 48 hours, and decorated with freehand tribal motifs painted using fine bamboo brushes and rice paste.",
        "hindiStory": "गुजरात के ग्रामीण अंचल में, कुम्हार के चाक की निरंतर गति तीन पीढ़ियों से हमारे परिवार की धड़कन रही है। यह मटका प्राकृतिक नदी की मिट्टी से बना है और इसे धूप में पकाकर प्राकृतिक रंगों से सजाया गया है।",
        "category": payload.category or "Pottery",
        "materials": "Natural River Clay, Organic Rice Paste White Pigments",
        "craftTechnique": "Wheel Throwing & Sun Curing",
        "craftOrigin": "Kutch Heritage, Gujarat",
        "tags": ["Home Decor", "Terracotta", "Natural Dyes", "Heritage Clay", "Handmade"],
        "is_demo": True,
    }


@router.post("/story")
def demo_story(payload: StoryRequest):
    return {
        "story": (
            f"{payload.title or 'This handcrafted piece'} is made with "
            f"{payload.materials or 'locally sourced natural materials'} in {payload.location}. "
            "Every curve carries generational knowledge passed down through master artisans."
        ),
        "hindiStory": "यह हस्तशिल्प स्थानीय प्राकृतिक सामग्री से बना है और पीढ़ियों की कला को सहेजता है।",
        "is_demo": True,
    }


@router.post("/enhance-image")
def demo_enhance(payload: EnhanceRequest):
    original = payload.image_url or "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80"
    enhanced = payload.image_url or "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80"
    return {
        "original_image": original,
        "enhanced_image": enhanced,
        "preset": "Studio Pure White",
        "is_demo": True,
        "note": "Demo response only. Real image enhancement will be connected later.",
    }


@router.post("/transcribe")
def demo_transcribe(payload: TranscribeRequest):
    return {
        "transcript": payload.sample
        or "यह एक हस्तशिल्प मिट्टी का मटका है, जिसे मैंने अपने हाथों से बनाया है। इसकी खास बात यह है कि यह पानी को प्राकृतिक रूप से ठंडा रखता है।",
        "detected_language": payload.language or "hi",
        "english_description": "This handcrafted earthen clay pot is shaped entirely on the potter's wheel using organic riverbed clay. The porous terracotta naturally cools stored water through evaporative cooling.",
        "is_demo": True,
    }
