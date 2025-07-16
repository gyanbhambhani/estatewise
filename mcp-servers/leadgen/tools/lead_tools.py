"""
Lead generation tools for EstateWise MCP server
"""
from typing import Dict, Any, Optional
from datetime import datetime
import json
from shared.utils.claude_client import ClaudeClient
import asyncio


class LeadGenTools:
    """Tools for lead generation and follow-up automation"""
    
    def ping(self) -> Dict[str, Any]:
        """Test connection to LeadGen MCP server"""
        return {
            "status": "success",
            "message": "LeadGen MCP server is running",
            "timestamp": datetime.now().isoformat(),
            "server": "LeadGenMCP"
        }
    
    def generate_lead(self, 
                     property_address: str,
                     client_name: str,
                     client_email: str,
                     client_phone: Optional[str] = None,
                     notes: Optional[str] = None) -> Dict[str, Any]:
        """
        Generate a new lead from property and client information
        
        Args:
            property_address: Full property address
            client_name: Client's full name
            client_email: Client's email address
            client_phone: Client's phone number (optional)
            notes: Additional notes about the lead (optional)
        """
        lead_id = f"lead_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        lead_data = {
            "lead_id": lead_id,
            "property_address": property_address,
            "client_name": client_name,
            "client_email": client_email,
            "client_phone": client_phone,
            "notes": notes,
            "status": "new",
            "created_at": datetime.now().isoformat(),
            "last_contact": None,
            "follow_up_count": 0
        }
        
        # TODO: Save to database
        # TODO: Send welcome email
        # TODO: Add to CRM
        
        return {
            "status": "success",
            "lead_id": lead_id,
            "message": f"Lead generated successfully for {client_name}",
            "data": lead_data
        }
    
    def follow_up(self, 
                 lead_id: str,
                 message: str,
                 follow_up_type: str = "email") -> Dict[str, Any]:
        """
        Send follow-up message to a lead
        
        Args:
            lead_id: Unique identifier for the lead
            message: Follow-up message content
            follow_up_type: Type of follow-up (email, call, text)
        """
        # TODO: Validate lead exists
        # TODO: Send actual message
        # TODO: Update follow-up count
        
        follow_up_data = {
            "lead_id": lead_id,
            "message": message,
            "type": follow_up_type,
            "sent_at": datetime.now().isoformat(),
            "status": "sent"
        }
        
        return {
            "status": "success",
            "message": f"Follow-up {follow_up_type} sent to lead {lead_id}",
            "data": follow_up_data
        } 

    async def _gpt_score(self, name: str, email: str, inquiry: str) -> dict:
        """Use Claude to score the lead, or raise if not available."""
        prompt = (
            f"Given this real estate inquiry, rate the lead as hot/warm/cold and explain why.\n"
            f"Name: {name}\nEmail: {email}\nInquiry: {inquiry}\n"
            "Respond in JSON: {\"score\": \"hot|warm|cold\", \"explanation\": string}"
        )
        client = ClaudeClient()
        messages = [
            {"role": "user", "content": prompt}
        ]
        text = await client.chat(messages)
        result = client.extract_json(text)
        if not result or "score" not in result or "explanation" not in result:
            raise ValueError("Claude did not return a valid response")
        return result

    def qualify_lead(self, name: str, email: str, inquiry: str) -> dict:
        """
        Qualify a real estate lead as hot, warm, or cold using GPT/Claude or fallback logic.
        Args:
            name: Lead's name
            email: Lead's email
            inquiry: Inquiry content
        Returns:
            dict with 'score' and 'explanation'
        """
        # Try Claude/GPT first
        try:
            result = asyncio.run(self._gpt_score(name, email, inquiry))
            return result
        except Exception:
            pass  # Fallback to keyword logic

        # Fallback: simple keyword-based scoring
        inquiry_lower = inquiry.lower()
        if any(word in inquiry_lower for word in ["buy now", "urgent", "cash offer", "ready to purchase", "asap"]):
            score = "hot"
            explanation = "Inquiry contains urgent buying signals."
        elif any(word in inquiry_lower for word in ["interested", "learn more", "details", "considering"]):
            score = "warm"
            explanation = "Inquiry shows interest but not immediate intent."
        else:
            score = "cold"
            explanation = "Inquiry lacks strong buying signals."
        return {"score": score, "explanation": explanation} 