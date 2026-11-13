const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  centerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ChildcareCenter', 
    required: true,
    index: true 
  },
  date: { type: Date, required: true }, // For specific dates
  dayOfWeek: { 
    type: String, 
    enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    index: true 
  },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  capacity: { type: Number, required: true },
  availableCapacity: { type: Number, required: true },
  type: { 
    type: String, 
    enum: ['Day', 'Night', 'Emergency', '24x7'], 
    required: true 
  },
}, { timestamps: true });

availabilitySchema.index({ centerId: 1, date: 1 });
availabilitySchema.index({ centerId: 1, dayOfWeek: 1 });

module.exports = mongoose.model('Availability', availabilitySchema);
