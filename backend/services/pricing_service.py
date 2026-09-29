"""Transparent demo pricing — not a trained ML model."""

from typing import Optional


def recommend_price(
    material_cost: float,
    labour_cost: float,
    other_cost: float,
    category: Optional[str] = "Pottery",
) -> dict:
    production_cost = round(float(material_cost or 0) + float(labour_cost or 0) + float(other_cost or 0), 2)
    if production_cost <= 0:
        production_cost = 1.0

    category_boost = {
        "Jewelry": 0.48,
        "Textiles": 0.42,
        "Woodcraft": 0.40,
        "Metalcraft": 0.40,
        "Pottery": 0.38,
        "Pottery & Ceramics": 0.38,
        "Home Decor": 0.36,
    }.get(category or "Pottery", 0.38)

    raw = production_cost * (1 + category_boost)
    recommended = max(int(round(raw / 100.0) * 100) - 1, int(production_cost) + 50)
    min_price = int(round(production_cost * 1.15))
    max_price = int(round(production_cost * 1.62))
    if max_price < recommended:
        max_price = recommended + 50
    expected_profit = round(recommended - production_cost, 2)
    margin_pct = round((expected_profit / production_cost) * 100)

    explanation = (
        f"Demo pricing formula (not a trained ML model): production_cost = material + labour + other "
        f"(₹{int(production_cost)}). A ~{int(category_boost * 100)}% artisan margin for {category or 'this craft'} "
        f"is applied, then rounded to a buyer-friendly ₹xx99 price. Fair range ₹{min_price}–₹{max_price} "
        f"covers ~15–62% over cost. Expected profit at the recommended price is ₹{int(expected_profit)} ({margin_pct}%)."
    )

    return {
        "production_cost": production_cost,
        "recommended_price": recommended,
        "min_price": min_price,
        "max_price": max_price,
        "expected_profit": expected_profit,
        "explanation": explanation,
        "is_demo": True,
    }
