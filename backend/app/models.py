from pydantic import BaseModel
from typing import List, Optional

class Restaurant(BaseModel):
    name: str
    address: str
    phone: str
    cuisine_type: str

class MenuItem(BaseModel):
    name: str
    description: str
    price: float
    restaurant_id: str
    allergens: List[str] = []

class Allergen(BaseModel):
    name: str
    description: Optional[str] = None
