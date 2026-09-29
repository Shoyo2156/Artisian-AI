from datetime import datetime
from typing import Any, Optional

from models.buyer_request import BuyerRequest
from models.notification import Notification
from models.product import Product
from models.user import User


def _split_location(location: str) -> tuple[str, str]:
    parts = [p.strip() for p in (location or "").split(",") if p.strip()]
    if not parts:
        return "Gujarat", "Bhuj, Gujarat"
    if len(parts) == 1:
        return parts[0], parts[0]
    return parts[-1], ", ".join(parts)


def artisan_to_frontend(user: User, extra: Optional[dict] = None) -> dict:
    extra = extra or {}
    location = user.region or f"{user.state}"
    verified = (user.verification_status or "").lower() in ("verified", "approved", "gold")
    craft = user.craft_type or "Pottery"
    if craft not in ("Pottery", "Textiles", "Jewelry", "Woodcraft", "Metalcraft"):
        craft = "Pottery"
    return {
        "id": user.id,
        "name": user.name,
        "role": user.business_type or "Artisan",
        "location": location,
        "avatar": user.profile_image or "",
        "experienceYears": user.years_experience or 0,
        "totalProducts": extra.get("totalProducts", 0),
        "activeListings": extra.get("activeListings", 0),
        "buyerEnquiries": extra.get("buyerEnquiries", 0),
        "monthlyEarnings": extra.get("monthlyEarnings", 0),
        "primaryCraft": craft,
        "phone": user.mobile,
        "bio": user.bio or "",
        "verified": verified,
        "craft_type": user.craft_type,
        "state": user.state,
        "region": user.region,
        "preferred_language": user.preferred_language,
        "business_type": user.business_type,
        "verification_status": user.verification_status,
    }


def product_to_frontend(product: Product, artisan: Optional[User] = None) -> dict:
    artisan = artisan or product.artisan
    story = product.product_story or product.english_description or product.description or ""
    return {
        "id": product.id,
        "title": product.title,
        "hindiTitle": product.hindi_title or "",
        "price": int(product.recommended_price or 0),
        "category": product.category or "Pottery",
        "tags": product.tags or [],
        "materials": product.material or "",
        "craftTechnique": product.craft_technique or "",
        "craftOrigin": product.craft_origin or "",
        "badges": product.badges or ["Handmade"],
        "originalImage": product.original_image or "",
        "enhancedImage": product.enhanced_image or product.original_image or "",
        "artisanName": artisan.name if artisan else "",
        "artisanLocation": artisan.region if artisan else "",
        "artisanAvatar": artisan.profile_image if artisan else "",
        "story": story,
        "hindiStory": product.hindi_story or product.hindi_description or "",
        "hindiSpeechTranscript": product.voice_transcription or "",
        "status": product.status or "draft",
        "costBreakdown": {
            "material": int(product.material_cost or 0),
            "labor": int(product.labour_cost or 0),
            "other": int(product.other_cost or 0),
            "totalBase": int(product.production_cost or 0),
        },
        "inStock": bool(product.in_stock),
        "viewsCount": product.views or 0,
        "likesCount": product.likes_count or 0,
        "buyerRequestsCount": product.buyer_requests_count or 0,
        "artisan_id": product.artisan_id,
        "material_cost": product.material_cost,
        "labour_cost": product.labour_cost,
        "other_cost": product.other_cost,
        "production_cost": product.production_cost,
        "recommended_price": product.recommended_price,
        "min_price": product.min_price,
        "max_price": product.max_price,
        "voice_transcription": product.voice_transcription,
        "detected_language": product.detected_language,
        "english_description": product.english_description,
        "hindi_description": product.hindi_description,
        "product_story": product.product_story,
        "created_at": product.created_at.isoformat() if product.created_at else None,
    }


def _frontend_status(status: str) -> str:
    if status == "rejected":
        return "declined"
    return status or "pending"


def buyer_request_to_frontend(req: BuyerRequest) -> dict:
    messages = req.messages or []
    if not messages and req.message:
        messages = [{"sender": "buyer", "text": req.message, "time": "Just now"}]
    return {
        "id": req.id,
        "buyerName": req.buyer_name,
        "buyerCompany": req.buyer_organization or "",
        "title": req.title or f"Enquiry from {req.buyer_name}",
        "productImage": req.product_image or "",
        "quantity": req.quantity or 1,
        "expectedDelivery": req.expected_delivery or "",
        "status": _frontend_status(req.status),
        "totalValue": int(req.offered_price or 0),
        "messages": messages,
        "product_id": req.product_id,
        "artisan_id": req.artisan_id,
        "buyer_name": req.buyer_name,
        "buyer_organization": req.buyer_organization,
        "offered_price": req.offered_price,
        "message": req.message,
        "request_date": req.request_date.isoformat() if req.request_date else None,
    }


def _relative_time(created: Optional[datetime]) -> str:
    if not created:
        return "Just now"
    delta = datetime.utcnow() - created
    minutes = int(delta.total_seconds() // 60)
    if minutes < 1:
        return "Just now"
    if minutes < 60:
        return f"{minutes} mins ago"
    hours = minutes // 60
    if hours < 24:
        return f"{hours} hours ago"
    days = hours // 24
    return f"{days} days ago"


def notification_to_frontend(item: Notification) -> dict:
    return {
        "id": item.id,
        "title": item.title,
        "message": item.message,
        "type": item.type,
        "time": _relative_time(item.created_at),
        "read": bool(item.is_read),
        "actionTarget": item.action_target or None,
        "relatedId": item.related_id or None,
        "user_id": item.user_id,
        "is_read": item.is_read,
        "created_at": item.created_at.isoformat() if item.created_at else None,
    }


def apply_product_payload(product: Product, data: dict[str, Any], pricing: Optional[dict] = None) -> Product:
    mapping = {
        "title": "title",
        "hindiTitle": "hindi_title",
        "hindi_title": "hindi_title",
        "category": "category",
        "tags": "tags",
        "materials": "material",
        "material": "material",
        "craftTechnique": "craft_technique",
        "craft_technique": "craft_technique",
        "craftOrigin": "craft_origin",
        "craft_origin": "craft_origin",
        "badges": "badges",
        "originalImage": "original_image",
        "original_image": "original_image",
        "enhancedImage": "enhanced_image",
        "enhanced_image": "enhanced_image",
        "story": "product_story",
        "product_story": "product_story",
        "hindiStory": "hindi_story",
        "hindi_story": "hindi_story",
        "hindiSpeechTranscript": "voice_transcription",
        "voice_transcription": "voice_transcription",
        "description": "description",
        "english_description": "english_description",
        "hindi_description": "hindi_description",
        "detected_language": "detected_language",
        "status": "status",
        "inStock": "in_stock",
        "in_stock": "in_stock",
        "price": "recommended_price",
        "recommended_price": "recommended_price",
        "material_cost": "material_cost",
        "labour_cost": "labour_cost",
        "other_cost": "other_cost",
    }
    for key, attr in mapping.items():
        if key in data and data[key] is not None:
            setattr(product, attr, data[key])

    breakdown = data.get("costBreakdown") or data.get("cost_breakdown")
    if isinstance(breakdown, dict):
        product.material_cost = float(breakdown.get("material") or product.material_cost or 0)
        product.labour_cost = float(breakdown.get("labor") or breakdown.get("labour") or product.labour_cost or 0)
        product.other_cost = float(breakdown.get("other") or product.other_cost or 0)
        product.production_cost = float(
            breakdown.get("totalBase") or product.material_cost + product.labour_cost + product.other_cost
        )

    if data.get("price") is not None:
        product.recommended_price = float(data["price"])
    if data.get("story") and not product.english_description:
        product.english_description = data["story"]
        product.description = data["story"]
    if data.get("hindiStory") and not product.hindi_description:
        product.hindi_description = data["hindiStory"]

    if pricing:
        product.production_cost = pricing["production_cost"]
        if not data.get("price"):
            product.recommended_price = pricing["recommended_price"]
        product.min_price = pricing["min_price"]
        product.max_price = pricing["max_price"]
    elif product.material_cost or product.labour_cost or product.other_cost:
        product.production_cost = (product.material_cost or 0) + (product.labour_cost or 0) + (product.other_cost or 0)

    return product
