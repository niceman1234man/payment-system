import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PaymentPage from './pages/PaymentPage';
import AdminPanel from './pages/AdminPanel';
import Reports from './pages/Reports';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Students from './pages/Students';
import Users from './pages/Users';
import Payments from './pages/Payments';
import FeeCategories from './pages/FeeCategories';
import Transactions from './pages/Transactions';
import Fees from './pages/Fees';
import Notifications from './pages/Notifications';
import AuditLogs from './pages/AuditLogs';
import Register from './pages/Register';
import PaymentForm from './components/PaymentForm';
import Receipt from './components/Receipt';
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
          <Route path="/receipts" element={<ProtectedRoute><Receipt /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute adminOnly={true}><Users /></ProtectedRoute>} />
    <Route path="/payments" element={<ProtectedRoute adminOnly={true}><Payments /></ProtectedRoute>} />
    <Route path="/feecategories" element={<ProtectedRoute adminOnly={true}><FeeCategories /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute adminOnly={true}><Transactions /></ProtectedRoute>} />
        <Route path="/fees" element={<ProtectedRoute adminOnly={true}><Fees /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute adminOnly={true}><Notifications /></ProtectedRoute>} />
        <Route path="/auditlogs" element={<ProtectedRoute adminOnly={true}><AuditLogs /></ProtectedRoute>} />
  <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/payments" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
          <Route path="/payments/new" element={<ProtectedRoute><PaymentForm /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminPanel /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute adminOnly={true}><Reports /></ProtectedRoute>} />
        <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
