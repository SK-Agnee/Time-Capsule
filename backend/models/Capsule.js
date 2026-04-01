<<<<<<< Updated upstream
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
=======
const mongoose = require("mongoose");

const capsuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  message: String,
  unlockDate: Date,
  userId: String,

  // ✅ NEW FIELD
  image: String,
  video: String,
  audio: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },

  viewed: {
    type: Boolean,
    default: false,
  }
>>>>>>> Stashed changes
});

module.exports = mongoose.model('Capsule', CapsuleSchema);