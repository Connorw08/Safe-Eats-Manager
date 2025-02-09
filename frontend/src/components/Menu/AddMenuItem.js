// src/components/Menu/AddMenuItem.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../services/api';

const AddMenuItem = () => {
  const { restaurantId } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate price is a number
      const menuItemData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price) // Ensure price is a number
      };
      
      console.log('Submitting menu item:', menuItemData); // Debug log
      
      const response = await api.addMenuItem(restaurantId, menuItemData);
      setSuccess('Menu item added successfully!');
      setError('');
      setFormData({
        name: '',
        description: '',
        price: '',
      });
    } catch (error) {
      const errorMessage = error.message || 'Error adding menu item';
      setError(errorMessage);
      setSuccess('');
      console.error('Error adding menu item:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}
      
      <h2 className="text-2xl font-bold mb-6">Add Menu Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Item Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        <div>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
            rows={3}
          />
        </div>
        <div>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="number"
            step="0.01"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Menu Item
        </button>
      </form>
    </div>
  );
};

export default AddMenuItem;