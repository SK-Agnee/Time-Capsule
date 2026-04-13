import { useState, useEffect } from "react";
import { Users, Lock, Clock, Heart, Gift, UserPlus, Check, X, User, UserCheck, Globe, Unlock, Eye, MessageCircle, Share2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { format } from "date-fns";

interface Friend {
  _id: string;
  name: string;
  username: string;
  profilePicture?: string;
}

interface FriendCapsule {
  _id: string;
  title: string;
  message: string;
  unlockDate: string;
  createdAt: string;
  image?: string;
  video?: string;
  audio?: string;
  viewed?: boolean;
  visibility?: string;
  author: {
    _id: string;
    name: string;
    username: string;
    profilePicture?: string;
  };
}

interface FriendRequest {
  _id: string;
  from: {
    _id: string;
    name: string;
    username: string;
    profilePicture?: string;
  };
  status: string;
  createdAt: string;
}

const FriendsVaults = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendCapsules, setFriendCapsules] = useState<FriendCapsule[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [time, setTime] = useState(Date.now());
  
  // Modal states
  const [selectedCapsule, setSelectedCapsule] = useState<FriendCapsule | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("capsule_current_user") || "{}");
    setCurrentUser(user);
    if (user?._id) {
      fetchFriends(user._id);
      fetchPendingRequests(user._id);
    }
  }, []);

  // Fetch friends list
  const fetchFriends = async (userId: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/friends/${userId}`);
      setFriends(response.data);
      // After getting friends, fetch their capsules
      fetchFriendsCapsules(response.data);
    } catch (err) {
      console.error("Error fetching friends:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch friends-visibility capsules from all friends (both locked and unlocked)
  const fetchFriendsCapsules = async (friendsList: Friend[]) => {
    if (!friendsList.length) return;
    
    try {
      const allCapsules: FriendCapsule[] = [];
      
      for (const friend of friendsList) {
        // Fetch all capsules from the friend
        const response = await axios.get(`http://localhost:5000/api/capsules/${friend._id}`);
        const allFriendCapsules = response.data;
        
        // Filter capsules that have visibility 'friends' (both locked and unlocked)
        const friendsOnlyCapsules = allFriendCapsules.filter((c: FriendCapsule) => {
          // ONLY 'friends' visibility, NOT 'public'
          return c.visibility === 'friends';
        });
        
        // Add author info to each capsule
        const capsulesWithAuthor = friendsOnlyCapsules.map((c: FriendCapsule) => ({
          ...c,
          author: {
            _id: friend._id,
            name: friend.name,
            username: friend.username,
            profilePicture: friend.profilePicture
          }
        }));
        
        allCapsules.push(...capsulesWithAuthor);
      }
      
      // Sort by newest first
      allCapsules.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setFriendCapsules(allCapsules);
    } catch (err) {
      console.error("Error fetching friend capsules:", err);
    }
  };

  const fetchPendingRequests = async (userId: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/friend-requests/${userId}`);
      setPendingRequests(response.data);
    } catch (err) {
      console.error("Error fetching friend requests:", err);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await axios.post(`http://localhost:5000/api/users/friend-request/accept`, {
        userId: currentUser?._id,
        requestId
      });
      
      toast({ title: "Friend Added", description: "You are now friends!" });
      fetchFriends(currentUser?._id);
      fetchPendingRequests(currentUser?._id);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to accept request", variant: "destructive" });
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await axios.post(`http://localhost:5000/api/users/friend-request/reject`, {
        userId: currentUser?._id,
        requestId
      });
      
      toast({ title: "Request Declined", description: "Friend request declined" });
      fetchPendingRequests(currentUser?._id);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to decline request", variant: "destructive" });
    }
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getCapsuleStatus = (unlockDate: string) => {
    const isUnlocked = new Date(unlockDate).getTime() <= time;
    return isUnlocked ? "unlocked" : "locked";
  };

  const getTimeProgress = (createdAt: string, unlockDate: string) => {
    const created = new Date(createdAt).getTime();
    const unlock = new Date(unlockDate).getTime();
    const now = Date.now();
    if (now >= unlock) return 100;
    const totalDuration = unlock - created;
    const elapsed = now - created;
    const percentage = (elapsed / totalDuration) * 100;
    return Math.max(0, Math.min(100, percentage));
  };

  const getCountdown = (diff: number) => {
    if (diff <= 0) return "Unlocked";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    return `${days}d ${hours}h left`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Friends' Capsules Feed - shows both locked and unlocked */}
      <Card className="lg:col-span-2 bg-card/50 border-border/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-serif flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Friends' Vaults
          </CardTitle>
          <p className="text-sm text-muted-foreground">Capsules shared exclusively with friends</p>
        </CardHeader>
        <CardContent>
          {friends.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="font-medium">No friends yet</p>
              <p className="text-sm mt-1">Add friends to see capsules they've shared with you</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.href = "/dashboard?tab=discovery"}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Find Friends
              </Button>
            </div>
          ) : friendCapsules.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Lock className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="font-medium">No shared capsules yet</p>
              <p className="text-sm mt-1">Your friends haven't shared any capsules with "Friends" visibility</p>
              <p className="text-xs text-muted-foreground mt-2">When friends create capsules and set visibility to "Friends", they'll appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {friendCapsules.map((capsule) => {
                const status = getCapsuleStatus(capsule.unlockDate);
                const isUnlocked = status === "unlocked";
                const unlockDate = new Date(capsule.unlockDate);
                const progress = getTimeProgress(capsule.createdAt, capsule.unlockDate);
                const countdown = getCountdown(unlockDate.getTime() - time);
                
                return (
                  <div
                    key={capsule._id}
                    onClick={() => {
                      // Only allow clicking to view if unlocked
                      if (isUnlocked) {
                        setSelectedCapsule(capsule);
                        setShowModal(true);
                      }
                    }}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      isUnlocked 
                        ? "border-border/30 hover:border-primary/50 hover:shadow-lg" 
                        : "border-border/30 hover:border-primary/30"
                    }`}
                  >
                    {/* Author Info */}
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={capsule.author.profilePicture} />
                        <AvatarFallback className="bg-primary/20 text-primary text-xs">
                          {getInitials(capsule.author.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{capsule.author.name}</p>
                        <p className="text-xs text-muted-foreground">@{capsule.author.username}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                        <Users className="w-3 h-3" />
                        <span>Friends only</span>
                      </div>
                    </div>

                    {/* Capsule Content */}
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-lg">{capsule.title}</h3>
                        {isUnlocked ? (
                          <Badge variant="default" className="bg-green-500/20 text-green-500">
                            <Unlock className="w-3 h-3 mr-1" />Unlocked
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <Lock className="w-3 h-3 mr-1" />Locked
                          </Badge>
                        )}
                      </div>
                      
                      {/* Show message preview only if unlocked */}
                      {isUnlocked && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{capsule.message}</p>
                      )}
                      
                      {/* Show unlock date info */}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Created: {format(new Date(capsule.createdAt), "MMM d, yyyy")}</span>
                        <span>
                          {isUnlocked 
                            ? `Unlocked on ${format(unlockDate, "MMM d, yyyy")}`
                            : `Unlocks on ${format(unlockDate, "MMM d, yyyy")}`
                          }
                        </span>
                      </div>
                      
                      {/* Show countdown for locked capsules */}
                      {!isUnlocked && (
                        <p className="text-xs text-primary mt-1">
                          {countdown}
                        </p>
                      )}
                    </div>

                    {/* Progress Bar - simple, no percentage text */}
                    <div className="mt-3">
                      <Progress value={progress} className="h-1.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Requests Sidebar */}
      <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-serif flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            Friend Requests
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <UserCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No pending requests</p>
            </div>
          ) : (
            pendingRequests.map((request) => (
              <div key={request._id} className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={request.from.profilePicture} />
                    <AvatarFallback>{getInitials(request.from.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{request.from.name}</p>
                    <p className="text-xs text-muted-foreground">@{request.from.username}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="hero" className="flex-1" onClick={() => handleAcceptRequest(request.from._id)}>
                    <Check className="w-4 h-4 mr-1" /> Accept
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleRejectRequest(request.from._id)}>
                    <X className="w-4 h-4 mr-1" /> Decline
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* View Modal */}
      {selectedCapsule && showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-card p-6 rounded-xl max-w-md w-full relative transform transition-all duration-300 scale-100 opacity-100 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-2 right-3 text-lg hover:text-red-400 transition-colors"
              onClick={() => { setShowModal(false); setTimeout(() => setSelectedCapsule(null), 200); }}
            >
              ✖
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Avatar className="w-8 h-8">
                <AvatarImage src={selectedCapsule.author.profilePicture} />
                <AvatarFallback>{getInitials(selectedCapsule.author.name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{selectedCapsule.author.name}</p>
                <p className="text-xs text-muted-foreground">@{selectedCapsule.author.username}</p>
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-2 pr-6">{selectedCapsule.title}</h2>
            <p className="text-sm text-muted-foreground mb-4">
              {new Date(selectedCapsule.unlockDate).getTime() > Date.now() 
                ? `Unlocks on ${new Date(selectedCapsule.unlockDate).toLocaleString()}`
                : `Unlocked on ${new Date(selectedCapsule.unlockDate).toLocaleString()}`}
            </p>

            <div className="bg-muted p-4 rounded-md space-y-3">
              {new Date(selectedCapsule.unlockDate).getTime() > Date.now() ? (
                <div className="text-center py-4">
                  <Lock className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">🔒 This capsule is still locked</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Check back on {new Date(selectedCapsule.unlockDate).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <>
                  <div className="whitespace-pre-wrap">
                    <p className="font-medium mb-2">Message:</p>
                    <p className="text-muted-foreground">{selectedCapsule.message}</p>
                  </div>

                  {selectedCapsule.image && (
                    <div>
                      <p className="font-medium mb-2">Image:</p>
                      <img
                        src={`http://localhost:5000/${selectedCapsule.image}`}
                        alt="capsule"
                        className="rounded-lg max-h-60 w-full object-cover"
                      />
                    </div>
                  )}

                  {selectedCapsule.video && (
                    <div>
                      <p className="font-medium mb-2">Video:</p>
                      <video controls className="rounded-lg max-h-60 w-full">
                        <source src={`http://localhost:5000/${selectedCapsule.video}`} type="video/mp4" />
                      </video>
                    </div>
                  )}

                  {selectedCapsule.audio && (
                    <div>
                      <p className="font-medium mb-2">Audio:</p>
                      <audio controls className="w-full">
                        <source src={`http://localhost:5000/${selectedCapsule.audio}`} type="audio/mpeg" />
                      </audio>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendsVaults;