#!/usr/bin/env python3
"""
LeadGen MCP Server - Handles lead generation and follow-up automation
"""
import os
import sys
from pathlib import Path

# Add shared utils to path
sys.path.append(str(Path(__file__).parent.parent.parent / "shared" / "utils"))

from fastmcp import FastMCP
from tools.lead_tools import LeadGenTools

# Initialize FastMCP server
server = FastMCP("LeadGenMCP")

# Register tools
lead_tools = LeadGenTools()
server.register_tool(lead_tools.ping, "ping")
server.register_tool(lead_tools.generate_lead, "generate_lead")
server.register_tool(lead_tools.follow_up, "follow_up")
server.register_tool(lead_tools.qualify_lead, "qualify_lead")

if __name__ == "__main__":
    port = int(os.getenv("LEADGEN_MCP_PORT", 3001))
    print(f"🚀 Starting LeadGen MCP Server on port {port}")
    server.run(port=port) 