const mongoose = require('mongoose');
const documentSchema = new mongoose.Schema({
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true, index: true },
  centerId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChildcareCenter', index: true },
  documentType: { type: String, required: true, trim: true },
  fileUrl: { type: String, required: true },
  status: { type: String, enum: ['pending','verified','rejected'], default: 'pending', index: true },
  rejectionReason: String,
  uploadedAt: { type: Date, default: Date.now },
  verifiedAt: Date,
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
module.exports = mongoose.model('Document', documentSchema);
