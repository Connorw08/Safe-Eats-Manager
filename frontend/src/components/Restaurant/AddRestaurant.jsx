import React, { useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';
import { api } from '../../services/api';

const AddRestaurant = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    cuisine_type: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const showToast = async (message) => {
    if (Capacitor.isNativePlatform()) {
      await Toast.show({
        text: message,
        duration: 'short',
        position: 'bottom'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.createRestaurant(formData);
      const successMessage = 'Restaurant added successfully!';
      setSuccess(successMessage);
      await showToast(successMessage);
      setError('');
      setFormData({
        name: '',
        address: '',
        phone: '',
        cuisine_type: ''
      });
    } catch (error) {
      const errorMessage = 'Error creating restaurant';
      setError(errorMessage);
      await showToast(errorMessage);
      setSuccess('');
      console.error('Error creating restaurant:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}
      
      <h2 className="text-2xl font-bold mb-6">Add New Restaurant</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Restaurant Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        <div>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Address"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            required
          />
        </div>
        <div>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required
          />
        </div>
        <div>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Cuisine Type"
            value={formData.cuisine_type}
            onChange={(e) => setFormData({...formData, cuisine_type: e.target.value})}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Restaurant
        </button>
      </form>
    </div>
  );
};

export default AddRestaurant;