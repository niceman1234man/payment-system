import React from 'react';
import { useNavigate } from 'react-router-dom';



const AdminPanel = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-br from-blue-50 to-blue-200 py-10 px-2">
      <div className="bg-white/90 rounded-2xl shadow-xl p-8 w-full max-w-2xl border border-blue-100">
        <div className="flex flex-col items-center mb-6">
          <svg className="w-14 h-14 text-blue-700 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          <h2 className="text-3xl font-bold text-blue-700 mb-1 drop-shadow">Admin Panel</h2>
          <p className="text-gray-600 text-base">Manage users, payments, and system settings below.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-blue-50 rounded-xl p-6 shadow hover:scale-105 transition-transform flex flex-col items-center">
            <span className="text-blue-600 font-bold text-lg mb-2">User Management</span>
            <button onClick={() => navigate('/users')} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition">View Users</button>
          </div>
          <div className="bg-blue-50 rounded-xl p-6 shadow hover:scale-105 transition-transform flex flex-col items-center">
            <span className="text-blue-600 font-bold text-lg mb-2">Payment Records</span>
            <button onClick={() => navigate('/payments')} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition">View Payments</button>
          </div>
          <div className="bg-blue-50 rounded-xl p-6 shadow hover:scale-105 transition-transform flex flex-col items-center">
            <span className="text-blue-600 font-bold text-lg mb-2">Fee Categories</span>
            <button onClick={() => navigate('/feecategories')} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition">Manage Fees</button>
          </div>
          <div className="bg-blue-50 rounded-xl p-6 shadow hover:scale-105 transition-transform flex flex-col items-center">
            <span className="text-blue-600 font-bold text-lg mb-2">System Settings</span>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition">Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
