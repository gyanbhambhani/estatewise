#!/usr/bin/env python3
"""
Test script to verify all MCP servers are working
"""
import asyncio
import httpx
import json
from typing import Dict, Any
from pathlib import Path

# Allow importing client tools directly for local function tests
sys_path_added = str(Path(__file__).parent / "mcp-servers" / "clientside" / "tools")
import sys
if sys_path_added not in sys.path:
    sys.path.append(sys_path_added)
from client_tools import ClientTools


async def test_mcp_server(name: str, port: int) -> Dict[str, Any]:
    """Test an MCP server by calling its ping endpoint"""
    url = f"http://localhost:{port}/ping"
    
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(url)
            if response.status_code == 200:
                data = response.json()
                return {
                    "name": name,
                    "status": "success",
                    "port": port,
                    "response": data
                }
            else:
                return {
                    "name": name,
                    "status": "error",
                    "port": port,
                    "error": f"HTTP {response.status_code}"
                }
    except Exception as e:
        return {
            "name": name,
            "status": "error",
            "port": port,
            "error": str(e)
        }


async def test_generate_comps_endpoint():
    """Test the generate_comps endpoint of ClientSide MCP server"""
    url = "http://localhost:3003/generate_comps"
    test_data = {"address": "500 Maple Ave"}
    
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.post(url, json=test_data)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ generate_comps endpoint working")
                print(f"   Input: {test_data}")
                print(f"   Output: {data}")
                return True
            else:
                print(f"❌ generate_comps endpoint failed: HTTP {response.status_code}")
                return False
    except Exception as e:
        print(f"❌ generate_comps endpoint error: {e}")
        return False


def test_compare_offers_function() -> None:
    """Test the compare_offers logic with dummy data."""
    client_tools = ClientTools()
    offers = [
        {
            "price": 985000,
            "contingencies": ["inspection", "loan"],
            "close_date": "2025-08-01",
            "buyer_letter": "We love this home and will care for it forever!",
        },
        {
            "price": 990000,
            "contingencies": [],
            "close_date": "2025-07-15",
            "buyer_letter": "No buyer letter.",
        },
        {
            "price": 970000,
            "contingencies": ["loan"],
            "close_date": "2025-07-28",
            "buyer_letter": "My daughter grew up in this neighborhood.",
        },
    ]

    result = client_tools.compare_offers(offers)
    ranked = result.get("data", {}).get("ranked_offers", [])

    print("\n✅ compare_offers function executed")
    print("📋 Ranked Offers:")
    for offer in ranked:
        print(offer)

    if ranked and ranked[0]["price"] == 990000:
        print("✅ Ranking looks correct")
    else:
        print("❌ Ranking may be incorrect")


async def main():
    """Test all MCP servers"""
    print("🧪 Testing EstateWise MCP Servers")
    print("=" * 40)
    
    servers = [
        ("LeadGen MCP", 3001),
        ("Paperwork MCP", 3002),
        ("ClientSide MCP", 3003)
    ]
    
    results = []
    for name, port in servers:
        print(f"\n🔍 Testing {name} on port {port}...")
        result = await test_mcp_server(name, port)
        results.append(result)
        
        if result["status"] == "success":
            print(f"✅ {name} is running")
            print(f"   Response: {result['response']}")
        else:
            print(f"❌ {name} failed: {result['error']}")
    
    # Test generate_comps endpoint specifically
    print(f"\n🔍 Testing generate_comps endpoint...")
    await test_generate_comps_endpoint()
    
    print("\n" + "=" * 40)
    print("📊 Test Results Summary")
    print("=" * 40)
    
    successful = sum(1 for r in results if r["status"] == "success")
    total = len(results)
    
    for result in results:
        status_icon = "✅" if result["status"] == "success" else "❌"
        print(f"{status_icon} {result['name']}: {result['status']}")
    
    print(f"\n🎯 {successful}/{total} servers are running")
    
    if successful == total:
        print("🎉 All MCP servers are working correctly!")
        return True
    else:
        print("⚠️  Some MCP servers are not responding")
        return False


if __name__ == "__main__":
    success = asyncio.run(main())
    print("\n🔍 Testing compare_offers function...")
    test_compare_offers_function()
    exit(0 if success else 1)
