import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Clock, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeToggle from "@/components/ThemeToggle";
import { toast } from "@/hooks/use-toast";

interface User {
  name: string;
  email: string;
}

const DashboardHeader = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

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

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Features
            </Link>
            <Link
              to="/#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              How It Works
            </Link>
            <Link
              to="/dashboard"
              className="text-sm text-foreground font-medium"
            >
              Dashboard
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            <Avatar className="w-9 h-9 border-2 border-primary/30 cursor-pointer hover:border-primary transition-colors">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/20 text-primary text-sm">
                {user ? getInitials(user.name) : "U"}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline text-sm font-medium">
              {user?.name || "User"}
            </span>
            <Button variant="outline" size="sm" className="ml-2" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default DashboardHeader;
