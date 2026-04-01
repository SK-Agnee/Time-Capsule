const mongoose = require('mongoose');

<<<<<<< Updated upstream
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: '' },
  profilePicture: { type: String, default: '' },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});
=======
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
    type: String,
    required: false // 🔥 important for Google/GitHub users
    },

    provider: {
        type: String,
        enum: ["local", "google", "github"],
        default: "local"
    },

    providerId: {
        type: String
    }
}, { timestamps: true });
>>>>>>> Stashed changes

module.exports = mongoose.model('User', UserSchema);