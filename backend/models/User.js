const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', default: null },
  role: { type: String, enum: ['Student', 'Admin', 'Finance', 'Super Admin'], required: true },
  email: { type: String, unique: true, required: true },
  password_hash: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  last_login: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
