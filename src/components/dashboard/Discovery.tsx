import { Globe, Clock, MapPin, Heart, Share2, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const publicCapsules = [
  {
    id: "1",
    title: "Message to 2030",
    author: "Anonymous",
    location: "Tokyo, Japan",
    unlockDate: "2030",
    likes: 1247,
    preview: "To whoever finds this in 2030, I hope the world has become kinder...",
  },
  {
    id: "2",
    title: "Pre-Wedding Thoughts",
    author: "Emma & James",
    location: "London, UK",
    unlockDate: "2035",
    likes: 892,
    preview: "We wrote this the night before our wedding, full of nerves and excitement...",
  },
  {
    id: "3",
    title: "Climate Hope 2040",
    author: "Green Future Collective",
    location: "Global",
    unlockDate: "2040",
    likes: 3421,
    preview: "A collection of hopes and predictions about our planet's future...",
  },
];

const Discovery = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Global Echoes */}
      <Card className="lg:col-span-2 bg-card/50 border-border/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-serif flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Global Echoes
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Discover public time capsules from around the world
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {publicCapsules.map((capsule) => (
              <div
                key={capsule.id}
                className="p-5 rounded-lg bg-muted/20 border border-border/30 hover:border-primary/50 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-foreground mb-1">{capsule.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{capsule.author}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {capsule.location}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{capsule.unlockDate}</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 italic">
                  "{capsule.preview}"
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <Heart className="w-4 h-4" />
                      <span>{capsule.likes.toLocaleString()}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Activity */}
      <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-serif flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Live Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/20">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2 animate-pulse" />
              <div>
                <p className="text-sm text-foreground">
                  A capsule was just opened in <span className="text-primary">Paris</span>
                </p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/20">
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
              <div>
                <p className="text-sm text-foreground">
                  New public capsule created for <span className="text-primary">2050</span>
                </p>
                <p className="text-xs text-muted-foreground">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/20">
              <div className="w-2 h-2 rounded-full bg-secondary mt-2" />
              <div>
                <p className="text-sm text-foreground">
                  <span className="text-primary">1,000</span> people waiting for a capsule from 2019
                </p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border/30">
            <div className="text-center">
              <Globe className="w-12 h-12 mx-auto mb-3 text-primary/50" />
              <p className="text-2xl font-serif text-foreground mb-1">42,847</p>
              <p className="text-sm text-muted-foreground">Capsules waiting globally</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Discovery;
