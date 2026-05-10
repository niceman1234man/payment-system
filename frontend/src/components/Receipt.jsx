import React, { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Receipt = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const renderPerson = (p) => {
    if (!p) return '-';
    if (typeof p === 'string') return p;
    if (p.full_name) return p.full_name;
    if (p.student_id) return p.student_id;
    if (p.email) return p.email;
    return '-';
  };

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        let url = '/receipts';
        if (user && user.role === 'Student') {
          // prefer student _id if present, otherwise use university student_id
          const sid = user.student?._id || user.student?.student_id;
          if (sid) {
            // if it's likely an ObjectId (24 hex chars) use `student`, else use student_id
            const isObjectId = typeof sid === 'string' && /^[0-9a-fA-F]{24}$/.test(sid);
            url = isObjectId ? `/receipts?student=${sid}` : `/receipts?student_id=${encodeURIComponent(sid)}`;
          }
        }

        const res = await API.get(url);
        setReceipts(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, [user]);

  if (loading) return <div className="text-center py-10">Loading receipts...</div>;
  if (error) return <div className="text-center text-red-600 py-10">Error: {error}</div>;

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Receipts</h2>
      {receipts.length === 0 ? (
        <div className="text-center text-gray-500">No receipts found.</div>
      ) : (
        <div className="space-y-6">
          {receipts.map(receipt => (
            <div key={receipt._id} className="bg-white rounded-xl shadow p-6 border border-blue-100">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                <div className="text-lg font-semibold text-blue-700">Receipt #{receipt.receipt_number || receipt.receiptNumber}</div>
                <div className="text-sm text-gray-500">Issued: {new Date(receipt.issued_at || receipt.issuedAt).toLocaleString()}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
                <div><span className="font-medium">Student:</span> {renderPerson(receipt.student)}</div>
                <div><span className="font-medium">Total Amount:</span> {receipt.total_amount ?? (receipt.payment?.amount ?? '-')}</div>
                <div><span className="font-medium">Academic Year:</span> {receipt.academic_year || '-'}</div>
                <div><span className="font-medium">Issued By:</span> {renderPerson(receipt.issued_by)}</div>
                <div><span className="font-medium">Transaction:</span> {receipt.transaction?._id || receipt.transaction || '-'}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Receipt;
