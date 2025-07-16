#!/usr/bin/env python3
"""
ClientSide MCP Server - Handles client-facing tasks and communications
"""
import os
import sys
from pathlib import Path

# Add shared utils to path
sys.path.append(str(Path(__file__).parent.parent.parent / "shared" / "utils"))

from fastmcp import FastMCP
from tools.client_tools import ClientTools

# Initialize FastMCP server
server = FastMCP("ClientSideMCP")

# Register tools
client_tools = ClientTools()
server.register_tool(client_tools.ping, "ping")
server.register_tool(client_tools.generate_comps, "generate_comps")
server.register_tool(client_tools.send_disclosure, "send_disclosure")
server.register_tool(client_tools.compare_offers, "compare_offers")

if __name__ == "__main__":
    port = int(os.getenv("CLIENTSIDE_MCP_PORT", 3003))
    print(f"👥 Starting ClientSide MCP Server on port {port}")
    server.run(port=port) 