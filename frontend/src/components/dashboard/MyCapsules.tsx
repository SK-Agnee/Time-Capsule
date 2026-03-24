import { Clock, Lock, Unlock, Diamond } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import axios from "axios";


const getStatusStyles = (status) => {
  switch (status) {
    case "locked":
      return "bg-capsule-locked border-border/30";
    case "unlocking":
      return "bg-capsule-unlocking border-primary/30 capsule-unlocking";
    case "opened":
      return "bg-capsule-opened border-accent/30";
    default:
      return "bg-card";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "locked":
      return <Lock className="w-4 h-4 text-muted-foreground" />;
    case "unlocking":
      return <Clock className="w-4 h-4 text-primary animate-pulse" />;
    case "opened":
      return <Unlock className="w-4 h-4 text-accent" />;
    default:
      return null;
  }
};

const getCountdown = (diff) => {

  if (diff <= 0) return "Unlocked";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

  return `${days}d ${hours}h left`;
};

const MyCapsules = ({ capsules }) => {
  const [time, setTime] = useState(Date.now());
  const [selectedCapsule, setSelectedCapsule] = useState(null);
  const [showModal, setShowModal] = useState(false);
useEffect(() => {
  const interval = setInterval(() => {
    setTime(Date.now());
  }, 1000);

  return () => clearInterval(interval);
}, []);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Capsules List */}
      <Card className="lg:col-span-2 bg-card/50 border-border/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-serif flex items-center gap-2">
            <Diamond className="w-5 h-5 text-primary" />
            My Capsules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {capsules.map((c, index) => {
              const createdYear = new Date(c.createdAt).getFullYear();
              const unlockDate = c.unlockDate ? new Date(c.unlockDate) : new Date();
              const unlockYear = unlockDate.getFullYear();

              const status =
                unlockDate.getTime() > time
                  ? "locked"
                  : "opened";

              const countdown = getCountdown(unlockDate.getTime() - time);
              const totalYears = Math.max(1, unlockYear - createdYear);
              const currentYear = new Date().getFullYear();
              const yearsElapsed = Math.min(currentYear - createdYear, totalYears);
              const progress = Math.max(
                  0,
                  Math.min(100, (yearsElapsed / totalYears) * 100)
              );

              return (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedCapsule(c);
                    setShowModal(true);
                  }}
                  className={`p-4 rounded-lg border transition-all hover:border-primary/50 cursor-pointer ${getStatusStyles(status)}`}
                >
                  <div className="mb-2">
                    <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(status)}
                      <span className="font-medium text-foreground">{c.title}</span>
                    </div>

                    {/* ✅ UNLOCK BADGE */}
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        status === "opened"
                          ? "bg-green-500/20 text-green-400 shadow-sm"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {status === "opened" ? "🎉 Unlocked" : "🔒 Locked"}
                    </span>
                  </div>

                    <p className="text-sm mt-1 text-muted-foreground">
                      {unlockDate.getTime() > time
                        ? "🔒 Locked until unlock date"
                        : c.message}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{createdYear}</span>
                      <span className="text-primary">→</span>
                      <span className="text-primary font-medium">{unlockYear}</span>
                    </div>

                    {/* Countdown */}
                    {status === "locked" && (
                      <p className="text-xs text-primary mt-1">
                        {countdown}
                      </p>
                    )}
                  </div>
                  <Progress value={progress} className="h-1.5" />
                </div>
              );
            })}
          </div>

          {/* Progress indicator */}
          <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Diamond className="w-4 h-4 text-primary" />
              <span>1 of 39</span>
            </div>
            <span>{new Date().getFullYear()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Unlocks */}
      <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-serif flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Upcoming Unlocks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-capsule-unlocking border border-primary/20">
            <p className="text-sm text-foreground mb-1">College Graduation Vault</p>
            <p className="text-xs text-muted-foreground mb-2">Message from Dec 25, 2022</p>
            <div className="flex items-center gap-2 text-primary">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">204 days left</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
            <p className="text-sm text-foreground mb-1">Birthday Surprise 2025</p>
            <p className="text-xs text-muted-foreground mb-2">Video message</p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm">1 year, 45 days</span>
            </div>
          </div>
        </CardContent>
      </Card>
      {selectedCapsule && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div
  className={`bg-card p-6 rounded-xl max-w-md w-full relative transform transition-all duration-300 ${
    showModal ? "scale-100 opacity-100" : "scale-90 opacity-0"
  }`}
>

      {/* Close Button */}
      <button
        className="absolute top-2 right-3 text-lg"
        onClick={() => {
          setShowModal(false);
          setTimeout(() => setSelectedCapsule(null), 200);
        }}
      >
        ✖
      </button>

      {/* Title */}
      <h2 className="text-xl font-semibold mb-2">
        {selectedCapsule.title}
      </h2>

      {/* Unlock Info */}
      <p className="text-sm text-muted-foreground mb-4">
        Unlocks on{" "}
        {new Date(selectedCapsule.unlockDate).toDateString()}
      </p>

      {/* Message */}
      <div className="bg-muted p-4 rounded-md">
        {new Date(selectedCapsule.unlockDate).getTime() > Date.now()
          ? "🔒 This capsule is still locked"
          : selectedCapsule.message}
      </div>
    </div>
  </div>
)}
    </div>
    
  );
};

export default MyCapsules;
