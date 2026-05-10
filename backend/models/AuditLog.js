const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  module: { type: String, required: true },
  description: { type: String, required: true },
  ip_address: { type: String, required: true },
  action_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);