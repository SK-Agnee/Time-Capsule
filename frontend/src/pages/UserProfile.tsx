import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, Lock, Unlock, User, Mail, Calendar, Users, UserPlus, UserCheck, Globe, Shield } from "lucide-react";
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
  createdAt: string;
  visibleCapsules: Capsule[];
}

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [time, setTime] = useState(Date.now());

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
    } finally {
      setIsLoading(false);
    }
  };

  const addFriend = async () => {
    if (!profile) return;
    try {
      await axios.post("http://localhost:5000/api/users/friend-request", {
        fromUserId: currentUser?._id,
        toUserId: profile._id
      });
      
      setProfile({ ...profile, isFriend: true });
      toast({
        title: "Success",
        description: `You are now friends with ${profile.name}`,
      });
    } catch (err) {
      console.error("Error adding friend:", err);
      toast({
        title: "Error",
        description: "Failed to add friend",
        variant: "destructive",
      });
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

  const getVisibilityIcon = (visibility?: string) => {
    switch (visibility) {
      case 'public':
        return <Globe className="w-3 h-3" />;
      case 'friends':
        return <Users className="w-3 h-3" />;
      default:
        return <Lock className="w-3 h-3" />;
    }
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
                    {profile.isFriend && (
                      <Badge variant="secondary">
                        <UserCheck className="w-3 h-3 mr-1" />
                        Friend
                      </Badge>
                    )}
                    {profile.isOwner && (
                      <Badge variant="default" className="bg-primary">
                        <User className="w-3 h-3 mr-1" />
                        You
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

                {!profile.isOwner && !profile.isFriend && (
                  <Button onClick={addFriend}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Friend
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

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

          {/* Visible Capsules */}
          <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-serif flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Visible Capsules
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {profile.isOwner 
                  ? "All your capsules are visible to you" 
                  : profile.isFriend 
                    ? "Public and friends-only capsules are visible to you" 
                    : "Only public capsules are visible to you"}
              </p>
            </CardHeader>
            <CardContent>
              {profile.visibleCapsules.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No visible capsules found</p>
                  <p className="text-sm mt-1">
                    {!profile.isOwner && !profile.isFriend && "This user hasn't shared any public capsules yet"}
                    {!profile.isOwner && profile.isFriend && "This user hasn't shared any capsules with friends yet"}
                    {profile.isOwner && "Create your first capsule to get started!"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {profile.visibleCapsules.map((capsule) => {
                    const status = getCapsuleStatus(capsule.unlockDate);
                    const isUnlocked = status === "unlocked";
                    const unlockDate = new Date(capsule.unlockDate);
                    
                    return (
                      <div
                        key={capsule._id}
                        className="p-4 rounded-lg border border-border/30 hover:border-primary/50 transition-all cursor-pointer"
                        onClick={() => {
                          if (isUnlocked) {
                            window.dispatchEvent(new CustomEvent("openCapsule", { 
                              detail: { capsuleId: capsule._id } 
                            }));
                            navigate("/dashboard");
                          }
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="font-medium">{capsule.title}</h3>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                {getVisibilityIcon(capsule.visibility)}
                                <span className="capitalize">{capsule.visibility || 'private'}</span>
                              </div>
                              {isUnlocked ? (
                                <Badge variant="default" className="bg-green-500/20 text-green-500">
                                  <Unlock className="w-3 h-3 mr-1" />
                                  Unlocked
                                </Badge>
                              ) : (
                                <Badge variant="secondary">
                                  <Lock className="w-3 h-3 mr-1" />
                                  Locked
                                </Badge>
                              )}
                            </div>
                            {isUnlocked && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {capsule.message}
                              </p>
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
                          </div>
                        </div>
                        {!isUnlocked && (
                          <div className="mt-2">
                            <Progress value={0} className="h-1" />
                            <p className="text-xs text-muted-foreground mt-1">
                              🔒 Locked until {format(unlockDate, "MMM d, yyyy")}
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;