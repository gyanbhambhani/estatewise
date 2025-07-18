from __future__ import annotations

from datetime import datetime
from typing import List, Dict


def sentiment_score(text: str) -> float:
    """Very naive sentiment score based on positive keywords."""
    if not text:
        return 0.5
    positive_words = ["love", "care", "great", "wonderful", "amazing"]
    text_l = text.lower()
    for word in positive_words:
        if word in text_l:
            return 1.0
    return 0.5


def rank_offers(offers: List[Dict]) -> List[Dict]:
    """Rank offers using weighted scoring."""
    if not offers:
        return []

    max_price = max(o.get("price", 0) for o in offers) or 1
    max_cont = max(len(o.get("contingencies", [])) for o in offers)
    dates = [datetime.fromisoformat(o["close_date"]) for o in offers if o.get("close_date")]
    min_date = min(dates)
    max_date = max(dates)
    date_range = (max_date - min_date).days or 1

    ranked = []
    for offer in offers:
        price_norm = offer.get("price", 0) / max_price
        cont_norm = 1 - (len(offer.get("contingencies", [])) / (max_cont or 1))
        close_dt = datetime.fromisoformat(offer["close_date"]) if offer.get("close_date") else max_date
        closing_norm = 1 - ((close_dt - min_date).days / date_range)
        sentiment = sentiment_score(offer.get("buyer_letter", ""))

        score = (
            price_norm * 0.5
            + cont_norm * 0.3
            + closing_norm * 0.15
            + sentiment * 0.05
        ) * 100

        ranked_offer = dict(offer)
        ranked_offer["score"] = round(score, 1)
        ranked.append(ranked_offer)

    ranked.sort(key=lambda x: x["score"], reverse=True)
    return ranked
