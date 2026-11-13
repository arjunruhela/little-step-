const mongoose = require('mongoose');
const pricingPlanSchema = new mongoose.Schema({
  centerId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChildcareCenter', required: true, index: true },
  type: { type: String, enum: ['hourly','daily','monthly'], required: true },
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  description: String,
  includedServices: [String],
  active: { type: Boolean, default: true, index: true }
}, { timestamps: true });
pricingPlanSchema.index({ centerId: 1, type: 1, active: 1 });
module.exports = mongoose.model('PricingPlan', pricingPlanSchema);
