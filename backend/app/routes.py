from fastapi import APIRouter, HTTPException
from firebase_admin import db
from typing import Optional, List
import uuid
from models import Restaurant, MenuItem, Allergen

router = APIRouter()

# Constants for validation
VALID_ALLERGENS = {
    'milk', 'eggs', 'fish', 'tree_nuts', 'wheat', 
    'crustaceans', 'gluten_free', 'peanuts', 'soybeans', 'sesame'
}
VALID_DIETARY_CATEGORIES = {'vegan', 'vegetarian'}

@router.post("/restaurants/")
async def create_restaurant(restaurant: Restaurant):
    """
    Create a new restaurant.
    Returns the created restaurant with its generated ID.
    """
    try:
        restaurant_id = str(uuid.uuid4())
        restaurant_dict = restaurant.dict()
        
        ref = db.reference('restaurants')
        ref.child(restaurant_id).set(restaurant_dict)
        
        return {"id": restaurant_id, **restaurant_dict}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create restaurant: {str(e)}")

@router.get("/restaurants")
async def get_restaurants():
    """
    Get all restaurants.
    Returns an empty list if no restaurants exist.
    """
    try:
        ref = db.reference('restaurants')
        restaurants_data = ref.get()
        
        if not restaurants_data:
            return []
            
        return [
            {"id": restaurant_id, **restaurant_data}
            for restaurant_id, restaurant_data in restaurants_data.items()
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch restaurants: {str(e)}")
    
@router.post("/restaurants/{restaurant_id}/menu")
async def add_menu_item(restaurant_id: str, menu_item: MenuItem):
    """
    Add a menu item to a specific restaurant.
    Validates allergens and dietary categories before adding.
    """
    try:
        # Verify restaurant exists
        restaurant_ref = db.reference(f'restaurants/{restaurant_id}')
        restaurant_data = restaurant_ref.get()
        
        if not restaurant_data:
            raise HTTPException(status_code=404, detail=f"Restaurant {restaurant_id} not found")
        
        # Validate allergens
        invalid_allergens = set(menu_item.allergens) - VALID_ALLERGENS
        if invalid_allergens:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid allergens: {', '.join(invalid_allergens)}"
            )
        
        # Validate dietary categories
        invalid_categories = set(menu_item.dietaryCategories) - VALID_DIETARY_CATEGORIES
        if invalid_categories:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid dietary categories: {', '.join(invalid_categories)}"
            )
        
        menu_item_id = str(uuid.uuid4())
        menu_item_dict = menu_item.dict()
        
        menu_item_data = {
            **menu_item_dict,
            "restaurant_id": restaurant_id,
            "id": menu_item_id
        }
        
        menu_ref = db.reference('menu_items')
        menu_ref.child(menu_item_id).set(menu_item_data)
        
        return menu_item_data
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add menu item: {str(e)}")

@router.get("/restaurants/{restaurant_id}/menu")
async def get_menu_items(
    restaurant_id: str,
    dietary_category: Optional[str] = None,
    allergen_free: Optional[List[str]] = None
):
    """
    Get menu items for a specific restaurant with optional filtering.
    Supports filtering by dietary category and allergen-free requirements.
    """
    try:
        # Verify restaurant exists
        restaurant_ref = db.reference(f'restaurants/{restaurant_id}')
        restaurant_data = restaurant_ref.get()
        
        if not restaurant_data:
            raise HTTPException(status_code=404, detail=f"Restaurant {restaurant_id} not found")
        
        # Get all menu items for the restaurant
        menu_ref = db.reference('menu_items')
        menu_items = menu_ref.get()
        
        if not menu_items:
            return []
        
        # Filter menu items for this restaurant
        restaurant_menu = [
            {"id": item_id, **item_data}
            for item_id, item_data in menu_items.items()
            if item_data.get('restaurant_id') == restaurant_id
        ]
        
        # Apply dietary category filter if specified
        if dietary_category:
            restaurant_menu = [
                item for item in restaurant_menu
                if dietary_category in item.get('dietaryCategories', [])
            ]
        
        # Apply allergen-free filter if specified
        if allergen_free:
            restaurant_menu = [
                item for item in restaurant_menu
                if not any(allergen in item.get('allergens', []) for allergen in allergen_free)
            ]
        
        return restaurant_menu
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch menu items: {str(e)})")