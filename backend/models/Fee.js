const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeCategory', required: true },
  fee_name: { type: String, required: true },
  amount: { type: Number, required: true },
  academic_year: { type: String, required: true },
  semester: { type: String, required: true },
  due_date: { type: Date, required: true },
  is_active: { type: Boolean, default: true }
});



module.exports = mongoose.model('Fee', feeSchema);
