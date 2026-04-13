import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, Lock, Unlock, User, Mail, Calendar, Users, Globe, Shield, Eye, MessageCircle, Heart, Share2, UserPlus, UserCheck, UserMinus, Bell, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { format } from "date-fns";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Footer from "@/components/Footer";

interface Capsule {
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
}

interface UserProfileData {
  _id: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  profilePicture?: string;
  totalCapsules: number;
  unlockedCapsules: number;
  upcomingCapsules: number;
  friendsCount: number;
  isFriend: boolean;
  isOwner: boolean;
  friendRequestStatus?: string | null;
  createdAt: string;
}

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [publicCapsules, setPublicCapsules] = useState<Capsule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [time, setTime] = useState(Date.now());
  
  // Modal states
  const [selectedCapsule, setSelectedCapsule] = useState<Capsule | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("capsule_current_user") || "{}");
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (userId && currentUser) {
      fetchUserProfile();
      fetchPublicCapsules();
    }
  }, [userId, currentUser]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/profile/${userId}`, {
        headers: { 'user-id': currentUser?._id }
      });
      setProfile(response.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  };

  const fetchPublicCapsules = async () => {
    try {
      // Fetch all capsules from the user
      const response = await axios.get(`http://localhost:5000/api/capsules/${userId}`);
      const allCapsules = response.data;
      
      // Filter only public capsules (both locked and unlocked)
      const publicOnly = allCapsules.filter((c: Capsule) => c.visibility === 'public');
      
      // Sort by newest first
      publicOnly.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setPublicCapsules(publicOnly);
    } catch (err) {
      console.error("Error fetching public capsules:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendFriendRequest = async () => {
    try {
      await axios.post('http://localhost:5000/api/users/friend-request', {
        fromUserId: currentUser?._id,
        toUserId: profile?._id
      });
      
      toast({ title: "Request Sent", description: `Friend request sent to ${profile?.name}` });
      fetchUserProfile();
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error", description: err.response?.data?.error || "Failed to send request", variant: "destructive" });
    }
  };

  const handleAcceptRequest = async () => {
    try {
      await axios.post('http://localhost:5000/api/users/friend-request/accept', {
        userId: currentUser?._id,
        requestId: profile?._id
      });
      
      toast({ title: "Friend Added", description: `You are now friends with ${profile?.name}` });
      fetchUserProfile();
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to accept request", variant: "destructive" });
    }
  };

  const handleRejectRequest = async () => {
    try {
      await axios.post('http://localhost:5000/api/users/friend-request/reject', {
        userId: currentUser?._id,
        requestId: profile?._id
      });
      
      toast({ title: "Request Declined", description: `Friend request from ${profile?.name} declined` });
      fetchUserProfile();
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to decline request", variant: "destructive" });
    }
  };

  const handleCancelRequest = async () => {
    try {
      await axios.post('http://localhost:5000/api/users/friend-request/cancel', {
        userId: currentUser?._id,
        requestId: profile?._id
      });
      
      toast({ title: "Request Cancelled", description: `Friend request to ${profile?.name} cancelled` });
      fetchUserProfile();
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to cancel request", variant: "destructive" });
    }
  };

  const handleRemoveFriend = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/users/friend/${currentUser?._id}/${profile?._id}`);
      
      toast({ title: "Friend Removed", description: `${profile?.name} removed from friends` });
      fetchUserProfile();
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to remove friend", variant: "destructive" });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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
      <div className="min-h-screen bg-background text-foreground">
        <DashboardHeader />
        <main className="container-narrow py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading profile...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <DashboardHeader />
        <main className="container-narrow py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">User not found</p>
            <Button onClick={() => navigate("/dashboard")} className="mt-4">
              Back to Dashboard
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader />
      <main className="container-narrow py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <Avatar className="w-24 h-24 border-4 border-primary/30">
                  <AvatarImage src={profile.profilePicture} />
                  <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                    {getInitials(profile.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-serif">{profile.name}</h2>
                    <span className="text-sm text-muted-foreground">@{profile.username}</span>
                    {profile.isOwner && (
                      <Badge variant="default" className="bg-primary">
                        <User className="w-3 h-3 mr-1" />
                        You
                      </Badge>
                    )}
                    {profile.isFriend && !profile.isOwner && (
                      <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                        <UserCheck className="w-3 h-3 mr-1" />
                        Friend
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-2">{profile.bio || "No bio yet"}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {profile.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Joined {format(new Date(profile.createdAt), "MMM d, yyyy")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {profile.friendsCount} friends
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Friend Request Button Section */}
          {!profile.isOwner && (
            <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
              <CardContent className="pt-4 pb-4">
                {profile.isFriend ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-muted-foreground">You are friends with {profile.name}</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleRemoveFriend} className="text-red-400 hover:text-red-500">
                      <UserMinus className="w-4 h-4 mr-1" /> Remove Friend
                    </Button>
                  </div>
                ) : profile.friendRequestStatus === 'pending_from_me' ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-yellow-500" />
                      <span className="text-sm text-muted-foreground">Friend request sent to {profile.name}</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleCancelRequest}>
                      Cancel Request
                    </Button>
                  </div>
                ) : profile.friendRequestStatus === 'pending_from_them' ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-primary" />
                      <span className="text-sm text-muted-foreground">{profile.name} sent you a friend request</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="hero" onClick={handleAcceptRequest}>
                        <Check className="w-4 h-4 mr-1" /> Accept
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleRejectRequest}>
                        <X className="w-4 h-4 mr-1" /> Decline
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button variant="hero" className="w-full" onClick={handleSendFriendRequest}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Friend
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-card/50 border-border/30">
              <CardContent className="pt-6 text-center">
                <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary">📦</span>
                </div>
                <p className="text-2xl font-bold">{profile.totalCapsules}</p>
                <p className="text-sm text-muted-foreground">Total Capsules</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/30">
              <CardContent className="pt-6 text-center">
                <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-yellow-500" />
                </div>
                <p className="text-2xl font-bold">{profile.upcomingCapsules}</p>
                <p className="text-sm text-muted-foreground">Locked</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/30">
              <CardContent className="pt-6 text-center">
                <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Unlock className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-2xl font-bold">{profile.unlockedCapsules}</p>
                <p className="text-sm text-muted-foreground">Unlocked</p>
              </CardContent>
            </Card>
          </div>

          {/* Public Capsules Section - Shows both locked and unlocked */}
          <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-serif flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Public Capsules
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Capsules {profile.isOwner ? "you've" : `${profile.name} has`} shared with the community
              </p>
            </CardHeader>
            <CardContent>
              {publicCapsules.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Globe className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No public capsules yet</p>
                  {profile.isOwner && (
                    <p className="text-sm mt-1">Create a capsule and set visibility to "Public" to share with the community</p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {publicCapsules.map((capsule) => {
                    const isUnlocked = getCapsuleStatus(capsule.unlockDate) === "unlocked";
                    const unlockDate = new Date(capsule.unlockDate);
                    const progress = getTimeProgress(capsule.createdAt, capsule.unlockDate);
                    const countdown = getCountdown(unlockDate.getTime() - time);
                    
                    return (
                      <div
                        key={capsule._id}
                        onClick={() => {
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
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="font-medium">{capsule.title}</h3>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Globe className="w-3 h-3" />
                                <span>Public</span>
                              </div>
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
                            {isUnlocked && (
                              <p className="text-sm text-muted-foreground line-clamp-2">{capsule.message}</p>
                            )}
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>Created: {format(new Date(capsule.createdAt), "MMM d, yyyy")}</span>
                              <span>
                                {isUnlocked 
                                  ? `Unlocked on ${format(unlockDate, "MMM d, yyyy")}`
                                  : `Unlocks on ${format(unlockDate, "MMM d, yyyy")}`
                                }
                              </span>
                            </div>
                            {!isUnlocked && (
                              <p className="text-xs text-primary mt-1">{countdown}</p>
                            )}
                          </div>
                        </div>
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
        </div>
      </main>
      <Footer />

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

export default UserProfile;