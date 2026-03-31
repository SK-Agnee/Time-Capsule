const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Capsule = require('../models/Capsule');

// Get user profile with visible capsules
router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const currentUserId = req.headers['user-id'];
    const isOwner = currentUserId === req.params.userId;
    
    // Check if users are friends
    let isFriend = false;
    if (currentUserId && !isOwner) {
      const currentUser = await User.findById(currentUserId);
      isFriend = currentUser?.friends?.includes(req.params.userId) || false;
    }
    
    // Get capsules with visibility rules
    let capsules = await Capsule.find({ userId: req.params.userId });
    
    // Filter capsules based on visibility
    const visibleCapsules = capsules.filter(capsule => {
      const isUnlocked = new Date(capsule.unlockDate).getTime() <= Date.now();
      
      // Only show unlocked capsules
      if (!isUnlocked) return false;
      
      // Owner sees everything
      if (isOwner) return true;
      
      // Check visibility
      switch (capsule.visibility) {
        case 'public':
          return true;
        case 'friends':
          return isFriend;
        case 'private':
          return false;
        default:
          return false;
      }
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
      isFriend,
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

// Search users with real-time results
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
    
    // Check friend status
    let friendIds = [];
    if (currentUserId) {
      const currentUser = await User.findById(currentUserId).select('friends');
      friendIds = currentUser?.friends?.map(id => id.toString()) || [];
    }
    
    const usersWithStatus = users.map(user => ({
      ...user,
      isFriend: friendIds.includes(user._id.toString())
    }));
    
    res.json(usersWithStatus);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Add friend
router.post('/friend-request', async (req, res) => {
  try {
    const { fromUserId, toUserId } = req.body;
    
    const fromUser = await User.findById(fromUserId);
    const toUser = await User.findById(toUserId);
    
    if (!fromUser || !toUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!fromUser.friends) fromUser.friends = [];
    if (!toUser.friends) toUser.friends = [];
    
    if (fromUser.friends.includes(toUserId)) {
      return res.status(400).json({ error: 'Already friends' });
    }
    
    fromUser.friends.push(toUserId);
    toUser.friends.push(fromUserId);
    
    await fromUser.save();
    await toUser.save();
    
    res.json({ message: 'Friend added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Remove friend
router.delete('/friend/:userId/:friendId', async (req, res) => {
  try {
    const { userId, friendId } = req.params;
    
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);
    
    if (!user || !friend) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.friends = user.friends?.filter(id => id.toString() !== friendId) || [];
    friend.friends = friend.friends?.filter(id => id.toString() !== userId) || [];
    
    await user.save();
    await friend.save();
    
    res.json({ message: 'Friend removed successfully' });
  } catch (err) {
    console.error(err);
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