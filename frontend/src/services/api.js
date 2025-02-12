import { Capacitor } from '@capacitor/core';
import { CapacitorHttp } from '@capacitor/core';

const BASE_URL = Capacitor.isNativePlatform() 
  ? 'https://your-production-api.com' // Update with your production API
  : 'http://localhost:8000';

const makeRequest = async (config) => {
  try {
    let response;
    
    if (Capacitor.isNativePlatform()) {
      response = await CapacitorHttp.request({
        ...config,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...config.headers
        }
      });
    } else {
      // Use regular fetch for web platform
      const fetchConfig = {
        method: config.method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...config.headers
        },
        body: config.data ? JSON.stringify(config.data) : undefined
      };
      
      const fetchResponse = await fetch(config.url, fetchConfig);
      const data = await fetchResponse.json();
      
      response = {
        status: fetchResponse.status,
        data: data
      };
    }

    if (response.status !== 200) {
      throw new Error(response.data?.detail || 'Request failed');
    }

    return response.data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export const api = {
  createRestaurant: async (restaurantData) => {
    return makeRequest({
      method: 'POST',
      url: `${BASE_URL}/restaurants/`,
      data: restaurantData
    });
  },

  getRestaurants: async () => {
    return makeRequest({
      method: 'GET',
      url: `${BASE_URL}/restaurants`
    });
  },

  addMenuItem: async (restaurantId, menuItemData) => {
    return makeRequest({
      method: 'POST',
      url: `${BASE_URL}/restaurants/${restaurantId}/menu`,
      data: menuItemData
    });
  },

  getMenuItems: async (restaurantId, filters = {}) => {
    const { dietaryCategory, allergenFree } = filters;
    let url = `${BASE_URL}/restaurants/${restaurantId}/menu`;
    
    const queryParams = new URLSearchParams();
    if (dietaryCategory) {
      queryParams.append('dietary_category', dietaryCategory);
    }
    if (allergenFree?.length > 0) {
      allergenFree.forEach(allergen => {
        queryParams.append('allergen_free', allergen);
      });
    }
    
    const queryString = queryParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    return makeRequest({
      method: 'GET',
      url
    });
  }
};