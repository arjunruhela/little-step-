const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
  parentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true 
  },
  name: { type: String, required: true, trim: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['male', 'female', 'other', 'prefer-not-to-say'] },
  allergies: [String],
  specialRequirements: String,
  emergencyContact: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    relationship: String
  },
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model('Child', childSchema);
