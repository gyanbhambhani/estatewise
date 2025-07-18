"""
Claude API client wrapper for EstateWise MCP servers
"""
import os
import json
from typing import Dict, Any, Optional
import httpx


class ClaudeClient:
    """Wrapper for Claude API interactions"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("CLAUDE_API_KEY")
        self.model = os.getenv("CLAUDE_MODEL", "claude-3-5-sonnet-20241022")
        self.base_url = "https://api.anthropic.com/v1"
        
        if not self.api_key:
            raise ValueError("Claude API key is required")
    
    async def chat(self, messages: list, system: Optional[str] = None) -> str:
        """Send a chat message to Claude"""
        headers = {
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
        }
        
        data = {
            "model": self.model,
            "max_tokens": 4096,
            "messages": messages
        }
        
        if system:
            data["system"] = system
            
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/messages",
                headers=headers,
                json=data
            )
            response.raise_for_status()
            return response.json()["content"][0]["text"]
    
    def extract_json(self, text: str) -> Dict[str, Any]:
        """Extract JSON from Claude response"""
        try:
            # Find JSON in the response
            start = text.find('{')
            end = text.rfind('}') + 1
            if start != -1 and end != 0:
                json_str = text[start:end]
                return json.loads(json_str)
        except (json.JSONDecodeError, ValueError):
            pass
        return {} 