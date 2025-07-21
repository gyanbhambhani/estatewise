from __future__ import annotations

from datetime import datetime
from typing import List, Dict, Any
import asyncio
import sys
from pathlib import Path

# Add shared utils to path for OpenAI client
sys.path.append(str(Path(__file__).parent.parent.parent / "shared" / "utils"))

try:
    from openai_client import OpenAIClient
except ImportError:
    OpenAIClient = None


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


async def generate_gpt_analysis(offers: List[Dict], ranked_offers: List[Dict]) -> Dict[str, Any]:
    """Generate GPT analysis of offers with summary and pros/cons table."""
    if not OpenAIClient:
        return {
            "summary": "GPT analysis not available - OpenAI client not configured",
            "pros_cons_table": []
        }
    
    try:
        client = OpenAIClient()
        
        # Prepare offers data for GPT
        offers_data = []
        for i, offer in enumerate(ranked_offers):
            offer_info = {
                "rank": i + 1,
                "price": offer.get("price", 0),
                "close_date": offer.get("close_date", "Unknown"),
                "contingencies": offer.get("contingencies", []),
                "buyer_letter": offer.get("buyer_letter", ""),
                "score": offer.get("score", 0),
                "financing": offer.get("financing", "Unknown"),
                "earnest_money": offer.get("earnest_money", 0)
            }
            offers_data.append(offer_info)
        
        system_prompt = """You are a real estate expert analyzing multiple offers for a property. 
        Provide a concise summary of which offer is strongest and why, plus a detailed pros/cons table for each offer.
        
        Focus on:
        - Price strength relative to market
        - Financing terms and reliability
        - Closing timeline
        - Contingencies and risk factors
        - Buyer qualifications and earnest money
        - Overall offer attractiveness for the seller
        
        Format your response as JSON with:
        {
            "summary": "2-3 sentence summary of the strongest offer",
            "pros_cons_table": [
                {
                    "rank": 1,
                    "price": "$X",
                    "pros": ["pro1", "pro2", "pro3"],
                    "cons": ["con1", "con2"],
                    "overall_assessment": "Brief assessment"
                }
            ]
        }"""
        
        user_prompt = f"""Analyze these {len(offers_data)} offers for a property:
        
        {offers_data}
        
        Provide a summary of which offer is strongest and a pros/cons table for each offer."""
        
        response = await client.chat(
            messages=[{"role": "user", "content": user_prompt}],
            system=system_prompt
        )
        
        # Extract JSON from response
        analysis = client.extract_json(response)
        
        # Fallback if JSON extraction fails
        if not analysis:
            analysis = {
                "summary": f"GPT analysis generated for {len(offers_data)} offers. Top offer: ${ranked_offers[0].get('price', 0):,} with score {ranked_offers[0].get('score', 0)}",
                "pros_cons_table": []
            }
        
        return analysis
        
    except Exception as e:
        return {
            "summary": f"Error generating GPT analysis: {str(e)}",
            "pros_cons_table": []
        }


def create_pros_cons_table(offers: List[Dict]) -> List[Dict[str, Any]]:
    """Create a pros/cons table for offers without GPT."""
    table = []
    
    for i, offer in enumerate(offers):
        pros = []
        cons = []
        
        # Analyze price
        price = offer.get("price", 0)
        if price > 0:
            pros.append(f"Price: ${price:,}")
        
        # Analyze contingencies
        contingencies = offer.get("contingencies", [])
        if not contingencies:
            pros.append("No contingencies")
        else:
            cons.append(f"{len(contingencies)} contingencies")
        
        # Analyze closing date
        close_date = offer.get("close_date")
        if close_date:
            try:
                close_dt = datetime.fromisoformat(close_date)
                days_to_close = (close_dt - datetime.now()).days
                if days_to_close <= 30:
                    pros.append("Quick closing")
                elif days_to_close > 60:
                    cons.append("Long closing timeline")
            except:
                pass
        
        # Analyze financing
        financing = offer.get("financing", "")
        if "cash" in financing.lower():
            pros.append("Cash offer")
        elif "conventional" in financing.lower():
            pros.append("Conventional financing")
        else:
            cons.append("Financing uncertainty")
        
        # Analyze earnest money
        earnest_money = offer.get("earnest_money", 0)
        if earnest_money > 0:
            pros.append(f"Earnest money: ${earnest_money:,}")
        
        # Overall assessment
        score = offer.get("score", 0)
        if score >= 80:
            assessment = "Strong offer"
        elif score >= 60:
            assessment = "Good offer"
        else:
            assessment = "Weak offer"
        
        table.append({
            "rank": i + 1,
            "price": f"${price:,}" if price else "Unknown",
            "pros": pros,
            "cons": cons,
            "overall_assessment": assessment
        })
    
    return table
