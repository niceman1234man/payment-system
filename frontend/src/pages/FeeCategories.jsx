import React, { useEffect, useState } from 'react';
import API from '../services/api';

const FeeCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = () => {
    setLoading(true);
    API.get('/fee-categories')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : (res.data.categories || res.data.data || []);
        setCategories(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || err.message || 'Failed to load');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setCategoryName('');
    setDescription('');
    setIsActive(true);
    setEditingId(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const body = { category_name: categoryName, description, is_active: isActive };
      if (editingId) {
        await API.put(`/fee-categories/${editingId}`, body);
      } else {
        await API.post('/fee-categories', body);
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Save failed');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = cat => {
    setEditingId(cat._id);
    setCategoryName(cat.category_name || cat.name || '');
    setDescription(cat.description || '');
    setIsActive(cat.is_active !== undefined ? cat.is_active : true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await API.delete(`/fee-categories/${id}`);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Delete failed');
    }
  };

  if (loading) return <div className="text-center py-10">Loading fee categories...</div>;
  if (error) return <div className="text-center text-red-600 py-10">Error: {error}</div>;

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Fee Categories</h2>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-xl font-semibold mb-3">{editingId ? 'Edit Category' : 'Create Category'}</h3>
        <div className="grid grid-cols-1 gap-3">
          <input value={categoryName} onChange={e => setCategoryName(e.target.value)} placeholder="Category name (e.g., Registration, Penalty)" className="border px-3 py-2 rounded" required />
          <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description (optional)" className="border px-3 py-2 rounded" />
          <label className="flex items-center gap-2"><input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} /> Active</label>
          <div className="flex gap-2">
            <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-4 py-2 rounded">{submitting ? 'Saving...' : editingId ? 'Update' : 'Create'}</button>
            {editingId && <button type="button" onClick={resetForm} className="px-4 py-2 rounded border">Cancel</button>}
          </div>
        </div>
      </form>

      {categories.length === 0 ? (
        <div className="text-center text-gray-500">No fee categories found.</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full">
            <thead>
              <tr className="bg-blue-100 text-blue-700">
                <th className="py-2 px-4 text-left">Category Name</th>
                <th className="py-2 px-4 text-left">Description</th>
                <th className="py-2 px-4">Active</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat._id} className="border-b hover:bg-blue-50">
                  <td className="py-2 px-4">{cat.category_name || cat.name}</td>
                  <td className="py-2 px-4">{cat.description}</td>
                  <td className="py-2 px-4 text-center">{cat.is_active ? 'Yes' : 'No'}</td>
                  <td className="py-2 px-4 text-center">
                    <button onClick={() => startEdit(cat)} className="mr-2 text-sm text-blue-600">Edit</button>
                    <button onClick={() => handleDelete(cat._id)} className="text-sm text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FeeCategories;
