import { Lock, Clock, Sparkles, Image, MessageCircle, Heart } from "lucide-react";
import { useEffect, useState } from "react";

interface CapsuleCardProps {
  type: "locked" | "unlocking" | "opened";
  title: string;
  date: string;
  countdown?: string;
  preview?: string;
  imageUrl?: string;
}

const CapsuleCard = ({ type, title, date, countdown, preview, imageUrl }: CapsuleCardProps) => {
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
            <img src={imageUrl} alt={title} className="w-full h-32 object-cover opacity-80" />
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

// Dummy capsules data with reliable images
const dummyCapsules = [
  {
    type: "locked",
    title: "Summer Memories 2024",
    date: "December 25, 2024",
    imageUrl: "https://picsum.photos/id/15/400/300", // Beach/landscape
  },
  {
    type: "locked",
    title: "Birthday Wishes",
    date: "January 15, 2025",
    imageUrl: "https://picsum.photos/id/30/400/300", // Birthday/cake
  },
  {
    type: "unlocking",
    title: "Graduation Day",
    date: "March 10, 2025",
    countdown: "2 days left",
    imageUrl: "https://picsum.photos/id/20/400/300", // Graduation/books
  },
  {
    type: "locked",
    title: "Beach Vacation",
    date: "June 1, 2025",
    imageUrl: "https://picsum.photos/id/96/400/300", // Beach/ocean
  },
  {
    type: "opened",
    title: "First Date Night",
    date: "September 10, 2024",
    preview: "That was such an amazing evening! The restaurant had the most beautiful view of the city, and we talked for hours about everything and nothing. Can't wait to do it again! 💕",
    imageUrl: "https://picsum.photos/id/22/400/300", // Romantic/city
  },
  {
    type: "unlocking",
    title: "New Year's Eve",
    date: "January 1, 2025",
    countdown: "5 days left",
    imageUrl: "https://picsum.photos/id/39/400/300", // Fireworks/celebration
  },
];

// Placeholder colored backgrounds for when images fail to load
const getFallbackColor = (title: string) => {
  const colors = {
    "Birthday Wishes": "from-pink-500/20 to-rose-500/20",
    "Graduation Day": "from-blue-500/20 to-indigo-500/20",
    "Beach Vacation": "from-cyan-500/20 to-teal-500/20",
    "Summer Memories 2024": "from-yellow-500/20 to-orange-500/20",
    "First Date Night": "from-purple-500/20 to-pink-500/20",
    "New Year's Eve": "from-red-500/20 to-yellow-500/20",
  };
  return colors[title] || "from-gray-500/20 to-gray-500/20";
};

const CapsuleCardWithFallback = (props: CapsuleCardProps) => {
  const [imgError, setImgError] = useState(false);
  const fallbackColor = getFallbackColor(props.title);

  return (
    <div
      className={`relative rounded-2xl border p-6 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] ${
        props.type === "locked" ? "capsule-locked border-border/30" :
        props.type === "unlocking" ? "capsule-unlocking border-primary/40 animate-pulse-glow" :
        "capsule-opened border-secondary/40"
      }`}
    >
      {/* Glow Effect for Unlocking */}
      {props.type === "unlocking" && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent animate-pulse" />
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {props.type === "locked" && <Lock className="w-5 h-5 text-muted-foreground" />}
            {props.type === "unlocking" && <Clock className="w-5 h-5 text-primary" />}
            {props.type === "opened" && <Sparkles className="w-5 h-5 text-secondary" />}
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-sans">
              {props.type === "locked" && "Locked"}
              {props.type === "unlocking" && "Unlocking Soon"}
              {props.type === "opened" && "Opened"}
            </span>
          </div>
          {props.countdown && (
            <span className="text-sm font-mono text-primary">{props.countdown}</span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-serif mb-2">{props.title}</h3>

        {/* Date */}
        <p className="text-sm text-muted-foreground mb-4">
          {props.type === "opened" ? "Opened on" : "Opens on"} {props.date}
        </p>

        {/* Preview for opened capsules */}
        {props.type === "opened" && props.preview && (
          <p className="text-foreground/80 leading-relaxed line-clamp-3 mb-4">
            {props.preview}
          </p>
        )}

        {/* Image preview with fallback */}
        {props.imageUrl && !imgError ? (
          <div className="rounded-lg overflow-hidden mb-4 border border-border/30">
            <img 
              src={props.imageUrl} 
              alt={props.title}
              className="w-full h-32 object-cover opacity-80"
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          <div className={`rounded-lg overflow-hidden mb-4 border border-border/30 bg-gradient-to-br ${fallbackColor}`}>
            <div className="w-full h-32 flex items-center justify-center">
              <Image className="w-8 h-8 text-muted-foreground/50" />
            </div>
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

const CapsuleFeed = ({ capsules = [] }) => {
  // Use provided capsules if any, otherwise use dummy data
  const displayCapsules = capsules.length > 0 ? capsules : dummyCapsules;

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
      </div>
        
      {/* Capsule Grid */}
      <div className="container-narrow relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCapsules.map((capsule, index) => (
            <CapsuleCardWithFallback key={index} {...capsule} />
          ))}
        </div>
        
        {/* Additional dummy cards below the timeline */}
        <div className="mt-12 pt-8 border-t border-border/30">
          <h3 className="text-2xl font-serif text-center mb-8">
            More <span className="text-gradient">Coming Soon</span>
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CapsuleCardWithFallback
              type="locked"
              title="✨ Mystery Capsule"
              date="Coming Soon"
              imageUrl="https://picsum.photos/id/1/400/300"
            />
            <CapsuleCardWithFallback
              type="locked"
              title="🎄 Holiday Special"
              date="December 2025"
              imageUrl="https://picsum.photos/id/8/400/300"
            />
            <CapsuleCardWithFallback
              type="locked"
              title="🎉 Celebration"
              date="TBD"
              imageUrl="https://picsum.photos/id/16/400/300"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CapsuleFeed;