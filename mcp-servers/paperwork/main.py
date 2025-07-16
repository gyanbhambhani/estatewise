#!/usr/bin/env python3
"""
Paperwork MCP Server - Handles contract and escrow document management
"""
import os
import sys
from pathlib import Path

# Add shared utils to path
sys.path.append(str(Path(__file__).parent.parent.parent / "shared" / "utils"))

from fastmcp import FastMCP
from tools.document_tools import DocumentTools

# Initialize FastMCP server
server = FastMCP("PaperworkMCP")

# Register tools
doc_tools = DocumentTools()
server.register_tool(doc_tools.ping, "ping")
server.register_tool(doc_tools.fill_contract, "fill_contract")
server.register_tool(doc_tools.track_document, "track_document")
server.register_tool(doc_tools.send_document, "send_document")

if __name__ == "__main__":
    port = int(os.getenv("PAPERWORK_MCP_PORT", 3002))
    print(f"📄 Starting Paperwork MCP Server on port {port}")
    server.run(port=port) 