const express = require("express");
const router = express.Router();
const Capsule = require("../models/Capsule");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Sanitize filename to prevent directory traversal attacks
    const safeFilename = Date.now() + "-" + file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, safeFilename);
  },
});

// File filter to validate file types
const fileFilter = (req, file, cb) => {
  // Define allowed file types
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedVideoTypes = /mp4|mov|avi|mkv|webm/;
  const allowedAudioTypes = /mp3|wav|ogg|aac|m4a/;
  
  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype.toLowerCase();
  
  if (file.fieldname === 'image') {
    const isValid = allowedImageTypes.test(extname) || allowedImageTypes.test(mimetype);
    if (!isValid) {
      return cb(new Error('Only image files (JPEG, PNG, GIF, WEBP) are allowed for image uploads'));
    }
  } else if (file.fieldname === 'video') {
    const isValid = allowedVideoTypes.test(extname) || allowedVideoTypes.test(mimetype);
    if (!isValid) {
      return cb(new Error('Only video files (MP4, MOV, AVI, MKV, WEBM) are allowed for video uploads'));
    }
  } else if (file.fieldname === 'audio') {
    const isValid = allowedAudioTypes.test(extname) || allowedAudioTypes.test(mimetype);
    if (!isValid) {
      return cb(new Error('Only audio files (MP3, WAV, OGG, AAC, M4A) are allowed for audio uploads'));
    }
  }
  
  cb(null, true);
};

// Configure multer with size limits
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit per file
    files: 3 // Maximum 3 files per request (image, video, audio)
  },
  fileFilter: fileFilter
});

// Custom error handler for multer errors
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: 'File too large', 
        details: 'Each file must be less than 50MB' 
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        error: 'Too many files', 
        details: 'Maximum 3 files per request' 
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ 
        error: 'Unexpected file field', 
        details: `Only image, video, and audio files are allowed` 
      });
    }
    return res.status(400).json({ error: err.message });
  }
  
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  
  next();
};

// CREATE CAPSULE with size validation
router.post(
  "/",
  (req, res, next) => {
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "video", maxCount: 1 },
      { name: "audio", maxCount: 1 },
    ])(req, res, (err) => {
      if (err) {
        return handleMulterError(err, req, res, next);
      }
      next();
    });
  },
  async (req, res) => {
    try {
      const { title, message, unlockDate, userId, visibility } = req.body;

      // Validate required fields
      if (!title || !title.trim()) {
        // Clean up any uploaded files if validation fails
        if (req.files) {
          Object.values(req.files).flat().forEach(file => {
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
          });
        }
        return res.status(400).json({ error: "Title is required" });
      }

      if (!unlockDate) {
        if (req.files) {
          Object.values(req.files).flat().forEach(file => {
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
          });
        }
        return res.status(400).json({ error: "Unlock date is required" });
      }

      if (!userId) {
        if (req.files) {
          Object.values(req.files).flat().forEach(file => {
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
          });
        }
        return res.status(400).json({ error: "User ID is required" });
      }

      // Validate unlock date is in the future
      const unlockDateTime = new Date(unlockDate);
      const minAllowed = new Date(Date.now() + 60000); // 1 minute from now
    
      if (unlockDateTime <= minAllowed) {
        if (req.files) {
          Object.values(req.files).flat().forEach(file => {
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
          });
        }
        return res.status(400).json({ 
          error: "Unlock date must be at least 1 minute in the future" 
        });
      }

      const imagePath = req.files?.image ? req.files.image[0].path : null;
      const videoPath = req.files?.video ? req.files.video[0].path : null;
      const audioPath = req.files?.audio ? req.files.audio[0].path : null;

      // Validate at least one media file or message
      if (!imagePath && !videoPath && !audioPath && (!message || !message.trim())) {
        if (req.files) {
          Object.values(req.files).flat().forEach(file => {
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
          });
        }
        return res.status(400).json({ 
          error: "Capsule must contain at least one media file or a message" 
        });
      }

      const capsule = new Capsule({
        title: title.trim(),
        message: message || "",
        unlockDate: unlockDateTime,
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
      // Clean up any uploaded files if database save fails
      if (req.files) {
        Object.values(req.files).flat().forEach(file => {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        });
      }
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

// UPDATE CAPSULE with size validation
router.put(
  "/:id",
  (req, res, next) => {
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "video", maxCount: 1 },
      { name: "audio", maxCount: 1 },
    ])(req, res, (err) => {
      if (err) {
        return handleMulterError(err, req, res, next);
      }
      next();
    });
  },
  async (req, res) => {
    try {
      const { title, message, unlockDate } = req.body;
      const capsuleId = req.params.id;

      const existingCapsule = await Capsule.findById(capsuleId);
      if (!existingCapsule) {
        // Clean up any uploaded files
        if (req.files) {
          Object.values(req.files).flat().forEach(file => {
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
          });
        }
        return res.status(404).json({ error: "Capsule not found" });
      }

      const currentTime = new Date();
      const existingUnlockDate = new Date(existingCapsule.unlockDate);

      if (existingUnlockDate <= currentTime) {
        if (req.files) {
          Object.values(req.files).flat().forEach(file => {
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
          });
        }
        return res
          .status(400)
          .json({ error: "Cannot edit an already unlocked capsule" });
      }

      if (unlockDate) {
        const newUnlockDate = new Date(unlockDate);
        const minAllowed = new Date(Date.now() + 60000);

        if (newUnlockDate <= minAllowed) {
          if (req.files) {
            Object.values(req.files).flat().forEach(file => {
              if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
            });
          }
          return res.status(400).json({
            error: "Unlock date must be at least 1 minute in the future",
          });
        }

        if (newUnlockDate <= existingUnlockDate) {
          if (req.files) {
            Object.values(req.files).flat().forEach(file => {
              if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
            });
          }
          return res.status(400).json({
            error: "New unlock date must be after the current unlock date",
          });
        }

        existingCapsule.unlockDate = newUnlockDate;
      }

      if (title && title.trim()) {
        existingCapsule.title = title.trim();
      }

      if (message !== undefined) {
        existingCapsule.message = message;
      }

      // Handle file updates with size validation (already handled by multer)
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
      // Clean up any uploaded files if error occurs
      if (req.files) {
        Object.values(req.files).flat().forEach(file => {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        });
      }
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

    // Delete all associated files
    const filesToDelete = ['image', 'video', 'audio'];
    filesToDelete.forEach(fileType => {
      if (capsule[fileType]) {
        const filePath = path.join(__dirname, "..", capsule[fileType]);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    });

    await Capsule.findByIdAndDelete(req.params.id);
    res.json({ message: "Capsule deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;