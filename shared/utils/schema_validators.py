"""
Schema validation utilities for EstateWise
"""
from typing import Dict, Any, List, Optional
from dataclasses import dataclass
from datetime import datetime


@dataclass
class Property:
    """Property data schema"""
    address: str
    city: str
    state: str
    zip_code: str
    price: Optional[float] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[float] = None
    square_feet: Optional[int] = None
    mls_id: Optional[str] = None
    property_type: Optional[str] = None


@dataclass
class Client:
    """Client data schema"""
    name: str
    email: str
    phone: Optional[str] = None
    client_type: str = "buyer"  # buyer, seller, both
    notes: Optional[str] = None


@dataclass
class Transaction:
    """Transaction data schema"""
    transaction_id: str
    property: Property
    clients: List[Client]
    status: str = "pending"  # pending, active, closed, cancelled
    created_at: datetime = None
    updated_at: datetime = None


def validate_property(data: Dict[str, Any]) -> Property:
    """Validate and create Property object"""
    required_fields = ["address", "city", "state", "zip_code"]
    
    for field in required_fields:
        if field not in data:
            raise ValueError(f"Missing required field: {field}")
    
    return Property(**data)


def validate_client(data: Dict[str, Any]) -> Client:
    """Validate and create Client object"""
    required_fields = ["name", "email"]
    
    for field in required_fields:
        if field not in data:
            raise ValueError(f"Missing required field: {field}")
    
    return Client(**data)


def validate_transaction(data: Dict[str, Any]) -> Transaction:
    """Validate and create Transaction object"""
    required_fields = ["transaction_id", "property", "clients"]
    
    for field in required_fields:
        if field not in data:
            raise ValueError(f"Missing required field: {field}")
    
    # Validate nested objects
    property_obj = validate_property(data["property"])
    clients = [validate_client(client) for client in data["clients"]]
    
    return Transaction(
        transaction_id=data["transaction_id"],
        property=property_obj,
        clients=clients,
        status=data.get("status", "pending"),
        created_at=data.get("created_at", datetime.now()),
        updated_at=data.get("updated_at", datetime.now())
    ) 