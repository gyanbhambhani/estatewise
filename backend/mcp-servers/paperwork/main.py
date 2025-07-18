#!/usr/bin/env python3
"""
Paperwork MCP Server - Handles contract and escrow document management
"""
import os
import sys
import asyncio
from pathlib import Path

# Add shared utils to path
sys.path.append(str(Path(__file__).parent.parent / "shared" / "utils"))

from fastmcp import FastMCP
from tools.document_tools import DocumentTools

# Initialize FastMCP server
server = FastMCP("PaperworkMCP")

# Create document tools instance
doc_tools = DocumentTools()

# Register tools using the @tool decorator
@server.tool
def ping():
    """Test connection to Paperwork MCP server"""
    return doc_tools.ping()

@server.tool
def fill_contract(contract_type: str, transaction_data: dict, template_path: str = None):
    """Fill out a contract with transaction data"""
    return doc_tools.fill_contract(contract_type, transaction_data, template_path)

@server.tool
def track_document(document_id: str, status: str, notes: str = None):
    """Track document status and progress"""
    return doc_tools.track_document(document_id, status, notes)

@server.tool
def send_document(document_id: str, recipient_email: str, message: str = None, delivery_method: str = "email"):
    """Send document to recipient"""
    return doc_tools.send_document(document_id, recipient_email, message, delivery_method)

@server.tool
def draft_contract(address: str, buyer_name: str, offer_price: float):
    """Draft a friendly, natural language contract for a property purchase"""
    return doc_tools.draft_contract(address, buyer_name, offer_price)

if __name__ == "__main__":
    port = int(os.getenv("PAPERWORK_MCP_PORT", 3002))
    print(f"📄 Starting Paperwork MCP Server on port {port}")
    asyncio.run(server.run_http_async(port=port)) 