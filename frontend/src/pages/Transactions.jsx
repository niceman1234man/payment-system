import React, { useEffect, useState } from 'react';
import API from '../services/api';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    API.get('/transactions')
      .then(res => {
        setTransactions(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-10">Loading transactions...</div>;
  if (error) return <div className="text-center text-red-600 py-10">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Transactions</h2>
      {transactions.length === 0 ? (
        <div className="text-center text-gray-500">No transactions found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow">
            <thead>
              <tr className="bg-blue-100 text-blue-700">
                <th className="py-2 px-4">ID</th>
                <th className="py-2 px-4">Payment</th>
                <th className="py-2 px-4">Amount</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx._id} className="border-b hover:bg-blue-50">
                  <td className="py-2 px-4">{tx._id}</td>
                  <td className="py-2 px-4">{tx.payment?._id || tx.payment}</td>
                  <td className="py-2 px-4">{tx.amount}</td>
                  <td className="py-2 px-4">{tx.status}</td>
                  <td className="py-2 px-4">{tx.createdAt ? new Date(tx.createdAt).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Transactions;
