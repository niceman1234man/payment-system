import React, { useEffect, useState } from 'react';
import API from '../services/api';

const Stat = ({ label, value }) => (
  <div className="bg-white rounded-lg shadow p-4 text-center">
    <div className="text-sm text-gray-500">{label}</div>
    <div className="text-2xl font-bold text-gray-800 mt-2">{value}</div>
  </div>
);

const Reports = () => {
  const [payments, setPayments] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [pRes, tRes, rRes] = await Promise.all([
          API.get('/payments'),
          API.get('/transactions'),
          API.get('/receipts'),
        ]);
        const normalize = (res) => {
          const d = res?.data ?? res;
          if (Array.isArray(d)) return d;
          if (d && Array.isArray(d.data)) return d.data;
          if (d && Array.isArray(d.payments)) return d.payments;
          if (d && Array.isArray(d.transactions)) return d.transactions;
          if (d && Array.isArray(d.items)) return d.items;
          return [];
        };

        setPayments(normalize(pRes));
        setTransactions(normalize(tRes));
        setReceipts(normalize(rRes));
      } catch (err) {
        setError(err.message || 'Failed to load reports');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const totalRevenue = payments.reduce((s, p) => s + (p.amount || 0), 0);
  const completedPayments = payments.filter(p => p.status === 'completed').length;

  const downloadCSV = (items, filename = 'report.csv') => {
    if (!items || items.length === 0) return alert('No data to export');
    const headers = Object.keys(items[0]);
    const csv = [headers.join(',')].concat(
      items.map(row => headers.map(h => {
        const v = row[h] == null ? '' : String(row[h]).replace(/"/g, '""');
        return `"${v}"`;
      }).join(','))
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="text-center py-10">Loading reports...</div>;
  if (error) return <div className="text-center text-red-600 py-10">Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-blue-700">Financial Reports</h1>
        <div className="flex gap-2">
          <button onClick={() => downloadCSV(payments.map(p => ({ id: p._id, student: p.student?.email || p.student, fee: p.fee?.fee_name || p.fee, amount: p.amount, status: p.status, date: p.createdAt })) , 'payments.csv')} className="bg-blue-600 text-white px-3 py-2 rounded">Export Payments CSV</button>
          <button onClick={() => downloadCSV(transactions.map(t => ({ id: t._id, payment: t.payment?._id || t.payment, amount: t.amount, status: t.status, date: t.createdAt })), 'transactions.csv')} className="bg-green-600 text-white px-3 py-2 rounded">Export Transactions CSV</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Stat label="Total Revenue" value={totalRevenue} />
        <Stat label="Total Payments" value={payments.length} />
        <Stat label="Completed Payments" value={completedPayments} />
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Recent Payments</h2>
        {payments.length === 0 ? (
          <div className="text-gray-500">No payments available.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-blue-50 text-left text-sm text-blue-700">
                  <th className="p-2">ID</th>
                  <th className="p-2">Student</th>
                  <th className="p-2">Fee</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.slice(0, 50).map(p => (
                  <tr key={p._id} className="border-b hover:bg-gray-50 text-sm">
                    <td className="p-2">{p._id}</td>
                    <td className="p-2">{p.student?.full_name || p.student?.email || p.student}</td>
                    <td className="p-2">{p.fee?.fee_name || p.fee?.name || '-'}</td>
                    <td className="p-2">{p.amount}</td>
                    <td className="p-2">{p.status}</td>
                    <td className="p-2">{p.createdAt ? new Date(p.createdAt).toLocaleString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
