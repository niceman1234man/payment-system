const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  // store the Student reference (university student record)
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  // `fee` is optional to allow ad-hoc payments not tied to a predefined fee
  fee: { type: mongoose.Schema.Types.ObjectId, ref: 'Fee', required: false },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  transactionId: String,
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
