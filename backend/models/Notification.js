const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['info','warning','success','error','booking','subscription','system','dispute'], default: 'info' },
  relatedId: { type: mongoose.Schema.Types.ObjectId },
  read: { type: Boolean, default: false, index: true }
}, { timestamps: true });
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
module.exports = mongoose.model('Notification', notificationSchema);
