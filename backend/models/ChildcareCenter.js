const mongoose = require('mongoose');

const childcareCenterSchema = new mongoose.Schema({
  providerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Provider', 
    required: true,
    index: true 
  },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true, index: true },
  latitude: Number,
  longitude: Number,
  images: [String],
  operatingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String },
  },
  is24x7: { type: Boolean, default: false, index: true },
  ageGroups: [{ type: String }], // e.g., ["0-2", "3-5"]
  serviceTypes: [{ type: String }], // e.g., ["daycare", "babysitting"]
  capacity: { type: Number, required: true },
  safetyMeasures: [String],
  certifications: [String],
  verificationStatus: { 
    type: String, 
    enum: ['pending', 'verified', 'rejected'], 
    default: 'pending' 
  },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
}, { timestamps: true });

childcareCenterSchema.index({ city: 1, is24x7: 1 });

module.exports = mongoose.model('ChildcareCenter', childcareCenterSchema);
