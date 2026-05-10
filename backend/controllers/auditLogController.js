const AuditLog = require('../models/AuditLog');

exports.createLog = async (req, res) => {
  try {
    const log = await AuditLog.create(req.body);
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().populate('user');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};