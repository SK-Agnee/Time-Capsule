const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const capsuleRoutes = require('./routes/capsuleRoutes');
app.use('/api/capsules', capsuleRoutes);

// test route
app.get('/', (req, res) => {
    res.send('Backend is running 🚀');
});

// DB connect
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// server
app.listen(5000, () => console.log("Server running on port 5000"));