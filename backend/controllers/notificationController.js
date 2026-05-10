const Notification = require('../models/Notification');

exports.createNotification = async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json(notification);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().populate('student transaction');
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};