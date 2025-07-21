#!/usr/bin/env python3
"""
Test script for the enhanced compare_offers functionality
"""
import asyncio
import sys
from pathlib import Path
from datetime import datetime, timedelta

# Add the clientside tools to path
sys.path.append(str(Path(__file__).parent / "mcp-servers" / "clientside" / "tools"))

from client_tools import ClientTools


async def test_compare_offers():
    """Test the enhanced compare_offers functionality"""
    
    # Sample offers data
    sample_offers = [
        {
            "price": 850000,
            "close_date": (datetime.now() + timedelta(days=30)).isoformat(),
            "contingencies": ["inspection", "financing"],
            "buyer_letter": "We love this home and are excited to make it our own!",
            "financing": "Conventional",
            "earnest_money": 25000,
            "buyer_name": "John and Sarah Smith"
        },
        {
            "price": 820000,
            "close_date": (datetime.now() + timedelta(days=45)).isoformat(),
            "contingencies": [],
            "buyer_letter": "This property is perfect for our family.",
            "financing": "Cash",
            "earnest_money": 50000,
            "buyer_name": "Mike Johnson"
        },
        {
            "price": 880000,
            "close_date": (datetime.now() + timedelta(days=60)).isoformat(),
            "contingencies": ["inspection", "appraisal", "sale_of_current_home"],
            "buyer_letter": "We are very interested in this property.",
            "financing": "FHA",
            "earnest_money": 15000,
            "buyer_name": "Lisa Chen"
        },
        {
            "price": 800000,
            "close_date": (datetime.now() + timedelta(days=20)).isoformat(),
            "contingencies": ["inspection"],
            "buyer_letter": "We are ready to move quickly on this home!",
            "financing": "Conventional",
            "earnest_money": 30000,
            "buyer_name": "David Wilson"
        }
    ]
    
    print("🏠 Testing Enhanced compare_offers Tool")
    print("=" * 50)
    
    # Create client tools instance
    client_tools = ClientTools()
    
    # Test the compare_offers function
    print(f"📊 Comparing {len(sample_offers)} offers...")
    print()
    
    try:
        result = await client_tools.compare_offers(sample_offers)
        
        if result["status"] == "success":
            data = result["data"]
            
            print("✅ Comparison completed successfully!")
            print(f"📋 Comparison ID: {data['comparison_id']}")
            print(f"📈 Total offers analyzed: {data['total_offers']}")
            print()
            
            # Display GPT summary
            print("🤖 GPT Analysis Summary:")
            print("-" * 30)
            print(data['summary'])
            print()
            
            # Display ranked offers
            print("🏆 Ranked Offers:")
            print("-" * 30)
            for i, offer in enumerate(data['ranked_offers']):
                print(f"{i+1}. ${offer['price']:,} - {offer.get('buyer_name', 'Unknown')}")
                print(f"   Score: {offer['score']}/100")
                print(f"   Closing: {offer['close_date']}")
                print(f"   Financing: {offer.get('financing', 'Unknown')}")
                print()
            
            # Display pros/cons table
            print("📊 Pros/Cons Analysis:")
            print("-" * 30)
            for item in data['pros_cons_table']:
                print(f"Rank {item['rank']}: {item['price']}")
                print(f"   Pros: {', '.join(item['pros']) if item['pros'] else 'None'}")
                print(f"   Cons: {', '.join(item['cons']) if item['cons'] else 'None'}")
                print(f"   Assessment: {item['overall_assessment']}")
                print()
                
        else:
            print(f"❌ Error: {result['message']}")
            
    except Exception as e:
        print(f"❌ Exception occurred: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(test_compare_offers()) 