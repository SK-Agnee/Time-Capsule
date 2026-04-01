const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  username: {
    type: String,
    unique: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: false // for OAuth users
  },

  provider: {
    type: String,
    enum: ["local", "google", "github"],
    default: "local"
  },

  providerId: {
    type: String
  },

  bio: {
    type: String,
    default: ""
  },

  profilePicture: {
    type: String,
    default: ""
  },

  friends: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  ]

}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);