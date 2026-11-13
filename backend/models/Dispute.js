const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['open', 'under_review', 'resolved', 'rejected'], 
    default: 'open',
    index: true 
  },
  resolutionNotes: String,
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Dispute', disputeSchema);
