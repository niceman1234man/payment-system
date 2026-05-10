const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  transaction: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
  channel: { type: String, enum: ['SMS', 'Email', 'Both'], required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['Queued', 'Sent', 'Delivered', 'Failed'], required: true },
  sent_at: { type: Date }
});

module.exports = mongoose.model('Notification', notificationSchema);