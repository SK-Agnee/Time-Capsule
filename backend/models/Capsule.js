const mongoose = require('mongoose');

const CapsuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  unlockDate: { type: Date, required: true },
  userId: { type: String, required: true },
  visibility: { type: String, enum: ['private', 'friends', 'public'], default: 'private' },
  image: { type: String, default: null },
  video: { type: String, default: null },
  audio: { type: String, default: null },
  viewed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Capsule', CapsuleSchema);