const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Capsule = require('../models/Capsule');

// Get user profile with public capsules only
router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const currentUserId = req.headers['user-id'];
    const isOwner = currentUserId === req.params.userId;
    
    // Get capsules - only public ones for other users
    let capsules = await Capsule.find({ userId: req.params.userId });
    
    // Filter capsules based on visibility
    const visibleCapsules = capsules.filter(capsule => {
      const isUnlocked = new Date(capsule.unlockDate).getTime() <= Date.now();
      
      // Only show unlocked capsules
      if (!isUnlocked) return false;
      
      // Owner sees everything (private + public)
      if (isOwner) return true;
      
      // Other users only see public capsules
      return capsule.visibility === 'public';
    });
    
    const totalCapsules = capsules.length;
    const unlockedCapsules = capsules.filter(c => 
      new Date(c.unlockDate).getTime() <= Date.now() && c.viewed
    ).length;
    const upcomingCapsules = capsules.filter(c => 
      new Date(c.unlockDate).getTime() > Date.now()
    ).length;
    
    res.json({
      ...user.toObject(),
      totalCapsules,
      unlockedCapsules,
      upcomingCapsules,
      friendsCount: user.friends?.length || 0,
      isOwner,
      visibleCapsules: visibleCapsules.map(c => ({
        _id: c._id,
        title: c.title,
        message: c.message,
        unlockDate: c.unlockDate,
        createdAt: c.createdAt,
        image: c.image,
        video: c.video,
        audio: c.audio,
        viewed: c.viewed,
        visibility: c.visibility
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Search users
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      return res.json([]);
    }
    
    const currentUserId = req.headers['user-id'];
    const searchRegex = new RegExp(q.trim(), 'i');
    
    const users = await User.find({
      $and: [
        {
          $or: [
            { username: searchRegex },
            { name: searchRegex }
          ]
        },
        { _id: { $ne: currentUserId } }
      ]
    })
    .select('name username bio profilePicture')
    .limit(10)
    .lean();
    
    res.json(users);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update user profile
router.put('/profile/:userId', async (req, res) => {
  try {
    const { name, bio } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { name, bio },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;