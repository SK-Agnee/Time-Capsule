import { useEffect, useState } from "react";
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

interface UserData {
  name: string;
  email: string;
}

const DashboardHeader = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const currentUser = localStorage.getItem("capsule_current_user");
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("capsule_current_user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
      <div className="container-narrow">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/30 transition-shadow duration-300">
              <Clock className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-serif font-medium">Time Capsule</span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Notifications */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <div className="p-3 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">Notifications</h4>
                    <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">4 new</span>
                  </div>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {[
                    { icon: Gift, title: "Capsule Ready to Open!", desc: "Your 'Summer Memories 2024' capsule is now unlocked.", time: "2 min ago", unread: true },
                    { icon: Users, title: "New Friend Request", desc: "Alex Johnson wants to connect with you.", time: "1 hour ago", unread: true },
                    { icon: Lock, title: "Capsule Sealed", desc: "'Birthday Wishes' has been sealed until Dec 2025.", time: "3 hours ago", unread: true },
                    { icon: Sparkles, title: "Memory Milestone!", desc: "You've created 10 capsules. Keep preserving memories!", time: "1 day ago", unread: true },
                    { icon: Users, title: "Shared Capsule Update", desc: "Maya added a photo to 'Family Reunion 2024'.", time: "2 days ago", unread: false },
                    { icon: Gift, title: "Capsule Opened", desc: "You opened 'New Year Resolutions'. How did you do?", time: "5 days ago", unread: false },
                  ].map((n, i) => (
                    <div key={i} className={`flex gap-3 p-3 hover:bg-muted/50 cursor-pointer transition-colors border-b border-border/50 last:border-0 ${n.unread ? "bg-primary/5" : ""}`}>
                      <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${n.unread ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                        <n.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-tight">{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.desc}</p>
                        <p className="text-xs text-muted-foreground/70 mt-1">{n.time}</p>
                      </div>
                      {n.unread && <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />}
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-border">
                  <Button variant="ghost" size="sm" className="w-full text-xs text-primary">View all notifications</Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Settings Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-popover">
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Shield className="w-4 h-4 mr-2" />
                  Privacy
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Help & Support
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Avatar & User Dropdown */}
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
