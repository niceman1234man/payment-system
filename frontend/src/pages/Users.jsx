import React, { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '', role: 'Finance' });
  const [studentInfo, setStudentInfo] = useState({ student_id: '', phone: '', department: '', program: '', year_of_study: 1, enrollment_status: 'Active' });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    API.get('/auth/users')
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-10">Loading users...</div>;
  if (error) return <div className="text-center text-red-600 py-10">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Users</h2>
      {user?.role === 'Admin' && (
        <div className="mb-4 flex justify-end">
          <button onClick={() => setShowCreate(!showCreate)} className="bg-green-600 text-white px-4 py-2 rounded">{showCreate ? 'Cancel' : 'Create User'}</button>
        </div>
      )}

      {showCreate && user?.role === 'Admin' && (
        <div className="bg-white p-4 rounded mb-6 border">
          <h3 className="font-semibold mb-3">Create User</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input type="text" placeholder="Full name" value={createForm.name} onChange={e => setCreateForm({ ...createForm, name: e.target.value })} className="border p-2 rounded" />
            <input type="email" placeholder="Email" value={createForm.email} onChange={e => setCreateForm({ ...createForm, email: e.target.value })} className="border p-2 rounded" />
            <input type="password" placeholder="Password" value={createForm.password} onChange={e => setCreateForm({ ...createForm, password: e.target.value })} className="border p-2 rounded" />
            <select value={createForm.role} onChange={e => setCreateForm({ ...createForm, role: e.target.value })} className="border p-2 rounded">
              <option value="Admin">Admin</option>
              <option value="Finance">Finance</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Student">Student</option>
            </select>
          </div>

          {createForm.role === 'Student' && (
            <div className="mt-3 bg-gray-50 p-3 rounded">
              <input type="text" placeholder="Student ID" value={studentInfo.student_id} onChange={e => setStudentInfo({ ...studentInfo, student_id: e.target.value })} className="border p-2 rounded mb-2 w-full" />
              <input type="text" placeholder="Phone" value={studentInfo.phone} onChange={e => setStudentInfo({ ...studentInfo, phone: e.target.value })} className="border p-2 rounded mb-2 w-full" />
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Department" value={studentInfo.department} onChange={e => setStudentInfo({ ...studentInfo, department: e.target.value })} className="border p-2 rounded" />
                <input type="text" placeholder="Program" value={studentInfo.program} onChange={e => setStudentInfo({ ...studentInfo, program: e.target.value })} className="border p-2 rounded" />
              </div>
            </div>
          )}

          <div className="mt-3 flex justify-end">
            <button onClick={async () => {
              try {
                const payload = { full_name: createForm.name, email: createForm.email, password: createForm.password, role: createForm.role };
                if (createForm.role === 'Student') payload.student = { ...studentInfo, full_name: createForm.name, email: createForm.email };
                await API.post('/auth/register', payload);
                setShowCreate(false);
                // reload users
                const res = await API.get('/auth/users');
                setUsers(res.data);
              } catch (err) {
                setError(err.response?.data?.message || err.message);
              }
            }} className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
          </div>
        </div>
      )}
      {users.length === 0 ? (
        <div className="text-center text-gray-500">No users found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow">
            <thead>
              <tr className="bg-blue-100 text-blue-700">
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Role</th>
                <th className="py-2 px-4">Active</th>
                <th className="py-2 px-4">Last Login</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-b hover:bg-blue-50">
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4">{user.role}</td>
                  <td className="py-2 px-4">{user.is_active ? 'Yes' : 'No'}</td>
                  <td className="py-2 px-4">{user.last_login ? new Date(user.last_login).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;
