import { Users, Lock, Clock, Heart, Gift } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface FriendVault {
  id: string;
  friendName: string;
  friendAvatar?: string;
  capsuleTitle: string;
  unlockDate: string;
  type: "shared" | "gift" | "collaborative";
}

const friendVaults: FriendVault[] = [
  {
    id: "1",
    friendName: "Sarah M.",
    capsuleTitle: "Our Friendship Journey",
    unlockDate: "2030",
    type: "shared",
  },
  {
    id: "2",
    friendName: "Alex Chen",
    capsuleTitle: "Birthday Surprise",
    unlockDate: "2025",
    type: "gift",
  },
  {
    id: "3",
    friendName: "Team Alpha",
    capsuleTitle: "Startup Memories",
    unlockDate: "2028",
    type: "collaborative",
  },
];

const getTypeIcon = (type: FriendVault["type"]) => {
  switch (type) {
    case "shared":
      return <Heart className="w-4 h-4 text-secondary" />;
    case "gift":
      return <Gift className="w-4 h-4 text-primary" />;
    case "collaborative":
      return <Users className="w-4 h-4 text-accent" />;
    default:
      return null;
  }
};

const getTypeBadge = (type: FriendVault["type"]) => {
  switch (type) {
    case "shared":
      return "Shared Capsule";
    case "gift":
      return "Gift Capsule";
    case "collaborative":
      return "Group Capsule";
    default:
      return "";
  }
};

const FriendsVaults = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Friend Vaults List */}
      <Card className="lg:col-span-2 bg-card/50 border-border/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-serif flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Friends' Vaults
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {friendVaults.map((vault) => (
              <div
                key={vault.id}
                className="p-4 rounded-lg bg-muted/20 border border-border/30 hover:border-primary/50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12 border-2 border-primary/30">
                    <AvatarImage src={vault.friendAvatar} />
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {vault.friendName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground">{vault.capsuleTitle}</span>
                      {getTypeIcon(vault.type)}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{vault.friendName}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Opens {vault.unlockDate}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-full">
                    {getTypeBadge(vault.type)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-border/30">
            <Button variant="outline" className="w-full">
              <Users className="w-4 h-4 mr-2" />
              Invite Friends to Create Together
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pending Invites */}
      <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-serif flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            Pending Invites
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary/30 text-primary text-xs">JD</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-foreground">John D.</p>
                <p className="text-xs text-muted-foreground">Invited you to collaborate</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="hero" className="flex-1">Accept</Button>
              <Button size="sm" variant="outline" className="flex-1">Decline</Button>
            </div>
          </div>

          <div className="text-center py-4">
            <Clock className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No other pending invites</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FriendsVaults;
