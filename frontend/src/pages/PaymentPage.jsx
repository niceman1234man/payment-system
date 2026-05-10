import React from 'react';
import PaymentForm from '../components/PaymentForm';


const PaymentPage = () => (
  <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-br from-blue-50 to-blue-200 py-10 px-2">
    <div className="bg-white/90 rounded-2xl shadow-xl p-8 w-full max-w-xl border border-blue-100">
      <div className="flex flex-col items-center mb-6">
        <svg className="w-14 h-14 text-blue-600 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 8v8" />
        </svg>
        <h2 className="text-3xl font-bold text-blue-700 mb-1 drop-shadow">Payment Page</h2>
        <p className="text-gray-600 text-base">Fill in the form below to complete your university payment securely.</p>
      </div>
      <PaymentForm />
    </div>
  </div>
);

export default PaymentPage;
