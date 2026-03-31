import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Calendar, Edit2, Save, X, Users, Unlock, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

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
  createdAt: string;
}

const ProfileDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!editName.trim()) {
      toast({
        title: "Error",
        description: "Name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const user = JSON.parse(localStorage.getItem("capsule_current_user") || "{}");
      const response = await axios.put(`http://localhost:5000/api/users/profile/${user._id}`, {
        name: editName,
        bio: editBio,
      });

      // Update local storage
      const updatedUser = { ...user, name: editName };
      localStorage.setItem("capsule_current_user", JSON.stringify(updatedUser));

      setProfile(prev => prev ? { ...prev, name: editName, bio: editBio } : null);
      setIsEditing(false);
      
      // Dispatch event to update dashboard header
      window.dispatchEvent(new CustomEvent('userUpdated', { 
        detail: { user: updatedUser } 
      }));
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (err) {
      console.error("Error updating profile:", err);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
        <Button onClick={() => navigate("/dashboard")} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Avatar Section */}
            <Avatar className="w-24 h-24 border-4 border-primary/30">
              <AvatarImage src={profile.profilePicture} />
              <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                {getInitials(profile.name)}
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="edit-name" className="text-sm text-muted-foreground">
                      Full Name
                    </Label>
                    <Input
                      id="edit-name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-bio" className="text-sm text-muted-foreground">
                      Bio
                    </Label>
                    <Textarea
                      id="edit-bio"
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      placeholder="Tell us about yourself..."
                      className="mt-1 min-h-[80px]"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleUpdateProfile} disabled={isSaving}>
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setIsEditing(false);
                      setEditName(profile.name);
                      setEditBio(profile.bio || "");
                    }}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-serif text-foreground">{profile.name}</h2>
                    <span className="text-sm text-muted-foreground">@{profile.username}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                  <p className="text-muted-foreground mt-2">
                    {profile.bio || "No bio yet. Click edit to add one!"}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {profile.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Joined {formatDate(profile.createdAt)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/30">
          <CardContent className="pt-6 text-center">
            <User className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold text-foreground">{profile.totalCapsules}</p>
            <p className="text-sm text-muted-foreground">Total Capsules</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/30">
          <CardContent className="pt-6 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold text-foreground">{profile.friendsCount}</p>
            <p className="text-sm text-muted-foreground">Friends</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/30">
          <CardContent className="pt-6 text-center">
            <Lock className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <p className="text-2xl font-bold text-foreground">{profile.upcomingCapsules}</p>
            <p className="text-sm text-muted-foreground">Locked Capsules</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/30">
          <CardContent className="pt-6 text-center">
            <Unlock className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold text-foreground">{profile.unlockedCapsules}</p>
            <p className="text-sm text-muted-foreground">Unlocked Capsules</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileDashboard;