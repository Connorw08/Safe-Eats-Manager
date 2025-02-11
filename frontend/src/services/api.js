// src/services/api.js

const BASE_URL = 'http://localhost:8000'; // Update this to match your FastAPI backend URL

export const api = {
    createRestaurant: async (restaurantData) => {
        try {
          const response = await fetch(`${BASE_URL}/restaurants/`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify(restaurantData),
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.detail || 'Failed to create restaurant');
          }
          
          return response.json();
        } catch (error) {
          console.error('Detailed error:', error);
          throw error;
        }
      },

addMenuItem: async (restaurantId, menuItemData) => {
    try {
      const response = await fetch(`${BASE_URL}/restaurants/${restaurantId}/menu`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(menuItemData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Handle validation errors
        if (response.status === 422) {
          const validationErrors = data.detail.map(error => 
            `${error.loc[1]}: ${error.msg}`
          ).join(', ');
          throw new Error(`Validation error: ${validationErrors}`);
        }
        throw new Error(data.detail || 'Failed to add menu item');
      }
      
      return data;
    } catch (error) {
      console.error('Error adding menu item:', error);
      throw error;
    }
  },
      
      addAllergen: async (menuItemId, allergenData) => {
        try {
          const response = await fetch(`${BASE_URL}/menu/${menuItemId}/allergens`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify(allergenData),
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.detail || 'Failed to add allergen');
          }
          
          return response.json();
        } catch (error) {
          console.error('Detailed error:', error);
          throw error;
        }
      },
    }