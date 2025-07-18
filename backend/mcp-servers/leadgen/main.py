#!/usr/bin/env python3
"""
LeadGen MCP Server - Handles lead generation and follow-up automation
"""
import os
import sys
import asyncio
from pathlib import Path

# Add shared utils to path
sys.path.append(str(Path(__file__).parent.parent / "shared" / "utils"))

from fastmcp import FastMCP
from tools.lead_tools import LeadGenTools

# Initialize FastMCP server
server = FastMCP("LeadGenMCP")

# Create lead tools instance
lead_tools = LeadGenTools()

# Register tools using the @tool decorator
@server.tool
def ping():
    """Test connection to LeadGen MCP server"""
    return lead_tools.ping()

@server.tool
def generate_lead(property_address: str, client_name: str, client_email: str, client_phone: str = None, notes: str = None):
    """Generate a new lead from property and client information"""
    return lead_tools.generate_lead(property_address, client_name, client_email, client_phone, notes)

@server.tool
def follow_up(lead_id: str, message: str, follow_up_type: str = "email"):
    """Send follow-up message to a lead"""
    return lead_tools.follow_up(lead_id, message, follow_up_type)

@server.tool
def qualify_lead(name: str, email: str, inquiry: str):
    """Qualify a real estate lead as hot, warm, or cold"""
    return lead_tools.qualify_lead(name, email, inquiry)

if __name__ == "__main__":
    port = int(os.getenv("LEADGEN_MCP_PORT", 3001))
    print(f"🚀 Starting LeadGen MCP Server on port {port}")
    asyncio.run(server.run_http_async(port=port)) 