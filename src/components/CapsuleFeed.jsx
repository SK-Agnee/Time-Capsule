import { Lock, Clock, Sparkles, Image, MessageCircle, Heart } from "lucide-react";

const CapsuleCard = ({ type, title, date, countdown, preview, imageUrl }) => {
  const typeStyles = {
    locked: "capsule-locked border-border/30",
    unlocking: "capsule-unlocking border-primary/40 animate-pulse-glow",
    opened: "capsule-opened border-secondary/40",
  };

  const iconStyles = {
    locked: "text-muted-foreground",
    unlocking: "text-primary",
    opened: "text-secondary",
  };

  return (
    <div
      className={`relative rounded-2xl border p-6 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] ${typeStyles[type]}`}
    >
      {/* Glow Effect for Unlocking */}
      {type === "unlocking" && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent animate-pulse" />
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {type === "locked" && <Lock className={`w-5 h-5 ${iconStyles[type]}`} />}
            {type === "unlocking" && <Clock className={`w-5 h-5 ${iconStyles[type]}`} />}
            {type === "opened" && <Sparkles className={`w-5 h-5 ${iconStyles[type]}`} />}
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-sans">
              {type === "locked" && "Locked"}
              {type === "unlocking" && "Unlocking Soon"}
              {type === "opened" && "Opened"}
            </span>
          </div>
          {countdown && (
            <span className="text-sm font-mono text-primary">{countdown}</span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-serif mb-2">{title}</h3>

        {/* Date */}
        <p className="text-sm text-muted-foreground mb-4">
          {type === "opened" ? "Opened on" : "Opens on"} {date}
        </p>

        {/* Preview for opened capsules */}
        {type === "opened" && preview && (
          <p className="text-foreground/80 leading-relaxed line-clamp-3 mb-4">
            {preview}
          </p>
        )}

        {/* Image preview */}
        {imageUrl && (
          <div className="rounded-lg overflow-hidden mb-4 border border-border/30">
            <img src={imageUrl} alt="" className="w-full h-32 object-cover opacity-80" />
          </div>
        )}

        {/* Content Type Indicators */}
        <div className="flex items-center gap-4 pt-4 border-t border-border/30">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs">Message</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Image className="w-4 h-4" />
            <span className="text-xs">3 Photos</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground ml-auto">
            <Heart className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

const capsules = [
  {
    type: "locked",
    title: "Letter to Future Me",
    date: "January 1, 2026",
    countdown: "342 days",
  },
  {
    type: "locked",
    title: "Wedding Anniversary Surprise",
    date: "June 15, 2025",
    countdown: "142 days",
  },
  {
    type: "unlocking",
    title: "Birthday Wishes from Friends",
    date: "February 3, 2025",
    countdown: "9 days",
  },
  {
    type: "unlocking",
    title: "New Year Reflections",
    date: "January 31, 2025",
    countdown: "6 days",
  },
  {
    type: "opened",
    title: "Graduation Day Memories",
    date: "December 15, 2024",
    preview: "I can't believe I actually made it through four years. To whoever is reading this—future me—I hope you remember the late nights, the friendships, and...",
  },
  {
    type: "opened",
    title: "First Day at the New Job",
    date: "November 20, 2024",
    preview: "Nervous but excited. The office smells like fresh coffee and new beginnings. I wonder if I'll still be here when this opens...",
  },
];

const CapsuleFeed = () => {
  return (
    <section className="section-padding relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <div className="container-narrow relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif">
            Your <span className="text-gradient">Timeline</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Capsules waiting to be discovered, memories ready to unfold
          </p>
        </div>

        {/* Capsule Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capsules.map((capsule, index) => (
            <CapsuleCard key={index} {...capsule} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CapsuleFeed;
