import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-700 p-4 shadow text-white flex items-center justify-center space-x-6">
      <Link className="hover:underline font-semibold" to="/">Home</Link>

      {user ? (
        <>
          <Link className="hover:underline" to="/dashboard">Dashboard</Link>

          {user.role === 'Admin' && (
            <>
              <Link className="hover:underline" to="/users">Users</Link>
              <Link className="hover:underline" to="/students">Students</Link>
              <Link className="hover:underline" to="/fees">Fees</Link>
              <Link className="hover:underline" to="/transactions">Transactions</Link>
              <Link className="hover:underline" to="/admin">Admin Panel</Link>
              <Link className="hover:underline" to="/reports">Reports</Link>
              <Link className="hover:underline" to="/audit-logs">Audit Logs</Link>
            </>
          )}

          {user.role === 'Student' && (
            <>
              <Link className="hover:underline" to="/payments">Payments</Link>
              <Link className="hover:underline" to="/receipts">Receipts</Link>
              <Link className="hover:underline" to="/notifications">Notifications</Link>
            </>
          )}

          {/* common authenticated links */}
          <button onClick={handleLogout} className="ml-4 bg-white text-blue-700 px-3 py-1 rounded font-semibold">Logout</button>
        </>
      ) : (
        <Link className="hover:underline" to="/login">Login</Link>
      )}
    </nav>
  );
};

export default Navbar;
