import React from "react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.post('/auth/login', form);
      const { user, token } = res.data;
      // store token and user
      if (token) localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);

      // Redirect based on role returned by backend
      const role = user?.role || '';
      if (role === 'Admin' || role === 'Super Admin') {
        navigate('/admin');
      } else if (role === 'Finance') {
        navigate('/reports');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-6 text-teal-700">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="w-full">
          {error && (
            <div className="bg-red-100 text-red-700 p-2 mb-3 rounded text-center">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Email"
              type="email"
              autoComplete="username"
              required
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Password"
              autoComplete="current-password"
              required
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            className="bg-teal-600 text-white w-full p-2 rounded font-semibold shadow hover:bg-teal-700 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="flex justify-between mt-4 text-sm">
         
            <span
              className="text-teal-600 hover:underline cursor-pointer"
              onClick={() => navigate('/register')}
            >
              Create Account
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
