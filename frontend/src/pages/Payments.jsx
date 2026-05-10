import React, { useEffect, useState } from 'react';
import API from '../services/api';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    API.get('/payments')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : (res.data.payments || res.data.data || []);
        setPayments(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-10">Loading payments...</div>;
  if (error) return <div className="text-center text-red-600 py-10">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Payments</h2>
      {payments.length === 0 ? (
        <div className="text-center text-gray-500">No payments found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow">
            <thead>
              <tr className="bg-blue-100 text-blue-700">
                <th className="py-2 px-4">Student</th>
                <th className="py-2 px-4">Fee</th>
                <th className="py-2 px-4">Amount</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <tr key={payment._id} className="border-b hover:bg-blue-50">
                  <td className="py-2 px-4">{payment.student?.email || payment.student}</td>
                  <td className="py-2 px-4">{payment.fee?.fee_name || payment.fee?.name || payment.fee}</td>
                  <td className="py-2 px-4">{payment.amount}</td>
                  <td className="py-2 px-4">{payment.status}</td>
                  <td className="py-2 px-4">{payment.createdAt ? new Date(payment.createdAt).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Payments;
