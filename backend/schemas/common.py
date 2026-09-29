from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class LoginRequest(BaseModel):
    mobile: str
    password: str


class RegisterRequest(BaseModel):
    model_config = ConfigDict(extra="ignore", populate_by_name=True)

    name: str
    mobile: str
    password: str
    location: Optional[str] = None
    craft_type: Optional[str] = None
    business_type: Optional[str] = None
    preferred_language: Optional[str] = "en"
    years_experience: Optional[int] = 0
    state: Optional[str] = None
    region: Optional[str] = None
    profile_image: Optional[str] = None


class ProfileUpdate(BaseModel):
    model_config = ConfigDict(extra="ignore", populate_by_name=True)

    name: Optional[str] = None
    location: Optional[str] = None
    role: Optional[str] = None
    business_type: Optional[str] = None
    primaryCraft: Optional[str] = None
    craft_type: Optional[str] = None
    phone: Optional[str] = None
    mobile: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None
    profile_image: Optional[str] = None
    experienceYears: Optional[int] = None
    years_experience: Optional[int] = None
    preferred_language: Optional[str] = None
    state: Optional[str] = None
    region: Optional[str] = None
    verification_status: Optional[str] = None


class ProductWrite(BaseModel):
    model_config = ConfigDict(extra="ignore", populate_by_name=True)

    title: Optional[str] = None
    hindiTitle: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    materials: Optional[str] = None
    material: Optional[str] = None
    craftTechnique: Optional[str] = None
    craftOrigin: Optional[str] = None
    badges: Optional[List[str]] = None
    originalImage: Optional[str] = None
    enhancedImage: Optional[str] = None
    story: Optional[str] = None
    hindiStory: Optional[str] = None
    hindiSpeechTranscript: Optional[str] = None
    description: Optional[str] = None
    costBreakdown: Optional[dict] = None
    inStock: Optional[bool] = None
    status: Optional[str] = None
    material_cost: Optional[float] = None
    labour_cost: Optional[float] = None
    other_cost: Optional[float] = None
    recommended_price: Optional[float] = None
    voice_transcription: Optional[str] = None
    detected_language: Optional[str] = None
    english_description: Optional[str] = None
    hindi_description: Optional[str] = None
    product_story: Optional[str] = None


class BuyerRequestCreate(BaseModel):
    model_config = ConfigDict(extra="ignore", populate_by_name=True)

    product_id: Optional[str] = None
    artisan_id: Optional[str] = None
    buyer_name: Optional[str] = "Marketplace Buyer"
    buyer_organization: Optional[str] = None
    quantity: int = 1
    offered_price: Optional[float] = None
    message: Optional[str] = ""
    title: Optional[str] = None
    product_image: Optional[str] = None
    expected_delivery: Optional[str] = None


class BuyerStatusUpdate(BaseModel):
    status: str


class ChatMessageCreate(BaseModel):
    sender: str = "artisan"
    text: str


class PricingRequest(BaseModel):
    material_cost: float = 0
    labour_cost: float = 0
    other_cost: float = 0
    category: Optional[str] = "Pottery"
