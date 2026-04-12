const express = require("express");
const router = express.Router();
const Capsule = require("../models/Capsule");
const fs = require("fs");
const path = require("path");
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

// CREATE CAPSULE
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, message, unlockDate, userId, visibility } = req.body;

      const imagePath = req.files?.image ? req.files.image[0].path : null;
      const videoPath = req.files?.video ? req.files.video[0].path : null;
      const audioPath = req.files?.audio ? req.files.audio[0].path : null;

      const capsule = new Capsule({
        title,
        message,
        unlockDate,
        userId,
        visibility: visibility || "private",
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
  }
);

// GET capsules by user
router.get("/:userId", async (req, res) => {
  try {
    const capsules = await Capsule.find({ userId: req.params.userId });
    res.json(capsules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET public capsules (for discovery)
router.get("/public/all", async (req, res) => {
  try {
    const capsules = await Capsule.find({ 
      visibility: 'public',
      unlockDate: { $lte: new Date() }
    }).sort({ createdAt: -1 });
    res.json(capsules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// MARK AS VIEWED
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

// UPDATE CAPSULE
router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, message, unlockDate } = req.body;
      const capsuleId = req.params.id;

      const existingCapsule = await Capsule.findById(capsuleId);
      if (!existingCapsule) {
        return res.status(404).json({ error: "Capsule not found" });
      }

      const currentTime = new Date();
      const existingUnlockDate = new Date(existingCapsule.unlockDate);

      if (existingUnlockDate <= currentTime) {
        return res
          .status(400)
          .json({ error: "Cannot edit an already unlocked capsule" });
      }

      if (unlockDate) {
        const newUnlockDate = new Date(unlockDate);
        const minAllowed = new Date(Date.now() + 60000);

        if (newUnlockDate <= minAllowed) {
          return res.status(400).json({
            error: "Unlock date must be at least 1 minute in the future",
          });
        }

        if (newUnlockDate <= existingUnlockDate) {
          return res.status(400).json({
            error: "New unlock date must be after the current unlock date",
          });
        }

        existingCapsule.unlockDate = newUnlockDate;
      }

      if (title && title.trim()) {
        existingCapsule.title = title;
      }

      if (message !== undefined) {
        existingCapsule.message = message;
      }

      if (req.files?.image) {
        if (existingCapsule.image) {
          const oldPath = path.join(__dirname, "..", existingCapsule.image);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        existingCapsule.image = req.files.image[0].path;
      }

      if (req.files?.video) {
        if (existingCapsule.video) {
          const oldPath = path.join(__dirname, "..", existingCapsule.video);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        existingCapsule.video = req.files.video[0].path;
      }

      if (req.files?.audio) {
        if (existingCapsule.audio) {
          const oldPath = path.join(__dirname, "..", existingCapsule.audio);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        existingCapsule.audio = req.files.audio[0].path;
      }

      await existingCapsule.save();
      res.json(existingCapsule);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);

// DELETE CAPSULE
router.delete("/:id", async (req, res) => {
  try {
    const capsule = await Capsule.findById(req.params.id);

    if (!capsule) {
      return res.status(404).json({ error: "Capsule not found" });
    }

    if (capsule.image) {
      const imagePath = path.join(__dirname, "..", capsule.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    if (capsule.video) {
      const videoPath = path.join(__dirname, "..", capsule.video);
      if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
    }

    if (capsule.audio) {
      const audioPath = path.join(__dirname, "..", capsule.audio);
      if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
    }

    await Capsule.findByIdAndDelete(req.params.id);

    res.json({ message: "Capsule deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;