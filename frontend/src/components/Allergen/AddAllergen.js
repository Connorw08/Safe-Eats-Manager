// src/components/Allergen/AddAllergen.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../services/api';

const AddAllergen = () => {
  const { menuItemId } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.addAllergen(menuItemId, formData);
      setSuccess('Allergen added successfully!');
      setError('');
      setFormData({
        name: '',
        description: ''
      });
    } catch (error) {
      setError('Error adding allergen');
      setSuccess('');
      console.error('Error adding allergen:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}
      
      <h2 className="text-2xl font-bold mb-6">Add Allergen Information</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Allergen Name (e.g., Peanuts, Dairy, Gluten)"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        <div>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Additional details about the allergen"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={3}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Allergen
        </button>
      </form>
    </div>
  );
};

export default AddAllergen;