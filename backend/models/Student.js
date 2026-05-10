const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  student_id: { type: String, unique: true, required: true },
  full_name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, required: true },
  department: { type: String, required: true },
  program: { type: String, required: true },
  year_of_study: { type: Number, required: true },
  enrollment_status: { type: String, enum: ['Active', 'Hold', 'Suspended', 'Graduated'], required: true },
  registered_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);