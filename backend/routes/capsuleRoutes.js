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

// ✅ UPDATE capsule - ADD THIS ROUTE
router.put("/:id", upload.fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 },
  { name: "audio", maxCount: 1 },
]), async (req, res) => {
  try {
    const { title, message, unlockDate } = req.body;
    const capsuleId = req.params.id;
    
    // Find existing capsule
    const existingCapsule = await Capsule.findById(capsuleId);
    if (!existingCapsule) {
      return res.status(404).json({ error: "Capsule not found" });
    }
    
    // Check if capsule is already unlocked
    const currentTime = new Date();
    const existingUnlockDate = new Date(existingCapsule.unlockDate);
    
    if (existingUnlockDate <= currentTime) {
      return res.status(400).json({ error: "Cannot edit an already unlocked capsule" });
    }
    
    // Validate new unlock date (must be in future)
    if (unlockDate) {
      const newUnlockDate = new Date(unlockDate);
      const minAllowed = new Date(Date.now() + 60000); // At least 1 minute in future
      
      if (newUnlockDate <= minAllowed) {
        return res.status(400).json({ error: "Unlock date must be at least 1 minute in the future" });
      }
      
      existingCapsule.unlockDate = newUnlockDate;
    }
    
    // Update title if provided
    if (title && title.trim()) {
      existingCapsule.title = title;
    }
    
    // Update message if provided
    if (message !== undefined) {
      existingCapsule.message = message;
    }
    
    // Handle file updates - delete old files if new ones are uploaded
    if (req.files?.image) {
      // Delete old image if exists
      if (existingCapsule.image) {
        const oldImagePath = path.join(__dirname, '..', existingCapsule.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      existingCapsule.image = req.files.image[0].path;
    }
    
    if (req.files?.video) {
      if (existingCapsule.video) {
        const oldVideoPath = path.join(__dirname, '..', existingCapsule.video);
        if (fs.existsSync(oldVideoPath)) {
          fs.unlinkSync(oldVideoPath);
        }
      }
      existingCapsule.video = req.files.video[0].path;
    }
    
    if (req.files?.audio) {
      if (existingCapsule.audio) {
        const oldAudioPath = path.join(__dirname, '..', existingCapsule.audio);
        if (fs.existsSync(oldAudioPath)) {
          fs.unlinkSync(oldAudioPath);
        }
      }
      existingCapsule.audio = req.files.audio[0].path;
    }
    
    await existingCapsule.save();
    res.json(existingCapsule);
    
  } catch (err) {
    console.error(err);
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