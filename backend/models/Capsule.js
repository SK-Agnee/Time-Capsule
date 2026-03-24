// const mongoose = require('mongoose');

// const capsuleSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
//   title: String,
//   message: String,
//   unlockDate: Date,
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('Capsule', capsuleSchema);

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
});

module.exports = mongoose.model("Capsule", capsuleSchema);