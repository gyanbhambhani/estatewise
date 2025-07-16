#!/usr/bin/env python3
"""
Test script for generate_comps function
"""
import sys
from pathlib import Path

# Add the clientside tools to path
sys.path.append(str(Path(__file__).parent / "mcp-servers" / "clientside" / "tools"))

from client_tools import ClientTools

def test_generate_comps():
    """Test the generate_comps function with a dummy address"""
    client_tools = ClientTools()
    
    # Test with dummy address
    test_address = "500 Maple Ave"
    print(f"Testing generate_comps with address: {test_address}")
    
    try:
        result = client_tools.generate_comps(test_address)
        print("✅ Function executed successfully!")
        print("📋 Result:")
        print(result)
        
        # Verify the structure
        if isinstance(result, list) and len(result) == 3:
            print("✅ Correct return type and length")
            
            for i, comp in enumerate(result, 1):
                if all(key in comp for key in ["address", "price", "sqft"]):
                    print(f"✅ Comp {i} has correct structure")
                else:
                    print(f"❌ Comp {i} missing required fields")
        else:
            print("❌ Incorrect return type or length")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_generate_comps() 