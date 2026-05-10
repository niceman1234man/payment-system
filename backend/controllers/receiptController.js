const Receipt = require('../models/Receipt');
const Student = require('../models/Student');

exports.createReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.create(req.body);
    res.status(201).json(receipt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getReceipts = async (req, res) => {
  try {
    const { student, student_id } = req.query;
    let filter = {};

    if (student) {
      filter.student = student;
    } else if (student_id) {
      const s = await Student.findOne({ student_id: student_id });
      if (!s) return res.json([]);
      filter.student = s._id;
    }

    const receipts = await Receipt.find(filter).populate('transaction student issued_by');
    res.json(receipts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id).populate('transaction student issued_by');
    if (!receipt) return res.status(404).json({ error: 'Not found' });
    res.json(receipt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};