import { useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import SignInDialog from "@/components/auth/SignInDialog";
import SignUpDialog from "@/components/auth/SignUpDialog";
import ThemeToggle from "@/components/ThemeToggle";

const Navbar = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleSwitchToSignUp = () => {
    setShowSignIn(false);
    setShowSignUp(true);
  };

  const handleSwitchToSignIn = () => {
    setShowSignUp(false);
    setShowSignIn(true);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
      <div className="container-narrow">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/30 transition-shadow duration-300">
              <Clock className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-serif font-medium">Time Capsule</span>
          </a>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="/#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              How It Works
            </a>
            <a
              href="/about"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              About Us
            </a>
            <a
              href="/faq"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              FAQ
            </a>
          </div>

          {/* Auth Buttons & Theme Toggle */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => setShowSignIn(true)}>
              Sign In
            </Button>
            <Button variant="hero" size="sm" onClick={() => setShowSignUp(true)}>
              Get Started
            </Button>
          </div>
        </nav>
      </div>

      {/* Auth Dialogs */}
      <SignInDialog
        open={showSignIn}
        onOpenChange={setShowSignIn}
        onSwitchToSignUp={handleSwitchToSignUp}
      />
      <SignUpDialog
        open={showSignUp}
        onOpenChange={setShowSignUp}
        onSwitchToSignIn={handleSwitchToSignIn}
      />
    </header>
  );
};

export default Navbar;
