// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();

// // middleware
// app.use(cors());
// app.use(express.json());

// // routes
// const authRoutes = require('./routes/authRoutes');
// app.use('/api/auth', authRoutes);

// const capsuleRoutes = require('./routes/capsuleRoutes');
// app.use('/api/capsules', capsuleRoutes);

// // test route
// app.get('/', (req, res) => {
//     res.send('Backend is running 🚀');
// });

// // DB connect
// mongoose.connect(process.env.MONGO_URI)
// .then(() => console.log("MongoDB Connected"))
// .catch(err => console.log(err));

// // server
// app.listen(5000, () => console.log("Server running on port 5000"));

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors());
app.use(express.json());

// ✅ Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const capsuleRoutes = require("./routes/capsuleRoutes");
app.use("/api/capsules", capsuleRoutes);

// ✅ MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/capsuleDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.listen(5000, () => console.log("Server running on port 5000"));