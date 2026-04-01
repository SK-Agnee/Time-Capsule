<<<<<<< Updated upstream
=======
require("dotenv").config();
>>>>>>> Stashed changes
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
<<<<<<< Updated upstream
require('dotenv').config();
=======
const session = require("express-session");
const passport = require("passport");
require("./config/passport");

>>>>>>> Stashed changes

const app = express();

app.use(cors());
app.use(express.json());
<<<<<<< Updated upstream
=======
app.use(session({
  secret: "secretkey",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// ✅ Serve uploaded images
>>>>>>> Stashed changes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const capsuleRoutes = require("./routes/capsuleRoutes");
app.use("/api/capsules", capsuleRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// MongoDB connection
mongoose
<<<<<<< Updated upstream
  .connect(process.env.MONGO_URI || "mongodb+srv://Tanmaya:Tiger@cluster0.qu2phva.mongodb.net/")
=======
  .connect(process.env.MONGO_URI)
>>>>>>> Stashed changes
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.listen(5000, () => console.log("Server running on port 5000"));