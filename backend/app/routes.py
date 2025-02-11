from fastapi import APIRouter, HTTPException
from firebase_admin import db
import uuid
from models import Restaurant, MenuItem, Allergen

router = APIRouter()

@router.post("/restaurants/")
async def create_restaurant(restaurant: Restaurant):
    restaurant_id = str(uuid.uuid4())
    restaurant_dict = restaurant.dict()
    
    ref = db.reference('restaurants')
    ref.child(restaurant_id).set(restaurant_dict)
    
    return {"id": restaurant_id, **restaurant_dict}

@router.post("/restaurants/")
async def create_restaurant(restaurant: Restaurant):
    try:
        restaurant_id = str(uuid.uuid4())
        restaurant_dict = restaurant.dict()
        
        ref = db.reference('restaurants')
        print(f"Attempting to create restaurant: {restaurant_dict}")  # Debug log
        
        ref.child(restaurant_id).set(restaurant_dict)
        print(f"Successfully created restaurant with ID: {restaurant_id}")  # Debug log
        
        return {"id": restaurant_id, **restaurant_dict}
    except Exception as e:
        print(f"Error creating restaurant: {str(e)}")  # Debug log
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/restaurants/{restaurant_id}/menu")
async def add_menu_item(restaurant_id: str, menu_item: MenuItem):
    try:
        # Verify restaurant exists
        restaurant_ref = db.reference(f'restaurants/{restaurant_id}')
        restaurant_data = restaurant_ref.get()
        
        if not restaurant_data:
            raise HTTPException(status_code=404, detail=f"Restaurant {restaurant_id} not found")
        
        menu_item_id = str(uuid.uuid4())
        menu_item_dict = menu_item.dict()
        
        # Add restaurant_id to the menu item data
        menu_item_data = {
            **menu_item_dict,
            "restaurant_id": restaurant_id,
            "id": menu_item_id
        }
        
        # Store menu item
        menu_ref = db.reference('menu_items')
        menu_ref.child(menu_item_id).set(menu_item_data)
        
        return menu_item_data
        
    except Exception as e:
        print(f"Error adding menu item: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))