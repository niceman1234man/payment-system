import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Receipt from './Receipt';

const PaymentForm = () => {
  const { user } = useContext(AuthContext);
  const [studentId, setStudentId] = useState(user?.student?.student_id || '');
  const [amount, setAmount] = useState('');
  const [feeId, setFeeId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mobile');
  const [fees, setFees] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loadingFees, setLoadingFees] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    API.get('/fees')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : (res.data.fees || res.data.data || []);
        setFees(data);
        setLoadingFees(false);
      })
      .catch(() => setLoadingFees(false));
  }, []);

  useEffect(() => {
    API.get('/fee-categories')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : (res.data.categories || res.data.data || []);
        setCategories(data);
        setLoadingCategories(false);
      })
      .catch(() => setLoadingCategories(false));
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      // 1. Create payment
      // Send the university student identifier (student_id) if available; backend will resolve to a user ObjectId.
      const studentPayload = studentId || user?.student?.student_id || user?._id;
      const paymentBody = { student: studentPayload, fee: feeId || undefined, amount: Number(amount), status: 'completed' };
      const paymentRes = await API.post('/payments', paymentBody);

      // 2. Create transaction
      const txRes = await API.post('/transactions', { payment: paymentRes.data._id, amount: Number(amount), status: 'success' });

      // 3. Create receipt
        // determine academic year from fee if available, else use current year
        const feeObj = feeId ? fees.find(f => f._id === feeId) : null;
        const academicYear = feeObj?.academic_year || String(new Date().getFullYear());
        const receiptBody = {
          transaction: txRes.data._id,
          student: paymentRes.data.student,
          receipt_number: `RCPT-${Date.now()}`,
          total_amount: Number(amount),
          academic_year: academicYear,
        };
        const receiptRes = await API.post('/receipts', receiptBody);

      // 4. Send notification
      await API.post('/notifications', { student: paymentRes.data.student, transaction: txRes.data._id, channel: 'Both', message: `Payment of ${amount} received. Receipt ${receiptRes.data.receipt_number}` , status: 'Queued' });

      setSuccessReceipt(receiptRes.data);
      setAmount('');
      setFeeId('');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Payment failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {!successReceipt ? (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">Make a Payment</h2>
          {error && <div className="text-red-600">{error}</div>}
          <div className="flex flex-col gap-2">
            <label htmlFor="studentId" className="font-medium text-gray-700">Student ID</label>
            <input id="studentId" name="studentId" value={studentId} onChange={e => setStudentId(e.target.value)} type="text" required placeholder="Enter your student ID" className="border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="feeId" className="font-medium text-gray-700">Fee</label>
            <div className="mb-2">
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Category</label>
              {loadingCategories ? (
                <div>Loading categories...</div>
              ) : categories.length === 0 ? (
                <div className="text-gray-600">No categories available.</div>
              ) : (
                <select id="categoryId" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="border border-blue-200 rounded-lg px-4 py-2 w-full">
                  <option value="">All categories</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name || c.category_name || c.title}</option>)}
                </select>
              )}
              {categories.length === 0 && user?.role === 'admin' && (
                <Link to="/feecategories" className="text-blue-600 mt-2 underline">Manage categories</Link>
              )}
            </div>

            {loadingFees ? (
              <div>Loading fees...</div>
            ) : (() => {
              const displayedFees = selectedCategory ? fees.filter(f => (f.category && (f.category._id === selectedCategory || f.category === selectedCategory))) : fees;
              if (!displayedFees || displayedFees.length === 0) {
                return <div className="text-gray-600">No fees found for the selected category. You can enter an amount manually below.</div>;
              }
              return (
                <select id="feeId" value={feeId} onChange={e => setFeeId(e.target.value)} className="border border-blue-200 rounded-lg px-4 py-2 w-full">
                  <option value="">Select fee (optional)</option>
                  {displayedFees.map(f => <option key={f._id} value={f._id}>{f.name || f.fee_name} — {f.amount}</option>)}
                </select>
              );
            })()}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="amount" className="font-medium text-gray-700">Amount</label>
            <input id="amount" name="amount" value={amount} onChange={e => setAmount(e.target.value)} type="number" min="1" required placeholder="Enter amount" className="border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="paymentMethod" className="font-medium text-gray-700">Payment Method</label>
            <select id="paymentMethod" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="card">Card</option>
              <option value="mobile">Mobile Money</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>
          <button type="submit" disabled={submitting} className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-2 rounded-lg shadow hover:from-blue-700 hover:to-blue-600 transition text-lg flex items-center justify-center gap-2">
            {submitting ? 'Processing...' : 'Pay Now'}
          </button>
        </form>
      ) : (
        <div>
          <h3 className="text-xl font-bold text-green-600">Payment successful</h3>
          <Receipt receipt={successReceipt} />
          <div className="mt-4">
            <button onClick={() => setSuccessReceipt(null)} className="px-4 py-2 bg-blue-600 text-white rounded">Make another payment</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;
