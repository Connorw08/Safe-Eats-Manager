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
        if not restaurant_ref.get():
            raise HTTPException(status_code=404, detail="Restaurant not found")
        
        menu_item_id = str(uuid.uuid4())
        menu_item_dict = menu_item.dict()
        
        # Store menu item with reference to restaurant
        menu_ref = db.reference('menu_items')
        print(f"Adding menu item: {menu_item_dict}")  # Debug log
        
        menu_ref.child(menu_item_id).set({
            **menu_item_dict,
            "restaurant_id": restaurant_id
        })
        
        print(f"Successfully added menu item with ID: {menu_item_id}")  # Debug log
        return {"id": menu_item_id, **menu_item_dict}
        
    except Exception as e:
        print(f"Error adding menu item: {str(e)}")  # Debug log
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/restaurants/{restaurant_id}/menu")
async def add_menu_item(restaurant_id: str, menu_item: MenuItem):
    try:
        # Debug logging
        print(f"Received request for restaurant {restaurant_id}")
        print(f"Menu item data: {menu_item.dict()}")
        
        # Verify restaurant exists
        restaurant_ref = db.reference(f'restaurants/{restaurant_id}')
        restaurant_data = restaurant_ref.get()
        
        if not restaurant_data:
            raise HTTPException(status_code=404, detail=f"Restaurant {restaurant_id} not found")
        
        menu_item_id = str(uuid.uuid4())
        menu_item_dict = menu_item.dict()
        
        # Store menu item with reference to restaurant
        menu_ref = db.reference('menu_items')
        
        menu_ref.child(menu_item_id).set({
            **menu_item_dict,
            "restaurant_id": restaurant_id
        })
        
        return {"id": menu_item_id, **menu_item_dict}
        
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error adding menu item: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))