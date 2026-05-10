const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  transaction: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  receipt_number: { type: String, unique: true, required: true },
  total_amount: { type: Number, required: true },
  academic_year: { type: String, required: true },
  issued_at: { type: Date, default: Date.now },
  issued_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Receipt', receiptSchema);
