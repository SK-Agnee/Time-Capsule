import { Clock, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";

const DashboardHeader = () => {
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
              <AvatarFallback className="bg-primary/20 text-primary text-sm">AC</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" className="ml-2">
              Logout
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default DashboardHeader;
