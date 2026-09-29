from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from models.buyer_request import BuyerRequest
from models.notification import Notification
from models.product import Product
from models.user import User
from services.auth_service import hash_password
from services.pricing_service import recommend_price

ARTISAN_ID = "artisan_radha"
DEMO_MOBILE = "9876543210"
AVATAR = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"


def seed_if_empty(db: Session) -> None:
    if db.query(User).first():
        return
    seed(db)


def seed(db: Session) -> None:
    artisan = db.query(User).filter(User.id == ARTISAN_ID).first()
    if not artisan:
        artisan = User(
            id=ARTISAN_ID,
            name="Radha Devi",
            mobile=DEMO_MOBILE,
            password_hash=hash_password("artisan123"),
            craft_type="Pottery",
            state="Gujarat",
            region="Bhuj, Gujarat",
            preferred_language="en",
            years_experience=25,
            business_type="Master Potter & Weaver",
            profile_image=AVATAR,
            verification_status="verified",
            bio="National Award recipient honoring 25 years of heritage wheel pottery and indigo mud-resist textiles in Kutch.",
            created_at=datetime.utcnow() - timedelta(days=120),
        )
        db.add(artisan)
        db.flush()

    products_data = [
        {
            "id": "prod_1",
            "title": "Terracotta Hand-Painted Vase",
            "hindi_title": "हस्तनिर्मित मिट्टी का चित्रित फूलदान",
            "category": "Pottery",
            "tags": ["Home Decor", "Terracotta", "Natural Dyes", "Heritage Clay"],
            "material": "Natural River Clay, Organic Rice Paste White Pigments",
            "craft_technique": "Wheel Throwing & Sun Curing",
            "craft_origin": "Kutch Heritage, Gujarat",
            "badges": ["Handmade", "Eco-friendly", "Verified Artisan"],
            "original_image": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
            "enhanced_image": "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80",
            "voice_transcription": "यह एक हस्तशिल्प मिट्टी का फूलदान है, जिसे मैंने चाक पर अपने हाथों से बनाया है। इस पर कच्ची मिट्टी और चावल के लेप से पारंपरिक मांडणा चित्रकारी की गई है।",
            "story": "In the heart of rural Gujarat, the rhythmic turning of the potter's wheel has been the heartbeat of Radha Devi's family for three generations. This terracotta vase is shaped by hand using alluvial river silt, sun-dried for 48 hours, and decorated with freehand tribal motifs painted using fine bamboo brushes and rice paste.",
            "hindi_story": "गुजरात के ग्रामीण अंचल में, कुम्हार के चाक की निरंतर गति तीन पीढ़ियों से हमारे परिवार की धड़कन रही है। यह मटका प्राकृतिक नदी की मिट्टी से बना है और इसे धूप में पकाकर प्राकृतिक रंगों से सजाया गया है।",
            "costs": (350, 250, 50),
            "price": 899,
            "status": "published",
            "views": 342,
            "likes": 58,
            "requests": 5,
        },
        {
            "id": "prod_2",
            "title": "Heritage Katan Silk Saree",
            "hindi_title": "पारंपरिक कतान सिल्क साड़ी",
            "category": "Textiles",
            "tags": ["Traditional Wear", "Pure Zari", "Handloom"],
            "material": "Pure Mulberry Silk & 24K Gold Zari Thread",
            "craft_technique": "Pit Loom Weaving",
            "craft_origin": "Varanasi Weavers Colony",
            "badges": ["Handmade", "Verified Artisan", "Best Seller"],
            "original_image": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
            "enhanced_image": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
            "voice_transcription": "",
            "story": "Woven on heritage pit-looms taking over 18 days of precision shuttle work, incorporating royal floral brocade motifs inspired by historical Indian art.",
            "hindi_story": "18 दिनों की गहन मेहनत से बुनी गई यह साड़ी शुद्ध शहतूत रेशम और सुनहरी ज़री के काम से सुसज्जित है।",
            "costs": (3200, 2800, 400),
            "price": 8500,
            "status": "published",
            "views": 890,
            "likes": 142,
            "requests": 3,
        },
        {
            "id": "prod_3",
            "title": "Natural Cooling Terracotta Matka",
            "hindi_title": "प्राकृतिक शीतलन मिट्टी का मटका",
            "category": "Pottery",
            "tags": ["Kitchenware", "Natural Cooling", "Eco Living"],
            "material": "Alluvial River Clay & Organic Shellac Polish",
            "craft_technique": "Wood-Fired Kiln Baking",
            "craft_origin": "Narmada Basin, Gujarat",
            "badges": ["Handmade", "Eco-friendly"],
            "original_image": "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
            "enhanced_image": "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
            "voice_transcription": "",
            "story": "Crafted with fine alluvial silt from riverbeds, kiln-fired with dried wood husk to maintain micropores for authentic evaporative water cooling.",
            "hindi_story": "नदी किनारे की बारीक चिकनी मिट्टी से बना यह मटका प्राकृतिक रूप से पानी को ठंडा और स्वादिष्ट रखता है।",
            "costs": (400, 300, 80),
            "price": 1200,
            "status": "published",
            "views": 520,
            "likes": 94,
            "requests": 2,
        },
        {
            "id": "prod_4",
            "title": "Oxidized Silver Filigree Choker",
            "hindi_title": "ऑक्सीडाइज्ड सिल्वर फिलीग्री चोकर",
            "category": "Jewelry",
            "tags": ["Filigree", "Tribal Jewelry", "925 Silver"],
            "material": "92.5 Oxidized Sterling Silver Alloy",
            "craft_technique": "Tarakasi Wire Weaving",
            "craft_origin": "Cuttack, Odisha",
            "badges": ["Handmade", "Verified Artisan"],
            "original_image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
            "enhanced_image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
            "voice_transcription": "",
            "story": "Tarakasi filigree delicate metal craft from Cuttack, with crescent moon motifs worn during classical Odissi dances.",
            "hindi_story": "",
            "costs": (1100, 700, 120),
            "price": 2450,
            "status": "published",
            "views": 674,
            "likes": 110,
            "requests": 1,
        },
        {
            "id": "prod_5",
            "title": "Indigo Hand-Block Printed Scarf",
            "hindi_title": "इंडिगो हैंड-ब्लॉक प्रिंटेड दुपट्टा",
            "category": "Textiles",
            "tags": ["Dabu Print", "Organic Cotton", "Vegetable Dye"],
            "material": "Natural Fermented Indigo Vat & Organic Khadi",
            "craft_technique": "Dabu Mud-Resist Block Printing",
            "craft_origin": "Bagru & Kutch",
            "badges": ["Handmade", "Eco-friendly", "Best Seller"],
            "original_image": "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80",
            "enhanced_image": "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80",
            "voice_transcription": "",
            "story": "Hand block-printed with mud-resist Dabu paste and immersed 7 times in fermented indigo vats under desert sun.",
            "hindi_story": "",
            "costs": (480, 390, 70),
            "price": 1250,
            "status": "draft",
            "views": 120,
            "likes": 18,
            "requests": 0,
        },
        {
            "id": "prod_6",
            "title": "Hand-Carved Sheesham Spice Box",
            "hindi_title": "हस्तनिर्मित शीशम मसाला डिब्बा",
            "category": "Woodcraft",
            "tags": ["Kitchenware", "Sheesham", "Hand Carved"],
            "material": "Seasoned Sheesham Wood & Natural Beeswax Finish",
            "craft_technique": "Hand Carving & Joinery",
            "craft_origin": "Saharanpur, Uttar Pradesh",
            "badges": ["Handmade", "Sustainable", "Verified Artisan"],
            "original_image": "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80",
            "enhanced_image": "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80",
            "voice_transcription": "यह शीशम की लकड़ी का मसाला बॉक्स है जिसे हमने हाथ से तराशा है।",
            "story": "Carved from aged sheesham in Saharanpur workshops, this spice box uses interlocking joinery and a food-safe beeswax finish so kitchens keep heritage close at hand.",
            "hindi_story": "सहारनपुर की कार्यशाला में पुरानी शीशम लकड़ी से तराशा गया यह मसाला बॉक्स रसोई में परंपरा को सहेजता है।",
            "costs": (520, 410, 90),
            "price": 1650,
            "status": "published",
            "views": 248,
            "likes": 41,
            "requests": 1,
        },
    ]

    for item in products_data:
        if db.query(Product).filter(Product.id == item["id"]).first():
            continue
        mat, lab, oth = item["costs"]
        pricing = recommend_price(mat, lab, oth, item["category"])
        db.add(
            Product(
                id=item["id"],
                artisan_id=ARTISAN_ID,
                title=item["title"],
                hindi_title=item["hindi_title"],
                description=item["story"],
                category=item["category"],
                material=item["material"],
                tags=item["tags"],
                badges=item["badges"],
                original_image=item["original_image"],
                enhanced_image=item["enhanced_image"],
                voice_transcription=item["voice_transcription"],
                detected_language="hi",
                english_description=item["story"],
                hindi_description=item["hindi_story"],
                product_story=item["story"],
                hindi_story=item["hindi_story"],
                craft_technique=item["craft_technique"],
                craft_origin=item["craft_origin"],
                material_cost=mat,
                labour_cost=lab,
                other_cost=oth,
                production_cost=pricing["production_cost"],
                recommended_price=item["price"],
                min_price=pricing["min_price"],
                max_price=pricing["max_price"],
                status=item["status"],
                views=item["views"],
                likes_count=item["likes"],
                buyer_requests_count=item["requests"],
                in_stock=True,
                created_at=datetime.utcnow() - timedelta(days=20),
            )
        )

    requests = [
        {
            "id": "order_fabindia",
            "product_id": "prod_1",
            "buyer_name": "Priya Sharma (Procurement Lead)",
            "buyer_organization": "FabIndia",
            "quantity": 50,
            "offered_price": 44950,
            "message": "Namaste Radha ji! We love your terracotta hand-painted vases. We want to place an order for 50 pieces for our Diwali Heritage Collection. Can you deliver by Oct 15?",
            "status": "pending",
            "title": "Order Enquiry for 50 Terracotta Vases",
            "product_image": "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=300&q=80",
            "expected_delivery": "15 Oct, 2024",
            "messages": [
                {
                    "sender": "buyer",
                    "text": "Namaste Radha ji! We love your terracotta hand-painted vases. We want to place an order for 50 pieces for our Diwali Heritage Collection. Can you deliver by Oct 15?",
                    "time": "10:15 AM",
                },
                {
                    "sender": "artisan",
                    "text": "Namaste! Yes, our workshop can handcraft all 50 pieces with natural sun-curing. Would you prefer the white geometric motif or floral border?",
                    "time": "10:45 AM",
                },
            ],
        },
        {
            "id": "order_tata",
            "product_id": "prod_5",
            "buyer_name": "Vikram Mehta",
            "buyer_organization": "Tata CLiQ Luxury",
            "quantity": 20,
            "offered_price": 25000,
            "message": "Confirmed batch of 20 indigo scarves. Advance payment has been disbursed to your artisan account.",
            "status": "accepted",
            "title": "Custom Order for 20 Katan Silk Scarves",
            "product_image": "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=300&q=80",
            "expected_delivery": "28 Oct, 2024",
            "messages": [
                {
                    "sender": "buyer",
                    "text": "Confirmed batch of 20 indigo scarves. Advance payment has been disbursed to your artisan account.",
                    "time": "Yesterday",
                }
            ],
        },
        {
            "id": "order_amazon",
            "product_id": "prod_3",
            "buyer_name": "Ananya Iyer",
            "buyer_organization": "Amazon Karigar",
            "quantity": 40,
            "offered_price": 38400,
            "message": "We would like 40 cooling matkas for a summer wellness drop. Can you confirm kiln capacity this month?",
            "status": "pending",
            "title": "Bulk enquiry for 40 Natural Cooling Matkas",
            "product_image": "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=300&q=80",
            "expected_delivery": "12 Nov, 2024",
            "messages": [
                {
                    "sender": "buyer",
                    "text": "We would like 40 cooling matkas for a summer wellness drop. Can you confirm kiln capacity this month?",
                    "time": "Yesterday",
                }
            ],
        },
    ]
    for item in requests:
        if db.query(BuyerRequest).filter(BuyerRequest.id == item["id"]).first():
            continue
        db.add(
            BuyerRequest(
                id=item["id"],
                product_id=item["product_id"],
                artisan_id=ARTISAN_ID,
                buyer_name=item["buyer_name"],
                buyer_organization=item["buyer_organization"],
                quantity=item["quantity"],
                offered_price=item["offered_price"],
                message=item["message"],
                status=item["status"],
                request_date=datetime.utcnow() - timedelta(hours=6),
                title=item["title"],
                product_image=item["product_image"],
                expected_delivery=item["expected_delivery"],
                messages=item["messages"],
            )
        )

    notes = [
        {
            "id": "notif_1",
            "title": "New Bulk Order Request",
            "message": "FabIndia sent an enquiry for 50 Terracotta Hand-Painted Vases valued at ₹44,950.",
            "type": "buyer_request",
            "is_read": False,
            "action_target": "insights",
            "hours": 0.2,
        },
        {
            "id": "notif_2",
            "title": "Product Published Successfully",
            "message": 'Your listing "Heritage Katan Silk Saree" is now live on Artisan AI Marketplace.',
            "type": "product_published",
            "is_read": False,
            "action_target": "my_products",
            "hours": 2,
        },
        {
            "id": "notif_3",
            "title": "Smart Pricing Opportunity",
            "message": "High demand detected in Pottery category. Suggested optimal price is ₹899 (+18% margin).",
            "type": "price_updated",
            "is_read": True,
            "action_target": "insights",
            "hours": 24,
        },
        {
            "id": "notif_4",
            "title": "Artisan Verification Complete",
            "message": "Your Master Craft Certificate has been verified by the Artisan AI Council with a verified gold badge.",
            "type": "verification",
            "is_read": True,
            "action_target": "profile",
            "hours": 48,
        },
        {
            "id": "notif_5",
            "title": "Batch Dispatched",
            "message": "Tata CLiQ Luxury order shipment #ORD-882 is in transit to Mumbai hub.",
            "type": "order_dispatched",
            "is_read": True,
            "action_target": "insights",
            "hours": 72,
        },
    ]
    for item in notes:
        if db.query(Notification).filter(Notification.id == item["id"]).first():
            continue
        db.add(
            Notification(
                id=item["id"],
                user_id=ARTISAN_ID,
                title=item["title"],
                message=item["message"],
                type=item["type"],
                is_read=item["is_read"],
                action_target=item["action_target"],
                related_id="",
                created_at=datetime.utcnow() - timedelta(hours=item["hours"]),
            )
        )

    db.commit()
    print("[artisan-ai] Seed data loaded (Radha Devi, 6 products, 3 buyer requests, notifications).")


if __name__ == "__main__":
    from database.db import SessionLocal, create_tables

    create_tables()
    session = SessionLocal()
    try:
        seed_if_empty(session)
    finally:
        session.close()
