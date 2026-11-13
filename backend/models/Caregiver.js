const mongoose = require('mongoose');

const caregiverSchema = new mongoose.Schema({
  centerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ChildcareCenter', 
    required: true,
    index: true 
  },
  name: { type: String, required: true, trim: true },
  photo: String,
  qualification: String,
  experience: String,
  specialization: String,
  bio: String,
  verificationStatus: { 
    type: String, 
    enum: ['pending', 'verified', 'rejected'], 
    default: 'pending' 
  },
}, { timestamps: true });

module.exports = mongoose.model('Caregiver', caregiverSchema);
