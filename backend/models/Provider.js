const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true,
    index: true 
  },
  businessName: { type: String, required: true, trim: true },
  contactEmail: { type: String, required: true },
  contactPhone: { type: String, required: true },
  verificationStatus: { 
    type: String, 
    enum: ['pending', 'verified', 'rejected'], 
    default: 'pending' 
  },
  documents: [{
    documentType: String,
    fileUrl: String,
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    rejectionReason: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  rejectionReason: String,
  submittedAt: { type: Date, default: Date.now },
  verifiedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Provider', providerSchema);
