import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Calendar, Edit2, Save, X, Users, Unlock, Lock, Globe, Eye, MessageCircle, Heart, Share2 } from "lucide-react";
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
  createdAt: string;
  visibleCapsules: Capsule[];
}

const ProfileDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [time, setTime] = useState(Date.now());
  
  // Modal states
  const [selectedCapsule, setSelectedCapsule] = useState<Capsule | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchProfile();
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
    } finally {
      setIsLoading(false);
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

  const getVisibilityIcon = (visibility?: string) => {
    switch (visibility) {
      case 'public': return <Globe className="w-3 h-3" />;
      default: return <Lock className="w-3 h-3" />;
    }
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

  const publicCapsules = profile.visibleCapsules.filter(c => c.visibility === 'public');

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

      {/* Public Capsules Section */}
      <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-serif flex items-center gap-2"><Globe className="w-5 h-5 text-primary" />Public Capsules</CardTitle>
          <p className="text-sm text-muted-foreground">Capsules shared with the community</p>
        </CardHeader>
        <CardContent>
          {publicCapsules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Globe className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No public capsules yet</p>
              {profile.isOwner && <p className="text-sm mt-1">Create a capsule and set visibility to "Public" to share with the community</p>}
            </div>
          ) : (
            <div className="space-y-4">
              {publicCapsules.map((capsule) => {
                const status = getCapsuleStatus(capsule.unlockDate);
                const isUnlocked = status === "unlocked";
                const unlockDate = new Date(capsule.unlockDate);
                
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
                        : "border-border/30 opacity-70 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-medium">{capsule.title}</h3>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            {getVisibilityIcon(capsule.visibility)}
                            <span className="capitalize">{capsule.visibility}</span>
                          </div>
                          {isUnlocked ? (
                            <Badge variant="default" className="bg-green-500/20 text-green-500">
                              <Unlock className="w-3 h-3 mr-1" />Unlocked
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <Lock className="w-3 h-3 mr-1" />Locked until {format(unlockDate, "MMM d, yyyy")}
                            </Badge>
                          )}
                        </div>
                        {isUnlocked && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{capsule.message}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Created: {format(new Date(capsule.createdAt), "MMM d, yyyy")}</span>
                          {isUnlocked && <span>Unlocked on {format(unlockDate, "MMM d, yyyy")}</span>}
                        </div>
                      </div>
                      {isUnlocked && (
                        <Button size="sm" variant="ghost" className="text-primary">
                          <Eye className="w-4 h-4 mr-1" />View
                        </Button>
                      )}
                    </div>
                    {!isUnlocked && (
                      <div className="mt-2">
                        <Progress value={0} className="h-1" />
                        <p className="text-xs text-muted-foreground mt-1">
                          🔒 Locked - becomes available on {format(unlockDate, "MMM d, yyyy")}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Modal - Same as MyCapsules */}
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
                  {/* Message */}
                  <div className="whitespace-pre-wrap">
                    <p className="font-medium mb-2">Message:</p>
                    <p className="text-muted-foreground">{selectedCapsule.message}</p>
                  </div>

                  {/* Image */}
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

                  {/* Video */}
                  {selectedCapsule.video && (
                    <div>
                      <p className="font-medium mb-2">Video:</p>
                      <video controls className="rounded-lg max-h-60 w-full">
                        <source src={`http://localhost:5000/${selectedCapsule.video}`} type="video/mp4" />
                      </video>
                    </div>
                  )}

                  {/* Audio */}
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

export default ProfileDashboard;