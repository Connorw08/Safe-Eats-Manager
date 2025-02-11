import { Capacitor } from '@capacitor/core';
import { Http } from '@capacitor/core';

const BASE_URL = Capacitor.isNativePlatform() 
  ? 'https://your-production-api.com' // Update with your production API
  : 'http://localhost:8000';

export const api = {
  createRestaurant: async (restaurantData) => {
    try {
      const response = await Http.request({
        method: 'POST',
        url: `${BASE_URL}/restaurants/`,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        data: restaurantData
      });
      
      if (response.status !== 200) {
        const errorData = response.data;
        throw new Error(errorData?.detail || 'Failed to create restaurant');
      }
      
      return response.data;
    } catch (error) {
      console.error('Detailed error:', error);
      throw error;
    }
  },

  addMenuItem: async (restaurantId, menuItemData) => {
    try {
      const response = await Http.request({
        method: 'POST',
        url: `${BASE_URL}/restaurants/${restaurantId}/menu`,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        data: menuItemData
      });
      
      if (response.status === 422) {
        const validationErrors = response.data.detail.map(error => 
          `${error.loc[1]}: ${error.msg}`
        ).join(', ');
        throw new Error(`Validation error: ${validationErrors}`);
      }
      
      if (response.status !== 200) {
        throw new Error(response.data?.detail || 'Failed to add menu item');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error adding menu item:', error);
      throw error;
    }
  },

  addAllergen: async (menuItemId, allergenData) => {
    try {
      const response = await Http.request({
        method: 'POST',
        url: `${BASE_URL}/menu/${menuItemId}/allergens`,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        data: allergenData
      });
      
      if (response.status !== 200) {
        const errorData = response.data;
        throw new Error(errorData?.detail || 'Failed to add allergen');
      }
      
      return response.data;
    } catch (error) {
      console.error('Detailed error:', error);
      throw error;
    }
  }
};