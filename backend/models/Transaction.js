const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['success', 'failed'], default: 'success' },
  details: String,
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
