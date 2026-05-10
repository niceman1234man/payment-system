const Fee = require('../models/Fee');

exports.createFee = async (req, res) => {
  try {
    const fee = await Fee.create(req.body);
    res.status(201).json(fee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getFees = async (req, res) => {
  try {
    const fees = await Fee.find().populate('category');
    res.json(fees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateFee = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!fee) return res.status(404).json({ error: 'Not found' });
    res.json(fee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteFee = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndDelete(req.params.id);
    if (!fee) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};// Fee Controller Boilerplate
// End of fee controller
