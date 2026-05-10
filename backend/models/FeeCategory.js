const mongoose = require('mongoose');

const feeCategorySchema = new mongoose.Schema({
  category_name: { type: String, unique: true, required: true },
  description: { type: String },
  is_active: { type: Boolean, default: true }
});

module.exports = mongoose.model('FeeCategory', feeCategorySchema);