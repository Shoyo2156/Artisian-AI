from __future__ import annotations

from models.buyer_request import BuyerRequest
from models.notification import Notification
from models.product import Product
from models.user import User
from utils import loads, relative_time


def artisan_to_frontend(user: User, products: list[Product] | None = None, requests: list[BuyerRequest] | None = None) -> dict:
    products = products if products is not None else list(user.products or [])
    requests = requests if requests is not None else list(user.buyer_requests or [])
    active = [p for p in products if p.status == "published"]
    return {
        "id": user.id,
        "name": user.name,
        "role": user.business_type or f"Master {user.craft_type} Artisan",
        "location": user.region or user.state,
        "avatar": user.profile_image,
        "experienceYears": user.years_experience or 0,
        "totalProducts": len(products),
        "activeListings": len(active),
        "buyerEnquiries": len(requests),
        "monthlyEarnings": user.monthly_earnings or 0,
        "primaryCraft": user.craft_type or "Pottery",
        "phone": user.mobile,
        "bio": user.bio,
        "verified": (user.verification_status or "").lower() in ("verified", "gold", "complete"),
    }


def product_to_frontend(product: Product, artisan: User | None = None) -> dict:
    artisan = artisan or product.artisan
    tags = loads(product.tags, [])
    badges = loads(product.badges, ["Handmade"])
    production = product.production_cost or (
        (product.material_cost or 0) + (product.labour_cost or 0) + (product.other_cost or 0)
    )
    story = product.product_story or product.english_description or product.description or ""
    return {
        "id": product.id,
        "title": product.title,
        "hindiTitle": product.hindi_title,
        "price": int(product.listing_price or product.recommended_price or 0),
        "category": product.category,
        "tags": tags,
        "materials": product.material or "",
        "craftTechnique": product.craft_technique,
        "craftOrigin": product.craft_origin,
        "badges": badges,
        "originalImage": product.original_image,
        "enhancedImage": product.enhanced_image,
        "artisanName": artisan.name if artisan else "",
        "artisanLocation": artisan.region if artisan else "",
        "artisanAvatar": artisan.profile_image if artisan else "",
        "story": story,
        "hindiStory": product.hindi_story or product.hindi_description,
        "hindiSpeechTranscript": product.voice_transcription,
        "status": product.status,
        "costBreakdown": {
            "material": int(product.material_cost or 0),
            "labor": int(product.labour_cost or 0),
            "other": int(product.other_cost or 0),
            "totalBase": int(production),
        },
        "inStock": bool(product.in_stock),
        "viewsCount": product.views or 0,
        "likesCount": product.likes_count or 0,
        "buyerRequestsCount": product.buyer_requests_count or 0,
        "artisanId": product.artisan_id,
    }


def request_to_frontend(req: BuyerRequest) -> dict:
    status = req.status
    if status == "rejected":
        status = "declined"
    return {
        "id": req.id,
        "buyerName": req.buyer_name,
        "buyerCompany": req.buyer_organization,
        "title": req.title or f"Order enquiry ({req.quantity} pcs)",
        "productImage": req.product_image,
        "quantity": req.quantity,
        "expectedDelivery": req.expected_delivery or "",
        "status": status,
        "totalValue": int(req.offered_price or 0),
        "messages": loads(req.messages, []),
        "productId": req.product_id,
        "artisanId": req.artisan_id,
        "message": req.message,
    }


def notification_to_frontend(item: Notification) -> dict:
    return {
        "id": item.id,
        "title": item.title,
        "message": item.message,
        "type": item.type,
        "time": relative_time(item.created_at),
        "read": bool(item.is_read),
        "actionTarget": item.action_target,
        "relatedId": item.related_id,
    }
