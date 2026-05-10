import React from "react";
import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
 
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Student",
  });
  const [studentInfo, setStudentInfo] = useState({
    student_id: '',
    phone: '',
    department: '',
    program: '',
    year_of_study: 1,
    enrollment_status: 'Active'
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // map local `name` to backend `full_name` if required
      const payload = {
        full_name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      };
      if (form.role === 'Student') {
        payload.student = {
          student_id: studentInfo.student_id,
          full_name: form.name,
          email: form.email,
          phone: studentInfo.phone,
          department: studentInfo.department,
          program: studentInfo.program,
          year_of_study: Number(studentInfo.year_of_study),
          enrollment_status: studentInfo.enrollment_status,
        };
      }
      const res = await API.post("/auth/register", payload);
      // show success briefly then navigate
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      setError(msg);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
     
      <div className="w-full max-w-lg p-10 bg-white rounded-2xl shadow-2xl flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-6 text-teal-700">Create Account</h2>
        <form onSubmit={handleSubmit} className="w-full">
          {error && (
            <div className="bg-red-100 text-red-700 p-2 mb-3 rounded text-center">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="Full Name"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {/* Public registration only allows Students — other roles must be created by an Admin in the admin panel */}

          {form.role === 'Student' && (
            <div className="mb-6 bg-gray-50 p-4 rounded">
              <h4 className="font-semibold mb-2">Student details</h4>
              <div className="mb-3">
                <label className="block text-sm text-gray-700 mb-1">Student ID</label>
                <input type="text" value={studentInfo.student_id} onChange={e => setStudentInfo({ ...studentInfo, student_id: e.target.value })} required className="w-full border p-2 rounded" placeholder="University student ID" />
              </div>
              <div className="mb-3">
                <label className="block text-sm text-gray-700 mb-1">Phone</label>
                <input type="text" value={studentInfo.phone} onChange={e => setStudentInfo({ ...studentInfo, phone: e.target.value })} required className="w-full border p-2 rounded" placeholder="Phone number" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" value={studentInfo.department} onChange={e => setStudentInfo({ ...studentInfo, department: e.target.value })} required placeholder="Department" className="border p-2 rounded" />
                <input type="text" value={studentInfo.program} onChange={e => setStudentInfo({ ...studentInfo, program: e.target.value })} required placeholder="Program" className="border p-2 rounded" />
              </div>
              
            </div>
          )}

          <button
            className="w-full bg-teal-600 text-white p-2 rounded font-semibold shadow hover:bg-teal-700 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="text-sm mt-4 text-center">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}