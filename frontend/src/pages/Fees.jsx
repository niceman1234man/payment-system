import React, { useEffect, useState } from 'react';
import API from '../services/api';

const Fees = () => {
  const [fees, setFees] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCats, setLoadingCats] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ category: '', fee_name: '', amount: '', academic_year: '', semester: '', due_date: '' });

  useEffect(() => {
    API.get('/fees')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : (res.data.fees || res.data.data || []);
        setFees(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || err.message || 'Failed to load fees');
        setLoading(false);
      });

    API.get('/fee-categories')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : (res.data.categories || res.data.data || []);
        setCategories(data);
        setLoadingCats(false);
      })
      .catch(() => setLoadingCats(false));
  }, []);

  const handleCreate = async e => {
    e.preventDefault();
    setCreating(true);
    try {
      const categoryObj = categories.find(c => c._id === form.category);
      const payload = {
        category: form.category,
        // default fee_name to category name when not provided
        fee_name: form.fee_name || (categoryObj ? (categoryObj.category_name || categoryObj.name) : undefined),
        amount: Number(form.amount),
        academic_year: form.academic_year,
        semester: form.semester,
        due_date: form.due_date ? new Date(form.due_date) : undefined,
      };
      const res = await API.post('/fees', payload);
      const newFee = res.data;
      setFees(prev => [newFee, ...prev]);
      setForm({ category: '', fee_name: '', amount: '', academic_year: '', semester: '', due_date: '' });
    } catch (err) {
      alert('Create failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setCreating(false);
    }
  };

  if (loading && loadingCats) return <div className="text-center py-10">Loading fees...</div>;
  if (error) return <div className="text-center text-red-600 py-10">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Fees</h2>
      <div className="mb-6 bg-white rounded-lg p-4 shadow">
        <form className="grid grid-cols-1 md:grid-cols-3 gap-3" onSubmit={handleCreate}>
          <select
            required
            value={form.category}
            onChange={e => {
              const selectedId = e.target.value;
              const selected = categories.find(c => c._id === selectedId);
              setForm({
                ...form,
                category: selectedId,
                fee_name: form.fee_name || (selected ? (selected.category_name || selected.name) : '')
              });
            }}
            className="border px-3 py-2 rounded"
          >
            <option value="">Select category</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.category_name || c.name}</option>)}
          </select>
          <input placeholder="Fee name (optional)" value={form.fee_name} onChange={e => setForm({...form, fee_name: e.target.value})} className="border px-3 py-2 rounded" />
          <input required type="number" placeholder="Amount" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="border px-3 py-2 rounded" />
          <input placeholder="Academic year" value={form.academic_year} onChange={e => setForm({...form, academic_year: e.target.value})} className="border px-3 py-2 rounded" />
          <input placeholder="Semester" value={form.semester} onChange={e => setForm({...form, semester: e.target.value})} className="border px-3 py-2 rounded" />
          <div className="flex gap-2">
            <input placeholder="Due date" type="date" value={form.due_date} onChange={e => setForm({...form, due_date: e.target.value})} className="border px-3 py-2 rounded flex-1" />
            <button className="bg-blue-600 text-white px-4 py-2 rounded" disabled={creating}>{creating ? 'Creating...' : 'Create'}</button>
          </div>
        </form>
      </div>

      {fees.length === 0 ? (
        <div className="text-center text-gray-500">No fees found.</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full">
            <thead>
              <tr className="bg-blue-100 text-blue-700">
                <th className="py-2 px-4">Category</th>
                <th className="py-2 px-4">Fee Name</th>
                <th className="py-2 px-4">Amount</th>
                <th className="py-2 px-4">Academic Year / Semester</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fees.map(f => (
                <tr key={f._id} className="border-b hover:bg-blue-50">
                  <td className="py-2 px-4">{f.category?.category_name || f.category?.name || '-'}</td>
                  <td className="py-2 px-4">{f.fee_name}</td>
                  <td className="py-2 px-4">{f.amount}</td>
                  <td className="py-2 px-4">{f.academic_year || '-'} / {f.semester || '-'}</td>
                  <td className="py-2 px-4">—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Fees;
