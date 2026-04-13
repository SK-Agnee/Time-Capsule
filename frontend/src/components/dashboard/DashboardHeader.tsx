import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Clock, Bell, Settings, LogOut, User, Shield, HelpCircle, ChevronDown, Gift, Users, Lock, Sparkles } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "@/components/ThemeToggle";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { format } from "date-fns";

interface UserData {
  name: string;
  email: string;
  _id: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  capsuleId: string;
  timestamp: Date;
  read: boolean;
  type: "capsule_unlocked" | "capsule_sealed" | "milestone" | "shared" | "friend_request";
}

const DashboardHeader = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasUnread, setHasUnread] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastCheckRef = useRef<number>(Date.now());

  useEffect(() => {
    const currentUser = localStorage.getItem("capsule_current_user");
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  const checkForNewlyUnlockedCapsules = async () => {
    if (!user?._id) return false;

    try {
      const response = await axios.get(`http://localhost:5000/api/capsules/${user._id}`);
      const capsules = response.data;
      const now = Date.now();

      const storedUnlockedIds = JSON.parse(localStorage.getItem(`unlocked_notified_${user._id}`) || "[]");
      
      const newlyUnlocked = capsules.filter(c => {
        const isUnlocked = new Date(c.unlockDate).getTime() <= now;
        const notNotified = !storedUnlockedIds.includes(c._id);
        return isUnlocked && notNotified && !c.viewed;
      });

      if (newlyUnlocked.length > 0) {
        const storedNotifications = localStorage.getItem(`notifications_${user._id}`);
        const existingNotifications = storedNotifications ? JSON.parse(storedNotifications) : [];
        
        const newNotifications: Notification[] = newlyUnlocked.map(capsule => ({
          id: Date.now().toString() + Math.random() + capsule._id,
          title: "🎉 Capsule Unlocked!",
          message: `"${capsule.title}" is now ready to open`,
          capsuleId: capsule._id,
          timestamp: new Date(),
          read: false,
          type: "capsule_unlocked"
        }));

        const updatedNotifications = [...newNotifications, ...existingNotifications];
        setNotifications(updatedNotifications);
        setHasUnread(true);
        
        localStorage.setItem(`notifications_${user._id}`, JSON.stringify(updatedNotifications));
        
        const newUnlockedIds = [...storedUnlockedIds, ...newlyUnlocked.map(c => c._id)];
        localStorage.setItem(`unlocked_notified_${user._id}`, JSON.stringify(newUnlockedIds));
        
        newNotifications.forEach(notification => {
          toast({
            title: notification.title,
            description: notification.message,
            duration: 5000,
          });
        });

        window.dispatchEvent(new CustomEvent("newNotifications", { 
          detail: { count: newNotifications.length } 
        }));
        
        return true;
      }
    } catch (err) {
      console.error("Error checking for unlocked capsules:", err);
    }
    return false;
  };

  const checkForFriendRequests = async () => {
    if (!user?._id) return false;

    try {
      const response = await axios.get(`http://localhost:5000/api/users/friend-requests/${user._id}`);
      const pendingRequests = response.data;
      
      const storedRequestIds = JSON.parse(localStorage.getItem(`friend_requests_notified_${user._id}`) || "[]");
      
      const newRequests = pendingRequests.filter((req: any) => 
        !storedRequestIds.includes(req._id)
      );
      
      if (newRequests.length > 0) {
        const storedNotifications = localStorage.getItem(`notifications_${user._id}`);
        const existingNotifications = storedNotifications ? JSON.parse(storedNotifications) : [];
        
        const newNotifications: Notification[] = newRequests.map((req: any) => ({
          id: `friend_${req._id}_${Date.now()}`,
          title: "👥 Friend Request!",
          message: `${req.from.name} (@${req.from.username}) sent you a friend request`,
          capsuleId: "",
          timestamp: new Date(),
          read: false,
          type: "friend_request"
        }));
        
        const updatedNotifications = [...newNotifications, ...existingNotifications];
        setNotifications(updatedNotifications);
        setHasUnread(true);
        
        localStorage.setItem(`notifications_${user._id}`, JSON.stringify(updatedNotifications));
        
        const newRequestIds = [...storedRequestIds, ...newRequests.map((req: any) => req._id)];
        localStorage.setItem(`friend_requests_notified_${user._id}`, JSON.stringify(newRequestIds));
        
        newNotifications.forEach(notification => {
          toast({
            title: notification.title,
            description: notification.message,
            duration: 5000,
          });
        });
        
        window.dispatchEvent(new CustomEvent("newNotifications", { 
          detail: { count: newNotifications.length } 
        }));
        
        return true;
      }
    } catch (err) {
      console.error("Error checking friend requests:", err);
    }
    return false;
  };

  const fetchNotifications = async () => {
    if (!user?._id) return;

    try {
      const storedNotifications = localStorage.getItem(`notifications_${user._id}`);
      if (storedNotifications) {
        const parsed = JSON.parse(storedNotifications);
        setNotifications(parsed);
        setHasUnread(parsed.some((n: Notification) => !n.read));
      }

      await checkForNewlyUnlockedCapsules();
      await checkForFriendRequests();
      lastCheckRef.current = Date.now();
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  // Set up real-time checking
  useEffect(() => {
    if (user?._id) {
      fetchNotifications();
      
      intervalRef.current = setInterval(fetchNotifications, 10000);
      
      const handleCapsuleCreated = () => {
        setTimeout(() => fetchNotifications(), 500);
      };
      
      const handleCapsuleUnlocked = () => {
        setTimeout(() => fetchNotifications(), 100);
      };
      
      const handleFocus = () => {
        fetchNotifications();
      };
      
      window.addEventListener("capsuleCreated", handleCapsuleCreated);
      window.addEventListener("capsuleUnlocked", handleCapsuleUnlocked);
      window.addEventListener("focus", handleFocus);
      
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === `unlocked_notified_${user._id}` || e.key === `notifications_${user._id}` || e.key === `friend_requests_notified_${user._id}`) {
          fetchNotifications();
        }
      };
      
      window.addEventListener("storage", handleStorageChange);
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        window.removeEventListener("capsuleCreated", handleCapsuleCreated);
        window.removeEventListener("capsuleUnlocked", handleCapsuleUnlocked);
        window.removeEventListener("focus", handleFocus);
        window.removeEventListener("storage", handleStorageChange);
      };
    }
  }, [user]);

  // Set up a WebSocket-like polling with visibility API
  useEffect(() => {
    if (!user?._id) return;
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchNotifications();
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("capsule_current_user");
    localStorage.removeItem("token");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  const handleNotificationClick = (notification: Notification) => {
    const updatedNotifications = notifications.map(n =>
      n.id === notification.id ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    setHasUnread(updatedNotifications.some(n => !n.read));
    
    if (user?._id) {
      localStorage.setItem(`notifications_${user._id}`, JSON.stringify(updatedNotifications));
    }
    
    setShowNotifications(false);
    
    if (notification.capsuleId) {
      sessionStorage.setItem("open_capsule_id", notification.capsuleId);
      navigate("/dashboard");
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("openCapsule", { detail: { capsuleId: notification.capsuleId } }));
      }, 100);
    } else if (notification.type === "friend_request") {
      navigate("/dashboard?tab=friends-vaults");
    }
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updatedNotifications);
    setHasUnread(false);
    
    if (user?._id) {
      localStorage.setItem(`notifications_${user._id}`, JSON.stringify(updatedNotifications));
    }
    
    toast({
      title: "All notifications marked as read",
      duration: 2000,
    });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setHasUnread(false);
    
    if (user?._id) {
      localStorage.removeItem(`notifications_${user._id}`);
    }
    
    toast({
      title: "All notifications cleared",
      duration: 2000,
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "capsule_unlocked":
        return Gift;
      case "capsule_sealed":
        return Lock;
      case "milestone":
        return Sparkles;
      case "shared":
        return Users;
      case "friend_request":
        return Users;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "capsule_unlocked":
        return "bg-green-500/15 text-green-500";
      case "capsule_sealed":
        return "bg-blue-500/15 text-blue-500";
      case "milestone":
        return "bg-purple-500/15 text-purple-500";
      case "shared":
        return "bg-orange-500/15 text-orange-500";
      case "friend_request":
        return "bg-pink-500/15 text-pink-500";
      default:
        return "bg-primary/15 text-primary";
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

  const handleManualRefresh = () => {
    fetchNotifications();
    toast({
      title: "Checking for updates...",
      duration: 1500,
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
      <div className="container-narrow">
        <nav className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Clock className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-serif font-medium">Time Capsule</span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <Popover open={showNotifications} onOpenChange={setShowNotifications}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative" onClick={handleManualRefresh}>
                  <Bell className="w-5 h-5" />
                  {hasUnread && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-yellow-500 rounded-full animate-pulse shadow-sm" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <div className="p-3 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">Notifications</h4>
                    <div className="flex gap-2">
                      {notifications.length > 0 && (
                        <>
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-primary hover:underline"
                          >
                            Mark all read
                          </button>
                          <button
                            onClick={clearAllNotifications}
                            className="text-xs text-muted-foreground hover:text-red-400 hover:underline"
                          >
                            Clear all
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {hasUnread && (
                    <p className="text-xs text-yellow-500 mt-1">
                      New notifications available
                    </p>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                      <p className="text-sm text-muted-foreground">No notifications yet</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        When capsules unlock or you get friend requests, you'll see them here
                      </p>
                    </div>
                  ) : (
                    notifications.map((notification) => {
                      const Icon = getNotificationIcon(notification.type);
                      return (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`flex gap-3 p-3 hover:bg-muted/50 cursor-pointer transition-colors border-b border-border/50 last:border-0 ${
                            !notification.read ? "bg-primary/5" : ""
                          }`}
                        >
                          <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${getNotificationColor(notification.type)}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium leading-tight">{notification.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notification.message}</p>
                            <p className="text-xs text-muted-foreground/70 mt-1">
                              {format(new Date(notification.timestamp), "MMM d, h:mm a")}
                            </p>
                          </div>
                          {!notification.read && (
                            <span className="w-2 h-2 rounded-full bg-yellow-500 mt-2 shrink-0" />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="p-2 border-t border-border">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-xs text-primary"
                      onClick={() => {
                        setShowNotifications(false);
                        navigate("/dashboard");
                      }}
                    >
                      View all capsules
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-popover">
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="w-4 h-4 mr-2" />
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/privacy")}>
                  <Shield className="w-4 h-4 mr-2" />
                  Privacy
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowNotifications(true)}>
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/help")}>
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Help & Support
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full p-1 hover:bg-accent/50 transition-colors">
                  <Avatar className="w-8 h-8 border-2 border-primary/30">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                      {user ? getInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm font-medium pr-1">
                    {user?.name || "User"}
                  </span>
                  <ChevronDown className="w-3 h-3 hidden sm:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-popover">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{user?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="w-4 h-4 mr-2" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default DashboardHeader;