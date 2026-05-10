import React from 'react';
import logo from '../assets/logo.jpeg';

const Home = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-blue-400 p-6">
    <div className="bg-white/90 rounded-3xl shadow-2xl p-10 max-w-3xl w-full text-center border border-blue-100 relative overflow-hidden">
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-300 opacity-30 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-400 opacity-20 rounded-full blur-2xl animate-pulse"></div>
      <div className="flex flex-col items-center">
        <div className="mb-6">
          <img src={logo} alt="Wolkite University Logo" className="mx-auto w-20 h-20 text-blue-600" />
        </div>
        <h1 className="text-5xl font-extrabold text-blue-700 mb-4 drop-shadow-lg">Wolkite University Payment System</h1>
        <p className="text-xl text-gray-700 mb-8 font-medium leading-relaxed">
          Welcome to the official Wolkite University Payment System.<br />
          <span className="text-blue-600 font-semibold">Fast, secure, and convenient</span> platform for students, staff, and administrators to manage all university-related payments.<br />
          <span className="text-blue-500">Pay tuition, fees, and more online. Access receipts and payment history anytime.</span>
        </p>
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <div className="bg-blue-50 rounded-xl p-4 shadow hover:scale-105 transition-transform w-48">
            <svg className="mx-auto w-10 h-10 text-blue-500 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
            <div className="font-semibold text-blue-700">Real-Time Payments</div>
            <div className="text-xs text-gray-500">Instant processing for all transactions</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 shadow hover:scale-105 transition-transform w-48">
            <svg className="mx-auto w-10 h-10 text-blue-500 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            <div className="font-semibold text-blue-700">Secure & Reliable</div>
            <div className="text-xs text-gray-500">Your data and payments are protected</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 shadow hover:scale-105 transition-transform w-48">
            <svg className="mx-auto w-10 h-10 text-blue-500 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 8v8" /></svg>
            <div className="font-semibold text-blue-700">24/7 Access</div>
            <div className="text-xs text-gray-500">Manage payments anytime, anywhere</div>
          </div>
        </div>
        <a href="/login" className="inline-block bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:from-blue-700 hover:to-blue-600 transition text-lg">Get Started</a>
      </div>
    </div>
  </div>
);

export default Home;
