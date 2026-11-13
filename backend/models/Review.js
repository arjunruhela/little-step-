const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  centerId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChildcareCenter', required: true, index: true },
  bookingId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Booking', 
    required: true, 
    unique: true 
  },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
