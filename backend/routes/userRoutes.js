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
    
    // Check if users are friends
    let isFriend = false;
    let friendRequestStatus = null;
    
    if (currentUserId && !isOwner) {
      try {
        const currentUser = await User.findById(currentUserId);
        if (currentUser) {
          isFriend = currentUser.friends?.includes(req.params.userId) || false;
          
          // Check if friend request exists from current user to this profile
          if (user.friendRequests) {
            const requestFromMe = user.friendRequests.find(
              req => req.from && req.from.toString() === currentUserId && req.status === 'pending'
            );
            if (requestFromMe) {
              friendRequestStatus = 'pending_from_me';
            }
          }
          
          // Check if friend request exists from this profile to current user
          if (!friendRequestStatus && currentUser.friendRequests) {
            const requestFromThem = currentUser.friendRequests.find(
              req => req.from && req.from.toString() === req.params.userId && req.status === 'pending'
            );
            if (requestFromThem) {
              friendRequestStatus = 'pending_from_them';
            }
          }
        }
      } catch (err) {
        console.error("Error checking friend status:", err);
        // Continue without friend status
      }
    }
    
    // Get capsules - filter based on visibility
    let capsules = await Capsule.find({ userId: req.params.userId });
    
    // Filter capsules based on visibility
    const visibleCapsules = capsules.filter(capsule => {
      const isUnlocked = new Date(capsule.unlockDate).getTime() <= Date.now();
      if (!isUnlocked) return false;
      if (isOwner) return true;
      if (capsule.visibility === 'public') return true;
      if (capsule.visibility === 'friends' && isFriend) return true;
      return false;
    });
    
    const totalCapsules = capsules.length;
    const unlockedCapsules = capsules.filter(c => 
      new Date(c.unlockDate).getTime() <= Date.now() && c.viewed
    ).length;
    const upcomingCapsules = capsules.filter(c => 
      new Date(c.unlockDate).getTime() > Date.now()
    ).length;
    
    // Prepare response object
    const responseData = {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio || '',
      profilePicture: user.profilePicture || '',
      totalCapsules,
      unlockedCapsules,
      upcomingCapsules,
      friendsCount: user.friends?.length || 0,
      isOwner,
      isFriend: isFriend || false,
      friendRequestStatus: friendRequestStatus || null,
      createdAt: user.createdAt,
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
    };
    
    res.json(responseData);
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Send friend request
router.post('/friend-request', async (req, res) => {
  try {
    const { fromUserId, toUserId } = req.body;
    
    const fromUser = await User.findById(fromUserId);
    const toUser = await User.findById(toUserId);
    
    if (!fromUser || !toUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if already friends
    if (fromUser.friends && fromUser.friends.includes(toUserId)) {
      return res.status(400).json({ error: 'Already friends' });
    }
    
    // Initialize arrays if they don't exist
    if (!toUser.friendRequests) toUser.friendRequests = [];
    
    // Check if request already sent
    const existingRequest = toUser.friendRequests.find(
      req => req.from && req.from.toString() === fromUserId && req.status === 'pending'
    );
    
    if (existingRequest) {
      return res.status(400).json({ error: 'Friend request already sent' });
    }
    
    // Add friend request to recipient
    toUser.friendRequests.push({
      from: fromUserId,
      status: 'pending',
      createdAt: new Date()
    });
    
    await toUser.save();
    
    // Initialize sentRequests array if it doesn't exist
    if (!fromUser.sentRequests) fromUser.sentRequests = [];
    fromUser.sentRequests.push({
      to: toUserId,
      status: 'pending',
      createdAt: new Date()
    });
    await fromUser.save();
    
    res.json({ message: 'Friend request sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Accept friend request
router.post('/friend-request/accept', async (req, res) => {
  try {
    const { userId, requestId } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!user.friendRequests) {
      return res.status(404).json({ error: 'No friend requests found' });
    }
    
    const request = user.friendRequests.find(req => req.from && req.from.toString() === requestId && req.status === 'pending');
    if (!request) {
      return res.status(404).json({ error: 'Friend request not found' });
    }
    
    // Update request status
    request.status = 'accepted';
    
    // Add to friends list
    if (!user.friends) user.friends = [];
    if (!user.friends.includes(requestId)) {
      user.friends.push(requestId);
    }
    
    const requester = await User.findById(requestId);
    if (requester) {
      if (!requester.friends) requester.friends = [];
      if (!requester.friends.includes(userId)) {
        requester.friends.push(userId);
      }
      
      // Update the sent request status
      if (requester.sentRequests) {
        const sentReq = requester.sentRequests.find(r => r.to && r.to.toString() === userId);
        if (sentReq) sentReq.status = 'accepted';
      }
      await requester.save();
    }
    
    await user.save();
    
    res.json({ message: 'Friend request accepted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Reject/Decline friend request
router.post('/friend-request/reject', async (req, res) => {
  try {
    const { userId, requestId } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!user.friendRequests) {
      return res.status(404).json({ error: 'No friend requests found' });
    }
    
    const requestIndex = user.friendRequests.findIndex(
      req => req.from && req.from.toString() === requestId && req.status === 'pending'
    );
    
    if (requestIndex === -1) {
      return res.status(404).json({ error: 'Friend request not found' });
    }
    
    // Remove the request
    user.friendRequests.splice(requestIndex, 1);
    await user.save();
    
    // Also update the sender's sent request
    const sender = await User.findById(requestId);
    if (sender && sender.sentRequests) {
      const sentIndex = sender.sentRequests.findIndex(r => r.to && r.to.toString() === userId);
      if (sentIndex !== -1) {
        sender.sentRequests.splice(sentIndex, 1);
        await sender.save();
      }
    }
    
    res.json({ message: 'Friend request declined' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Cancel friend request
router.post('/friend-request/cancel', async (req, res) => {
  try {
    const { userId, requestId } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Remove from sent requests
    if (user.sentRequests) {
      const sentIndex = user.sentRequests.findIndex(r => r.to && r.to.toString() === requestId && r.status === 'pending');
      if (sentIndex !== -1) {
        user.sentRequests.splice(sentIndex, 1);
        await user.save();
      }
    }
    
    // Remove from recipient's friend requests
    const recipient = await User.findById(requestId);
    if (recipient && recipient.friendRequests) {
      const reqIndex = recipient.friendRequests.findIndex(r => r.from && r.from.toString() === userId && r.status === 'pending');
      if (reqIndex !== -1) {
        recipient.friendRequests.splice(reqIndex, 1);
        await recipient.save();
      }
    }
    
    res.json({ message: 'Friend request cancelled' });
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
    
    user.friends = user.friends?.filter(id => id && id.toString() !== friendId) || [];
    friend.friends = friend.friends?.filter(id => id && id.toString() !== userId) || [];
    
    await user.save();
    await friend.save();
    
    res.json({ message: 'Friend removed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get pending friend requests
router.get('/friend-requests/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('friendRequests.from', 'name username profilePicture');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const pendingRequests = user.friendRequests?.filter(req => req.status === 'pending') || [];
    res.json(pendingRequests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get friends list
router.get('/friends/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('friends', 'name username profilePicture');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user.friends || []);
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
    
    // Add friend status for each user
    let friendsList = [];
    if (currentUserId) {
      const currentUser = await User.findById(currentUserId);
      friendsList = currentUser?.friends?.map(id => id.toString()) || [];
    }
    
    const usersWithStatus = users.map(user => ({
      ...user,
      isFriend: friendsList.includes(user._id.toString())
    }));
    
    res.json(usersWithStatus);
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