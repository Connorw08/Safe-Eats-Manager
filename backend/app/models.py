from pydantic import BaseModel
from typing import List, Optional

class Allergen(BaseModel):
    id: str
    name: str

class MenuItem(BaseModel):
    name: str
    description: str
    price: float
    allergens: List[str] = []
    dietaryCategories: List[str] = []

class Restaurant(BaseModel):
    name: str
    description: Optional[str] = None