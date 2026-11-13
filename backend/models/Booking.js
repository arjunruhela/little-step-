const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  centerId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChildcareCenter', required: true, index: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true, index: true },
  childId: { type: mongoose.Schema.Types.ObjectId, ref: 'Child', required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'PricingPlan', required: true },
  planType: { type: String, enum: ['hourly', 'daily', 'monthly'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  amount: { type: Number, required: true },
  notes: String,
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'rejected', 'cancelled', 'completed'], 
    default: 'pending',
    index: true 
  },
}, { timestamps: true });

bookingSchema.index({ parentId: 1, status: 1 });
bookingSchema.index({ centerId: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
