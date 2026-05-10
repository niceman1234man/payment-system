import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const StatCard = ({ title, value, color = 'blue' }) => (
  <div className={`bg-white rounded-lg shadow p-4 border-t-4 border-${color}-500`}> 
    <div className="text-sm text-gray-500">{title}</div>
    <div className="text-2xl font-bold text-gray-800 mt-2">{value}</div>
  </div>
);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // fetch summary stats used by dashboards
    const fetchStats = async () => {
      try {
        const [students, payments, transactions, receipts, fees, users] = await Promise.all([
          API.get('/students').then(r => r.data.length).catch(() => 0),
          API.get('/payments').then(r => r.data.length).catch(() => 0),
          API.get('/transactions').then(r => r.data.length).catch(() => 0),
          API.get('/receipts').then(r => r.data.length).catch(() => 0),
          API.get('/fees').then(r => r.data.length).catch(() => 0),
          API.get('/users').then(r => r.data.length).catch(() => 0),
        ]);
        setStats({ students, payments, transactions, receipts, fees, users });
      } catch (err) {
        setError(err.message || 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const role = user?.role || 'Guest';

  if (loading) return <div className="text-center py-10">Loading dashboard...</div>;
  if (error) return <div className="text-center text-red-600 py-10">Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-blue-700">Dashboard</h1>
        <div className="text-sm text-gray-600">Role: <span className="font-semibold text-gray-800">{role}</span></div>
      </div>

      {/* Common stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard title="Students" value={stats.students ?? 0} color="blue" />
        <StatCard title="Payments" value={stats.payments ?? 0} color="green" />
        <StatCard title="Transactions" value={stats.transactions ?? 0} color="indigo" />
        <StatCard title="Receipts" value={stats.receipts ?? 0} color="purple" />
        <StatCard title="Fees" value={stats.fees ?? 0} color="teal" />
        <StatCard title="Users" value={stats.users ?? 0} color="yellow" />
      </div>

      {/* Role-specific sections */}
      <div className="mt-8 space-y-6">
        {role === 'Student' && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-blue-700 mb-2">Student Overview</h2>
            <p className="text-gray-600">Quick actions for students: make a payment, view receipts, and check payment history.</p>
            <div className="mt-4 flex gap-3">
              <a href="/payments/new" className="bg-blue-600 text-white px-4 py-2 rounded">Make Payment</a>
              <a href="/payments" className="border border-blue-200 px-4 py-2 rounded">View Payments</a>
            </div>
          </div>
        )}

        {role === 'Admin' && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-blue-700 mb-2">Admin Controls</h2>
            <p className="text-gray-600">Access user management, payments, fee configuration, and audit logs.</p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a href="/users" className="bg-blue-600 text-white px-4 py-2 rounded text-center">Manage Users</a>
              <a href="/payments" className="bg-blue-600 text-white px-4 py-2 rounded text-center">View Payments</a>
              <a href="/fees" className="bg-blue-600 text-white px-4 py-2 rounded text-center">Manage Fees</a>
              <a href="/auditlogs" className="bg-blue-600 text-white px-4 py-2 rounded text-center">Audit Logs</a>
            </div>
          </div>
        )}

        {role === 'Finance' && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-blue-700 mb-2">Finance Dashboard</h2>
            <p className="text-gray-600">Review recent transactions, reconcile payments, and generate reports.</p>
            <div className="mt-4 flex gap-3">
              <a href="/transactions" className="bg-green-600 text-white px-4 py-2 rounded">View Transactions</a>
              <a href="/reports" className="border border-blue-200 px-4 py-2 rounded">Reports</a>
            </div>
          </div>
        )}

        {role === 'Guest' && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-blue-700 mb-2">Welcome</h2>
            <p className="text-gray-600">Please log in to access your dashboard and features.</p>
            <div className="mt-4">
              <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded">Login</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
