import { Clock, Lock, Unlock, Diamond } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Capsule {
  id: string;
  title: string;
  createdYear: number;
  unlockYear: number;
  status: "locked" | "unlocking" | "opened";
  icon?: string;
}

const capsules: Capsule[] = [
  { id: "1", title: "Wedding Memories", createdYear: 2024, unlockYear: 2040, status: "locked" },
  { id: "2", title: "First Business Year", createdYear: 2023, unlockYear: 2030, status: "locked" },
  { id: "3", title: "College Graduation", createdYear: 2022, unlockYear: 2025, status: "unlocking" },
  { id: "4", title: "Letters to Self", createdYear: 2020, unlockYear: 2024, status: "opened" },
];

const getStatusStyles = (status: Capsule["status"]) => {
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

const getStatusIcon = (status: Capsule["status"]) => {
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

const MyCapsules = () => {
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
            {capsules.map((capsule) => {
              const totalYears = capsule.unlockYear - capsule.createdYear;
              const currentYear = new Date().getFullYear();
              const yearsElapsed = Math.min(currentYear - capsule.createdYear, totalYears);
              const progress = Math.max(0, Math.min(100, (yearsElapsed / totalYears) * 100));

              return (
                <div
                  key={capsule.id}
                  className={`p-4 rounded-lg border transition-all hover:border-primary/50 cursor-pointer ${getStatusStyles(capsule.status)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(capsule.status)}
                      <span className="font-medium text-foreground">{capsule.title}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{capsule.createdYear}</span>
                      <span className="text-primary">→</span>
                      <span className="text-primary font-medium">{capsule.unlockYear}</span>
                    </div>
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
    </div>
  );
};

export default MyCapsules;
