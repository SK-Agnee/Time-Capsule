import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Calendar, Edit2, Save, X, Users, Unlock, Lock, Globe, Eye, UserPlus, UserCheck, UserMinus, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { format } from "date-fns";

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

interface UserProfile {
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
  isOwner: boolean;
  isFriend?: boolean;
  friendRequestStatus?: string | null;
  createdAt: string;
}

const ProfileDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [publicCapsules, setPublicCapsules] = useState<Capsule[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [time, setTime] = useState(Date.now());
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  
  // Modal states
  const [selectedCapsule, setSelectedCapsule] = useState<Capsule | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchProfile();
    fetchPublicCapsules();
    fetchPendingRequests();
  }, []);

  const fetchProfile = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("capsule_current_user") || "{}");
      if (!user?._id) {
        navigate("/");
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/users/profile/${user._id}`, {
        headers: { 'user-id': user._id }
      });
      setProfile(response.data);
      setEditName(response.data.name);
      setEditBio(response.data.bio || "");
    } catch (err) {
      console.error("Error fetching profile:", err);
      toast({ title: "Error", description: "Failed to load profile", variant: "destructive" });
    }
  };

  const fetchPublicCapsules = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("capsule_current_user") || "{}");
      if (!user?._id) return;
      
      // Fetch all capsules from the user
      const response = await axios.get(`http://localhost:5000/api/capsules/${user._id}`);
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

  const fetchPendingRequests = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("capsule_current_user") || "{}");
      if (!user?._id) return;
      
      const response = await axios.get(`http://localhost:5000/api/users/friend-requests/${user._id}`);
      setPendingRequests(response.data);
    } catch (err) {
      console.error("Error fetching friend requests:", err);
    }
  };

  const handleUpdateProfile = async () => {
    if (!editName.trim()) {
      toast({ title: "Error", description: "Name cannot be empty", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      const user = JSON.parse(localStorage.getItem("capsule_current_user") || "{}");
      const response = await axios.put(`http://localhost:5000/api/users/profile/${user._id}`, {
        name: editName,
        bio: editBio,
      });

      const updatedUser = { ...user, name: editName };
      localStorage.setItem("capsule_current_user", JSON.stringify(updatedUser));

      setProfile(prev => prev ? { ...prev, name: editName, bio: editBio } : null);
      setIsEditing(false);
      
      window.dispatchEvent(new CustomEvent('userUpdated', { detail: { user: updatedUser } }));
      
      toast({ title: "Success", description: "Profile updated successfully" });
    } catch (err) {
      console.error("Error updating profile:", err);
      toast({ title: "Error", description: "Failed to update profile", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const user = JSON.parse(localStorage.getItem("capsule_current_user") || "{}");
      await axios.post(`http://localhost:5000/api/users/friend-request/accept`, {
        userId: user._id,
        requestId
      });
      
      toast({ title: "Friend Added", description: "You are now friends!" });
      fetchPendingRequests();
      fetchProfile();
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to accept request", variant: "destructive" });
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      const user = JSON.parse(localStorage.getItem("capsule_current_user") || "{}");
      await axios.post(`http://localhost:5000/api/users/friend-request/reject`, {
        userId: user._id,
        requestId
      });
      
      toast({ title: "Request Declined", description: "Friend request declined" });
      fetchPendingRequests();
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to decline request", variant: "destructive" });
    }
  };

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Profile not found</p>
        <Button onClick={() => navigate("/dashboard")} className="mt-4">Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Avatar className="w-24 h-24 border-4 border-primary/30">
              <AvatarImage src={profile.profilePicture} />
              <AvatarFallback className="bg-primary/20 text-primary text-2xl">{getInitials(profile.name)}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="edit-name" className="text-sm text-muted-foreground">Full Name</Label>
                    <Input id="edit-name" value={editName} onChange={(e) => setEditName(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="edit-bio" className="text-sm text-muted-foreground">Bio</Label>
                    <Textarea id="edit-bio" value={editBio} onChange={(e) => setEditBio(e.target.value)} placeholder="Tell us about yourself..." className="mt-1 min-h-[80px]" />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleUpdateProfile} disabled={isSaving}><Save className="w-4 h-4 mr-2" />{isSaving ? "Saving..." : "Save Changes"}</Button>
                    <Button variant="outline" onClick={() => { setIsEditing(false); setEditName(profile.name); setEditBio(profile.bio || ""); }}><X className="w-4 h-4 mr-2" />Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-serif text-foreground">{profile.name}</h2>
                    <span className="text-sm text-muted-foreground">@{profile.username}</span>
                    {profile.isOwner && (
                      <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="text-muted-foreground hover:text-primary"><Edit2 className="w-4 h-4 mr-1" />Edit</Button>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-2">{profile.bio || "No bio yet."}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{profile.email}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Joined {formatDate(profile.createdAt)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/30"><CardContent className="pt-6 text-center"><User className="w-8 h-8 mx-auto mb-2 text-primary" /><p className="text-2xl font-bold">{profile.totalCapsules}</p><p className="text-sm text-muted-foreground">Total Capsules</p></CardContent></Card>
        <Card className="bg-card/50 border-border/30"><CardContent className="pt-6 text-center"><Users className="w-8 h-8 mx-auto mb-2 text-primary" /><p className="text-2xl font-bold">{profile.friendsCount}</p><p className="text-sm text-muted-foreground">Friends</p></CardContent></Card>
        <Card className="bg-card/50 border-border/30"><CardContent className="pt-6 text-center"><Lock className="w-8 h-8 mx-auto mb-2 text-yellow-500" /><p className="text-2xl font-bold">{profile.upcomingCapsules}</p><p className="text-sm text-muted-foreground">Locked</p></CardContent></Card>
        <Card className="bg-card/50 border-border/30"><CardContent className="pt-6 text-center"><Unlock className="w-8 h-8 mx-auto mb-2 text-green-500" /><p className="text-2xl font-bold">{profile.unlockedCapsules}</p><p className="text-sm text-muted-foreground">Unlocked</p></CardContent></Card>
      </div>

      {/* Friend Requests Section */}
      {pendingRequests.length > 0 && (
        <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-serif flex items-center gap-2"><Bell className="w-5 h-5 text-primary" />Friend Requests</CardTitle>
            <Badge variant="secondary">{pendingRequests.length} pending</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <div key={request._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={request.from.profilePicture} />
                      <AvatarFallback>{getInitials(request.from.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{request.from.name}</p>
                      <p className="text-xs text-muted-foreground">@{request.from.username}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="hero" onClick={() => handleAcceptRequest(request.from._id)}>Accept</Button>
                    <Button size="sm" variant="outline" onClick={() => handleRejectRequest(request.from._id)}>Decline</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Public Capsules Section - Shows both locked and unlocked */}
      <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-serif flex items-center gap-2"><Globe className="w-5 h-5 text-primary" />Public Capsules</CardTitle>
          <p className="text-sm text-muted-foreground">Capsules you've shared with the community</p>
        </CardHeader>
        <CardContent>
          {publicCapsules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Globe className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No public capsules yet</p>
              <p className="text-sm mt-1">Create a capsule and set visibility to "Public" to share with the community</p>
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

      {/* View Modal */}
      {selectedCapsule && showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-card p-6 rounded-xl max-w-md w-full relative transform transition-all duration-300 scale-100 opacity-100 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-2 right-3 text-lg hover:text-red-400 transition-colors" onClick={() => { setShowModal(false); setTimeout(() => setSelectedCapsule(null), 200); }}>✖</button>
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
                  <p className="text-xs text-muted-foreground mt-2">Check back on {new Date(selectedCapsule.unlockDate).toLocaleDateString()}</p>
                </div>
              ) : (
                <>
                  <div className="whitespace-pre-wrap"><p className="font-medium mb-2">Message:</p><p className="text-muted-foreground">{selectedCapsule.message}</p></div>
                  {selectedCapsule.image && (<div><p className="font-medium mb-2">Image:</p><img src={`http://localhost:5000/${selectedCapsule.image}`} alt="capsule" className="rounded-lg max-h-60 w-full object-cover" /></div>)}
                  {selectedCapsule.video && (<div><p className="font-medium mb-2">Video:</p><video controls className="rounded-lg max-h-60 w-full"><source src={`http://localhost:5000/${selectedCapsule.video}`} type="video/mp4" /></video></div>)}
                  {selectedCapsule.audio && (<div><p className="font-medium mb-2">Audio:</p><audio controls className="w-full"><source src={`http://localhost:5000/${selectedCapsule.audio}`} type="audio/mpeg" /></audio></div>)}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDashboard;