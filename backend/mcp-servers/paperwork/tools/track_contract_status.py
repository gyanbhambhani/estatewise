import random
from fastmcp import tool

STATUSES = ["drafted", "sent", "pending", "signed"]

def deterministic_status(property_id: str) -> str:
    # Use hash to deterministically pick a status for a given property_id
    idx = abs(hash(property_id)) % len(STATUSES)
    return STATUSES[idx]

@tool(
    name="track_contract_status",
    description="Check the lifecycle status of a contract for a given property_id."
)
def track_contract_status(property_id: str) -> dict:
    """
    Returns the current status of a contract for the given property_id.
    Args:
        property_id: Unique property identifier
    Returns:
        dict: {"property_id": ..., "status": ...}
    """
    status = deterministic_status(property_id)
    return {
        "property_id": property_id,
        "status": status
    } 