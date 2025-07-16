#!/usr/bin/env python3
"""
Test script to verify all MCP servers are working
"""
import asyncio
import httpx
import json
from typing import Dict, Any


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
    exit(0 if success else 1) 