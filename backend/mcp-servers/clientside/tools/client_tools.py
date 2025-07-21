"""
Client-facing tools for EstateWise MCP server
"""
from typing import Dict, Any, Optional, List
from datetime import datetime
import json

# Import offer utilities from sibling module. Use absolute import so the file can
# be executed directly in tests without a package context.
try:
    from .offer_utils import rank_offers, generate_gpt_analysis, create_pros_cons_table
except ImportError:
    # Fallback for when running as standalone script
    import sys
    from pathlib import Path
    sys.path.append(str(Path(__file__).parent))
    from offer_utils import rank_offers, generate_gpt_analysis, create_pros_cons_table


class ClientTools:
    """Tools for client-facing tasks and communications"""
    
    def ping(self) -> Dict[str, Any]:
        """Test connection to ClientSide MCP server"""
        return {
            "status": "success",
            "message": "ClientSide MCP server is running",
            "timestamp": datetime.now().isoformat(),
            "server": "ClientSideMCP"
        }
    
    def generate_comps(self, address: str) -> List[Dict[str, Any]]:
        """
        Generate comparable properties for a given address
        
        Args:
            address: Address to find comps for
        """
        # Mock comparable properties data
        comps = [
            {"address": "123 Oak St", "price": 950000, "sqft": 1800},
            {"address": "456 Elm St", "price": 890000, "sqft": 1700},
            {"address": "789 Pine St", "price": 970000, "sqft": 2000}
        ]
        
        return comps
    
    def send_disclosure(self, 
                       client_email: str,
                       disclosure_type: str,
                       transaction_id: Optional[str] = None,
                       message: Optional[str] = None) -> Dict[str, Any]:
        """
        Send disclosure document to client
        
        Args:
            client_email: Client's email address
            disclosure_type: Type of disclosure (agency, property, etc.)
            transaction_id: Associated transaction ID (optional)
            message: Custom message to include (optional)
        """
        disclosure_id = f"disclosure_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # TODO: Generate disclosure document
        # TODO: Send via email
        # TODO: Track delivery
        
        disclosure_data = {
            "disclosure_id": disclosure_id,
            "client_email": client_email,
            "disclosure_type": disclosure_type,
            "transaction_id": transaction_id,
            "message": message,
            "sent_at": datetime.now().isoformat(),
            "status": "sent"
        }
        
        return {
            "status": "success",
            "disclosure_id": disclosure_id,
            "message": f"Disclosure {disclosure_type} sent to {client_email}",
            "data": disclosure_data
        }
    
    async def compare_offers(self, offers: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Compare and analyze multiple offers for a property with GPT summary and pros/cons table."""
        comparison_id = f"comparison_{datetime.now().strftime('%Y%m%d_%H%M%S')}"

        # Rank offers using existing algorithm
        ranked_offers = rank_offers(offers)

        if not ranked_offers:
            return {
                "status": "error",
                "message": "No offers provided for comparison",
                "data": {
                    "comparison_id": comparison_id,
                    "total_offers": 0,
                    "ranked_offers": [],
                    "summary": "No offers provided.",
                    "pros_cons_table": [],
                    "generated_at": datetime.now().isoformat(),
                }
            }

        # Generate GPT analysis (async)
        try:
            gpt_analysis = await generate_gpt_analysis(offers, ranked_offers)
            summary = gpt_analysis.get("summary", "")
            pros_cons_table = gpt_analysis.get("pros_cons_table", [])
        except Exception as e:
            # Fallback to basic analysis if GPT fails
            top = ranked_offers[0]
            contingencies_desc = (
                "no contingencies" if not top.get("contingencies")
                else f"{len(top.get('contingencies', []))} contingencies"
            )
            summary = (
                f"The top offer stands out due to its high price of ${top['price']:,}, "
                f"{contingencies_desc}, and closing date of {top['close_date']}. "
                f"Score: {top['score']}/100"
            )
            pros_cons_table = create_pros_cons_table(ranked_offers)

        comparison_data = {
            "comparison_id": comparison_id,
            "total_offers": len(offers),
            "ranked_offers": ranked_offers,
            "summary": summary,
            "pros_cons_table": pros_cons_table,
            "generated_at": datetime.now().isoformat(),
        }

        return {
            "status": "success",
            "comparison_id": comparison_id,
            "message": f"Compared {len(offers)} offers with GPT analysis",
            "data": comparison_data,
        }
