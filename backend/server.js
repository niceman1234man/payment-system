// Ensure a Web Crypto `crypto.getRandomValues` implementation is available
// before loading MongoDB / mongoose which may expect `globalThis.crypto`.
try {
  if (typeof globalThis.crypto === 'undefined') {
    // Node.js exposes WebCrypto as `crypto.webcrypto` in recent versions
    const nodeCrypto = require('crypto');
    globalThis.crypto = nodeCrypto.webcrypto || nodeCrypto;
  }
} catch (err) {
  // ignore if crypto can't be polyfilled; mongodb will surface a clearer error
}

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const feeCategoryRoutes = require('./routes/feeCategoryRoutes');
const feeRoutes = require('./routes/feeRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const receiptRoutes = require('./routes/receiptRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const auditLogRoutes = require('./routes/auditLogRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/fee-categories', feeCategoryRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/audit-logs', auditLogRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
