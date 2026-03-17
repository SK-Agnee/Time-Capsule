import { useState } from "react";
import { Clock, Timer, Hourglass } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { Button } from "@/components/ui/button";
import SignInDialog from "@/components/auth/SignInDialog";
import SignUpDialog from "@/components/auth/SignUpDialog";

const Hero = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleScrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Time Capsule"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      {/* Floating Clock Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[10%] animate-float opacity-20">
          <Clock className="w-16 h-16 text-primary" style={{ animationDelay: "0s" }} />
        </div>
        <div className="absolute top-40 right-[15%] animate-float opacity-15" style={{ animationDelay: "2s" }}>
          <Timer className="w-12 h-12 text-secondary" />
        </div>
        <div className="absolute bottom-40 left-[20%] animate-float opacity-10" style={{ animationDelay: "4s" }}>
          <Hourglass className="w-20 h-20 text-accent" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container-narrow text-center">
        <div className="space-y-8 animate-fade-in-up">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground font-sans">Preserving moments across time</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-tight">
            Write today.
            <br />
            <span className="text-gradient">Open tomorrow.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            Create messages, photos, and memories sealed in time. 
            Watch them unlock in the future—days, months, or years from now.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button variant="hero" size="xl">
              Create Your First Capsule
            </Button>
            <Button variant="heroOutline" size="lg">
              See How It Works
            </Button>
          </div>

          {/* Trust Indicator */}
          <p className="text-sm text-muted-foreground/60 pt-8">
            Join 12,000+ people preserving memories for the future
          </p>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
