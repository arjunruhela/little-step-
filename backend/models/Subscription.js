const mongoose = require('mongoose');
const subscriptionSchema = new mongoose.Schema({
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  centerId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChildcareCenter', required: true, index: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'PricingPlan', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['active','cancelled','expired'], default: 'active', index: true },
  amount: { type: Number, required: true, min: 0 }
}, { timestamps: true });
subscriptionSchema.index({ parentId: 1, status: 1 });
module.exports = mongoose.model('Subscription', subscriptionSchema);
