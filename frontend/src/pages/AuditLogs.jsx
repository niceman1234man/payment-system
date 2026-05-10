import React, { useEffect, useState } from 'react';
import API from '../services/api';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    API.get('/audit-logs')
      .then(res => { setLogs(res.data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  if (loading) return <div className="text-center py-10">Loading audit logs...</div>;
  if (error) return <div className="text-center text-red-600 py-10">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Audit Logs</h2>
      {logs.length === 0 ? (
        <div className="text-center text-gray-500">No logs found.</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full">
            <thead>
              <tr className="bg-blue-100 text-blue-700">
                <th className="py-2 px-4">User</th>
                <th className="py-2 px-4">Action</th>
                <th className="py-2 px-4">Module</th>
                <th className="py-2 px-4">IP</th>
                <th className="py-2 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(l => (
                <tr key={l._id} className="border-b hover:bg-blue-50">
                  <td className="py-2 px-4">{l.user?.email || l.user}</td>
                  <td className="py-2 px-4">{l.action}</td>
                  <td className="py-2 px-4">{l.module}</td>
                  <td className="py-2 px-4">{l.ip_address}</td>
                  <td className="py-2 px-4">{l.action_at ? new Date(l.action_at).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
