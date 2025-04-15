import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PlusCircle, Edit, Trash2, Save, X, Loader2 } from 'lucide-react';

const API_URL = 'https://simple-crud-epc0gtfqgtbqgwbg.canadacentral-01.azurewebsites.net/api/items';

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Load items
  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(API_URL);
      setItems(res.data);
    } catch (err) {
      setError("Failed to fetch items. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Create or Update item
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    try {
      setSubmitting(true);
      setError(null);
      
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, { name });
      } else {
        await axios.post(API_URL, { name });
      }
      
      setName('');
      setEditId(null);
      fetchItems();
    } catch (err) {
      setError(editId ? "Failed to update item." : "Failed to add item.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setName(item.name);
  };

  const handleDelete = async (id) => {
    try {
      setError(null);
      await axios.delete(`${API_URL}/${id}`);
      fetchItems();
    } catch (err) {
      setError("Failed to delete item.");
      console.error(err);
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setName('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Item Manager</h1>
            <p className="text-blue-100">Manage your items with ease</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 border-l-4 border-red-500">
              {error}
            </div>
          )}

          <div className="p-6">
            <form onSubmit={handleSubmit} className="mb-8">
              <div className="flex items-center space-x-4">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter item name"
                  className="flex-1 rounded-lg border-gray-300 shadow-sm px-4 py-2 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button 
                  type="submit"
                  disabled={submitting || !name.trim()}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  ) : editId ? (
                    <Save className="mr-2 h-4 w-4" />
                  ) : (
                    <PlusCircle className="mr-2 h-4 w-4" />
                  )}
                  {editId ? 'Update' : 'Add'} Item
                </button>
                {editId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Cancel</span>
                  </button>
                )}
              </div>
            </form>

            <div className="bg-white overflow-hidden rounded-lg shadow">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Items List</h2>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center p-12">
                  <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                  <span className="ml-2 text-gray-500">Loading items...</span>
                </div>
              ) : items.length === 0 ? (
                <div className="text-center p-12 text-gray-500">
                  No items found. Add one to get started!
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <li key={item._id} className="px-6 py-4 hover:bg-gray-50 transition duration-150">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-medium text-gray-900">{item.name}</span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 rounded-md text-blue-600 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <Edit className="h-5 w-5" />
                            <span className="sr-only">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-2 rounded-md text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            <Trash2 className="h-5 w-5" />
                            <span className="sr-only">Delete</span>
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;