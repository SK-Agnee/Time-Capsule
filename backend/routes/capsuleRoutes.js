const express = require("express");
const router = express.Router();
const Capsule = require("../models/Capsule");
const fs = require('fs'); // Add this to delete files from uploads folder
const path = require('path'); // Add this for path handling

// multer config
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/", upload.fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 },
  { name: "audio", maxCount: 1 },
]), async (req, res) => {
  try {
    const { title, message, unlockDate, userId } = req.body;

    const imagePath = req.files?.image
      ? req.files.image[0].path
      : null;

    const videoPath = req.files?.video
      ? req.files.video[0].path
      : null;

    const audioPath = req.files?.audio
      ? req.files.audio[0].path
      : null;

    const capsule = new Capsule({
      title,
      message,
      unlockDate,
      userId,
      image: imagePath,
      video: videoPath, 
      audio: audioPath,
    });

    await capsule.save();

    res.json(capsule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET capsules
router.get("/:userId", async (req, res) => {
  try {
    const capsules = await Capsule.find({ userId: req.params.userId });
    res.json(capsules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/view/:id", async (req, res) => {
  try {
    const capsule = await Capsule.findByIdAndUpdate(
      req.params.id,
      { viewed: true },
      { new: true }
    );

    res.json(capsule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE capsule - ADD THIS ROUTE
router.delete("/:id", async (req, res) => {
  try {
    const capsule = await Capsule.findById(req.params.id);
    
    if (!capsule) {
      return res.status(404).json({ error: "Capsule not found" });
    }

    // Delete associated files from uploads folder
    if (capsule.image) {
      const imagePath = path.join(__dirname, '..', capsule.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    if (capsule.video) {
      const videoPath = path.join(__dirname, '..', capsule.video);
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
    }
    
    if (capsule.audio) {
      const audioPath = path.join(__dirname, '..', capsule.audio);
      if (fs.existsSync(audioPath)) {
        fs.unlinkSync(audioPath);
      }
    }

    // Delete capsule from database
    await Capsule.findByIdAndDelete(req.params.id);
    
    res.json({ message: "Capsule deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;