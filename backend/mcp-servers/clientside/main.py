#!/usr/bin/env python3
"""
ClientSide MCP Server - Handles client-facing tasks and communications
"""
import os
import sys
from pathlib import Path
import asyncio

# Add shared utils to path
sys.path.append(str(Path(__file__).parent.parent / "shared" / "utils"))

from fastmcp import FastMCP
from tools.client_tools import ClientTools

# Initialize FastMCP server
server = FastMCP("ClientSideMCP")

# Create client tools instance
client_tools = ClientTools()

# Register tools using the @tool decorator
@server.tool
def ping():
    """Test connection to ClientSide MCP server"""
    return client_tools.ping()

@server.tool
def generate_comps(address: str):
    """Generate comparable properties for a given address"""
    return client_tools.generate_comps(address)

@server.tool
def send_disclosure(client_email: str, disclosure_type: str, transaction_id: str = None, message: str = None):
    """Send disclosure document to client"""
    return client_tools.send_disclosure(client_email, disclosure_type, transaction_id, message)

@server.tool
async def compare_offers(offers: list):
    """Compare and rank multiple offers for a property with GPT analysis and pros/cons table"""
    return await client_tools.compare_offers(offers)

if __name__ == "__main__":
    port = int(os.getenv("CLIENTSIDE_MCP_PORT", 3003))
    print(f"👥 Starting ClientSide MCP Server on port {port}")
    asyncio.run(server.run_http_async(port=port)) 