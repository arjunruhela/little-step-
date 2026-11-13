const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ['ageGroup', 'serviceType'], required: true, index: true },
  active: { type: Boolean, default: true, index: true }
}, { timestamps: true });
categorySchema.index({ type: 1, name: 1 }, { unique: true });
module.exports = mongoose.model('Category', categorySchema);
