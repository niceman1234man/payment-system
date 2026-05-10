import React, { useEffect, useState } from 'react';
import API from '../services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ student: '', channel: 'Email', message: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    API.get('/notifications')
      .then(res => { setNotifications(res.data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  const handleSend = async e => {
    e.preventDefault();
    setSending(true);
    try {
      // Ensure payload meets backend validation: resolve student to Student._id and set status
      let studentPayload = form.student;
      // if student looks like a university student id (not an ObjectId), resolve via /students
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(studentPayload);
      if (!isObjectId) {
        const studentsRes = await API.get('/students');
        const found = (studentsRes.data || []).find(s => s.student_id === studentPayload || s.student_id === String(studentPayload));
        if (!found) throw new Error('Student not found (provide university student ID or linked Student _id)');
        studentPayload = found._id;
      }

      const payload = { ...form, student: studentPayload, status: 'Queued' };
      const res = await API.post('/notifications', payload);
      setNotifications(prev => [res.data, ...prev]);
      setForm({ student: '', channel: 'Email', message: '' });
    } catch (err) {
      alert('Send failed: ' + (err.response?.data?.error || err.message));
    } finally { setSending(false); }
  };

  if (loading) return <div className="text-center py-10">Loading notifications...</div>;
  if (error) return <div className="text-center text-red-600 py-10">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Notifications</h2>
      <div className="mb-6 bg-white rounded-lg p-4 shadow">
        <form onSubmit={handleSend} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input required placeholder="Student ID" value={form.student} onChange={e => setForm({...form, student: e.target.value})} className="border px-3 py-2 rounded" />
          <select value={form.channel} onChange={e => setForm({...form, channel: e.target.value})} className="border px-3 py-2 rounded">
            <option>SMS</option>
            <option>Email</option>
            <option>Both</option>
          </select>
          <div className="flex gap-2">
            <input required placeholder="Message" value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="border px-3 py-2 rounded flex-1" />
            <button className="bg-blue-600 text-white px-4 py-2 rounded" disabled={sending}>{sending ? 'Sending...' : 'Send'}</button>
          </div>
        </form>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center text-gray-500">No notifications found.</div>
      ) : (
        <div className="space-y-4">
          {notifications.map(n => (
            <div key={n._id} className="bg-white rounded-xl shadow p-4 border">
              <div className="flex justify-between">
                <div className="font-semibold">To: {n.student?._id || n.student}</div>
                <div className="text-sm text-gray-500">{n.status}</div>
              </div>
              <div className="text-sm text-gray-700 mt-2">{n.message}</div>
              <div className="text-xs text-gray-400 mt-2">Sent: {n.sent_at ? new Date(n.sent_at).toLocaleString() : '-'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
