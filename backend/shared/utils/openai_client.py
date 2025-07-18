"""
OpenAI API client wrapper for EstateWise MCP servers
"""
import os
import json
from typing import Dict, Any, Optional
import httpx


class OpenAIClient:
    """Wrapper for OpenAI API interactions"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        self.model = os.getenv("OPENAI_MODEL", "gpt-4o")
        self.base_url = "https://api.openai.com/v1"
        
        if not self.api_key:
            raise ValueError("OpenAI API key is required")
    
    async def chat(self, messages: list, system: Optional[str] = None) -> str:
        """Send a chat message to OpenAI"""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        # Prepare messages list
        api_messages = []
        if system:
            api_messages.append({"role": "system", "content": system})
        api_messages.extend(messages)
        
        data = {
            "model": self.model,
            "max_tokens": 4096,
            "messages": api_messages
        }
            
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/chat/completions",
                headers=headers,
                json=data
            )
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]
    
    def extract_json(self, text: str) -> Dict[str, Any]:
        """Extract JSON from OpenAI response"""
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