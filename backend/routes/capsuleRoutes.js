const express = require('express');
const router = express.Router();
const Capsule = require('../models/Capsule');

// CREATE CAPSULE
router.post('/', async (req, res) => {
  try {
    const { title, message, unlockDate, userId } = req.body;

    const capsule = new Capsule({
      title,
      message,
      unlockDate,
      userId
    });

    await capsule.save();

    res.json({ msg: "Capsule created" });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET CAPSULES (for a user)
router.get('/:userId', async (req, res) => {
  try {
    const capsules = await Capsule.find({ userId: req.params.userId });
    res.json(capsules);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;