import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Globe, Sparkles, Search, User, Loader2, Eye, Heart, MessageCircle, 
  Share2, Bookmark, Flame, TrendingUp, Clock, Lock, Unlock, 
  Users, MapPin, Calendar, Award, Zap, ChevronRight, Play, 
  Volume2, VolumeX, X, Send, ThumbsUp, Quote
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

interface UserProfile {
  _id: string;
  name: string;
  username: string;
  bio: string;
  profilePicture?: string;
}

interface Comment {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  text: string;
  timestamp: Date;
  likes: number;
}

interface PublicCapsule {
  _id: string;
  title: string;
  message: string;
  unlockDate: string;
  createdAt: string;
  image?: string;
  video?: string;
  author: {
    _id: string;
    name: string;
    username: string;
    profilePicture?: string;
  };
  likes: number;
  views: number;
  comments: Comment[];
  tags: string[];
  location?: string;
  mood?: string;
  timeToRead?: string;
}

// Helper functions for generating random data
const generateId = () => Math.random().toString(36).substr(2, 9);

const randomNames = [
  "Emma Watson", "Michael Chen", "Sarah Johnson", "David Kim", 
  "Luna Arctic", "Alex Rivera", "Eleanor Rose", "The Collective",
  "Sofia Martinez", "James Wilson", "Maya Patel", "Oliver Smith",
  "Isabella Lee", "Ethan Brown", "Ava Garcia", "Liam Anderson"
];

const randomUsernames = [
  "emma_wanders", "mike_brews", "sarah_j", "david_visions",
  "luna_nights", "alex_adventures", "eleanor_ocean", "the_collective",
  "sofia_dreams", "james_writes", "maya_explores", "oliver_creates",
  "isabella_love", "ethan_views", "ava_sparks", "liam_moments"
];

const randomTitles = [
  "A Message to My Future Self", "Sunset Reflections", "Morning Coffee Thoughts",
  "The Night Sky", "Ocean Memories", "Mountain Peak", "City Lights",
  "First Love", "Dreams and Goals", "Life Lessons", "Gratitude Journal",
  "Adventure Awaits", "Peaceful Moments", "Creative Journey", "Family Love",
  "New Beginnings", "Simple Joys", "Timeless Wisdom", "Heartfelt Words"
];

const randomMessages = [
  "I hope you're happy. I hope you're healthy. I hope you're still dreaming. Life is short, make it count.",
  "Remember that time we thought we couldn't make it? Look at us now. Keep pushing forward.",
  "The best is yet to come. Trust the journey, even when it's hard. You've got this.",
  "Never forget how far you've come. Every step matters. Every lesson learned.",
  "To whoever reads this: you are enough. You always have been. Keep being you.",
  "Chase your dreams fearlessly. The world needs what only you can offer.",
  "Find joy in the little things. A sunrise, a good book, a warm hug. That's what matters.",
  "Be kind to yourself. You're doing better than you think. Tomorrow is a new day.",
  "Create something that outlasts you. Leave your mark. Make it count.",
  "Love deeply, laugh often, live fully. That's the secret to a good life.",
  "Sometimes the smallest step in the right direction ends up being the biggest step of your life.",
  "Let your dreams be bigger than your fears and your actions louder than your words.",
  "The only limit to our realization of tomorrow is our doubts of today.",
  "Believe you can and you're halfway there. Keep going, you're doing amazing."
];

const randomTagsList = [
  ["inspiration", "motivation", "life"], ["travel", "adventure", "wanderlust"],
  ["love", "family", "memories"], ["dreams", "goals", "future"],
  ["peace", "mindfulness", "gratitude"], ["creativity", "art", "expression"],
  ["nature", "outdoors", "explore"], ["wisdom", "lessons", "growth"],
  ["happiness", "joy", "smile"], ["success", "achievement", "win"]
];

const randomLocations = [
  "Santorini, Greece", "Kyoto, Japan", "Paris, France", "New York, USA",
  "Bali, Indonesia", "Swiss Alps", "Cape Town, South Africa", "Sydney, Australia",
  "Iceland", "Machu Picchu, Peru", "Venice, Italy", "Marrakech, Morocco",
  "Banff, Canada", "Queenstown, New Zealand", "Phuket, Thailand", "Dubai, UAE"
];

const randomMoods = ["✨ Inspired", "🌅 Peaceful", "💭 Reflective", "🔥 Passionate", "💖 Grateful", "🚀 Ambitious", "🌈 Hopeful", "🌟 Dreamy"];

// Generate a single random capsule
const generateRandomCapsule = (id: number, isVideo: boolean = false, currentUser?: any): PublicCapsule => {
  const nameIndex = Math.floor(Math.random() * randomNames.length);
  const titleIndex = Math.floor(Math.random() * randomTitles.length);
  const messageIndex = Math.floor(Math.random() * randomMessages.length);
  const tagsIndex = Math.floor(Math.random() * randomTagsList.length);
  const locationIndex = Math.floor(Math.random() * randomLocations.length);
  const moodIndex = Math.floor(Math.random() * randomMoods.length);
  
  // Generate random comments (3-15 comments)
  const commentCount = Math.floor(Math.random() * 12) + 3;
  const comments: Comment[] = Array.from({ length: commentCount }, (_, i) => ({
    id: generateId(),
    user: {
      name: randomNames[Math.floor(Math.random() * randomNames.length)],
      username: randomUsernames[Math.floor(Math.random() * randomUsernames.length)],
      avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'women' : 'men'}/${Math.floor(Math.random() * 70) + 1}.jpg`
    },
    text: randomMessages[Math.floor(Math.random() * randomMessages.length)],
    timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    likes: Math.floor(Math.random() * 50)
  }));
  
  // Generate date within the last year
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 365));
  
  return {
    _id: `capsule_${id}_${Date.now()}_${Math.random()}`,
    title: randomTitles[titleIndex],
    message: randomMessages[messageIndex],
    unlockDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: date.toISOString(),
    image: isVideo ? undefined : `https://picsum.photos/id/${Math.floor(Math.random() * 200) + 1}/800/1000`,
    video: isVideo ? `https://www.w3schools.com/html/mov_bbb.mp4` : undefined,
    author: currentUser ? {
      _id: currentUser._id,
      name: currentUser.name,
      username: currentUser.username,
      profilePicture: currentUser.profilePicture || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'women' : 'men'}/${Math.floor(Math.random() * 70) + 1}.jpg`
    } : {
      _id: `user_${nameIndex}`,
      name: randomNames[nameIndex],
      username: randomUsernames[nameIndex],
      profilePicture: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'women' : 'men'}/${Math.floor(Math.random() * 70) + 1}.jpg`
    },
    likes: Math.floor(Math.random() * 5000) + 100,
    views: Math.floor(Math.random() * 20000) + 1000,
    comments,
    tags: randomTagsList[tagsIndex],
    location: randomLocations[locationIndex],
    mood: randomMoods[moodIndex],
    timeToRead: `${Math.floor(Math.random() * 3) + 1} min read`
  };
};

// Fake API Service
class FakeAPIService {
  private capsules: PublicCapsule[] = [];
  private nextId: number = 0;
  private readonly pageSize = 6;
  private currentUser: any = null;
  
  constructor() {
    this.initializeWithData(20);
  }
  
  setCurrentUser(user: any) {
    this.currentUser = user;
  }
  
  initializeWithData(count: number) {
    this.capsules = Array.from({ length: count }, (_, i) => 
      generateRandomCapsule(i, Math.random() > 0.7)
    );
    this.nextId = count;
    // Sort by newest first
    this.capsules.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async fetchCapsules(page: number): Promise<{ data: PublicCapsule[]; hasMore: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 300));
    
    const start = page * this.pageSize;
    const end = start + this.pageSize;
    const data = this.capsules.slice(start, end);
    const hasMore = end < this.capsules.length;
    
    return { data, hasMore };
  }
  
  async getCapsuleDetails(id: string): Promise<PublicCapsule | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const capsule = this.capsules.find(c => c._id === id);
    return capsule || null;
  }
  
  async addComment(capsuleId: string, commentText: string, user: any): Promise<Comment> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newComment: Comment = {
      id: generateId(),
      user: {
        name: user.name,
        username: user.username,
        avatar: user.profilePicture || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'women' : 'men'}/1.jpg`
      },
      text: commentText,
      timestamp: new Date(),
      likes: 0
    };
    
    const capsuleIndex = this.capsules.findIndex(c => c._id === capsuleId);
    if (capsuleIndex !== -1) {
      this.capsules[capsuleIndex].comments = [newComment, ...this.capsules[capsuleIndex].comments];
    }
    
    return newComment;
  }
  
  async likeComment(capsuleId: string, commentId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const capsule = this.capsules.find(c => c._id === capsuleId);
    if (capsule) {
      const comment = capsule.comments.find(c => c.id === commentId);
      if (comment) {
        comment.likes += 1;
      }
    }
  }
  
  async likeCapsule(capsuleId: string): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const capsule = this.capsules.find(c => c._id === capsuleId);
    if (capsule) {
      capsule.likes += 1;
      return capsule.likes;
    }
    return 0;
  }
  
  async unlikeCapsule(capsuleId: string): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const capsule = this.capsules.find(c => c._id === capsuleId);
    if (capsule && capsule.likes > 0) {
      capsule.likes -= 1;
      return capsule.likes;
    }
    return capsule?.likes || 0;
  }
  
  async refreshFeed(): Promise<PublicCapsule[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.capsules;
  }
  
  // For infinite scroll simulation - generate more data when reaching the end
  async generateMoreData(count: number = 10): Promise<PublicCapsule[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newCapsules = Array.from({ length: count }, (_, i) => 
      generateRandomCapsule(this.nextId + i, Math.random() > 0.7)
    );
    
    this.capsules = [...this.capsules, ...newCapsules];
    this.nextId += count;
    
    return newCapsules;
  }
}

const fakeAPI = new FakeAPIService();

// Capsule Detail Modal Component
const CapsuleDetailModal = ({ 
  capsule, 
  isOpen, 
  onClose,
  currentUser 
}: { 
  capsule: PublicCapsule | null; 
  isOpen: boolean; 
  onClose: () => void;
  currentUser: any;
}) => {
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localCapsule, setLocalCapsule] = useState<PublicCapsule | null>(capsule);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    setLocalCapsule(capsule);
  }, [capsule]);
  
  const handleAddComment = async () => {
    if (!commentText.trim() || !localCapsule) return;
    
    setIsSubmitting(true);
    try {
      const newComment = await fakeAPI.addComment(localCapsule._id, commentText, currentUser);
      setLocalCapsule({
        ...localCapsule,
        comments: [newComment, ...localCapsule.comments]
      });
      setCommentText("");
      toast({ title: "Comment added!", duration: 1500 });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to add comment", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleLikeComment = async (commentId: string) => {
    if (!localCapsule || likedComments.has(commentId)) return;
    
    try {
      await fakeAPI.likeComment(localCapsule._id, commentId);
      setLikedComments(prev => new Set(prev).add(commentId));
      setLocalCapsule({
        ...localCapsule,
        comments: localCapsule.comments.map(c => 
          c.id === commentId ? { ...c, likes: c.likes + 1 } : c
        )
      });
    } catch (err) {
      console.error(err);
    }
  };
  
  if (!localCapsule) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[85vh] overflow-hidden flex flex-col p-0 bg-background">
        <div className="flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={localCapsule.author.profilePicture} />
              <AvatarFallback>{localCapsule.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{localCapsule.author.name}</p>
              <p className="text-xs text-muted-foreground">@{localCapsule.author.username}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {localCapsule.mood && (
              <Badge className="mb-4 bg-primary/10 text-primary">{localCapsule.mood}</Badge>
            )}
            <h2 className="text-3xl font-serif mb-4">{localCapsule.title}</h2>
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(localCapsule.createdAt).toLocaleDateString()}
              </span>
              {localCapsule.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {localCapsule.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {localCapsule.timeToRead}
              </span>
            </div>
            
            {localCapsule.image && (
              <div className="mb-6 rounded-lg overflow-hidden">
                <img src={localCapsule.image} alt={localCapsule.title} className="w-full max-h-[400px] object-cover" />
              </div>
            )}
            
            <div className="mb-6 p-6 bg-muted/30 rounded-lg italic">
              <Quote className="w-8 h-8 text-primary/30 mb-3" />
              <p className="text-lg leading-relaxed">{localCapsule.message}</p>
            </div>
            
            {localCapsule.tags && localCapsule.tags.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {localCapsule.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs">#{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-6 mb-6 p-4 bg-muted/20 rounded-lg">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500 fill-current" />
                <span className="font-semibold">{localCapsule.likes.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                <span className="font-semibold">{localCapsule.comments.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-muted-foreground" />
                <span className="font-semibold">{localCapsule.views.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Comments ({localCapsule.comments.length})
              </h3>
              
              <div className="flex gap-3 mb-6">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>{currentUser?.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="min-h-[60px] resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <Button size="sm" onClick={handleAddComment} disabled={!commentText.trim() || isSubmitting}>
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      <span className="ml-2">Post</span>
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {localCapsule.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={comment.user.avatar} />
                      <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{comment.user.name}</span>
                        <span className="text-xs text-muted-foreground">@{comment.user.username}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{comment.text}</p>
                      <button 
                        onClick={() => handleLikeComment(comment.id)}
                        className="flex items-center gap-1 mt-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                        disabled={likedComments.has(comment.id)}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{comment.likes} likes</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Discovery = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [capsules, setCapsules] = useState<PublicCapsule[]>([]);
  const [page, setPage] = useState(0);
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCapsule, setSelectedCapsule] = useState<PublicCapsule | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [likedCapsules, setLikedCapsules] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastCapsuleRef = useRef<HTMLDivElement | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("capsule_current_user") || "{}");
    if (user?._id) {
      setCurrentUser(user);
      fakeAPI.setCurrentUser(user);
    }
    loadMoreCapsules();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      async (entries) => {
        if (!entries[0].isIntersecting) return;

        // If near end → generate more data
        if (capsules.length - page * 6 < 12) {
          const newCapsules = await fakeAPI.generateMoreData(15);

          setCapsules(prev => {
            const updated = [...prev, ...newCapsules];
            return updated.slice(-120);
          });
        }

        // Always load next batch
        loadMoreCapsules();
      },
      {
        threshold: 0.3,
        rootMargin: "300px",
      }
    );

    if (lastCapsuleRef.current) {
      observerRef.current.observe(lastCapsuleRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [capsules, isLoading, page]);

  const loadMoreCapsules = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const { data } = await fakeAPI.fetchCapsules(page);

      setCapsules(prev => {
        const updated = [...prev, ...data];
        return updated.slice(-120);
      });

      setPage(prev => prev + 1);
    } catch (err) {
      console.error("Error loading capsules:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (capsuleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (likedCapsules.has(capsuleId)) {
      const newLikes = await fakeAPI.unlikeCapsule(capsuleId);
      setCapsules(prev => prev.map(c => c._id === capsuleId ? { ...c, likes: newLikes } : c));
      setLikedCapsules(prev => {
        const newSet = new Set(prev);
        newSet.delete(capsuleId);
        return newSet;
      });
    } else {
      const newLikes = await fakeAPI.likeCapsule(capsuleId);
      setCapsules(prev => prev.map(c => c._id === capsuleId ? { ...c, likes: newLikes } : c));
      setLikedCapsules(prev => new Set(prev).add(capsuleId));
    }
  };

  const searchUsers = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      return;
    }
    if (!currentUser?._id) return;

    setIsSearching(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/users/search?q=${encodeURIComponent(query)}`, {
        headers: { 'user-id': currentUser._id }
      });
      setSearchResults(response.data);
    } catch (err) {
      console.error("Error searching users:", err);
    } finally {
      setIsSearching(false);
    }
  }, [currentUser?._id]);

  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (searchQuery.length >= 2) {
      debounceTimerRef.current = setTimeout(() => searchUsers(searchQuery), 300);
    } else if (searchQuery.length === 0) {
      setSearchResults([]);
    }
    return () => { if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current); };
  }, [searchQuery, searchUsers]);

  const viewUserProfile = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/user/${userId}`);
  };

  const openCapsuleDetails = async (capsule: PublicCapsule) => {
    const details = await fakeAPI.getCapsuleDetails(capsule._id);
    if (details) {
      setSelectedCapsule(details);
      setShowDetailModal(true);
    }
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const CapsuleCard = ({ capsule, isLast }: { capsule: PublicCapsule; isLast?: boolean }) => {
    const isLiked = likedCapsules.has(capsule._id);
    
    return (
      <div
        ref={isLast ? lastCapsuleRef : null}
        className="bg-card rounded-xl border border-border/30 overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all duration-300 cursor-pointer"
        onClick={() => openCapsuleDetails(capsule)}
      >
        <div className="p-4 flex items-center justify-between border-b border-border/30">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 cursor-pointer" onClick={(e) => viewUserProfile(capsule.author._id, e)}>
              <AvatarImage src={capsule.author.profilePicture} />
              <AvatarFallback>{getInitials(capsule.author.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold hover:text-primary transition-colors cursor-pointer" onClick={(e) => viewUserProfile(capsule.author._id, e)}>
                {capsule.author.name}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{formatDate(capsule.createdAt)}</span>
                {capsule.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{capsule.location.split(',')[0]}</span>}
              </div>
            </div>
          </div>
          {capsule.mood && <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">{capsule.mood}</Badge>}
        </div>

        {capsule.image && (
          <img src={capsule.image} alt={capsule.title} className="w-full h-56 object-cover hover:scale-105 transition-transform duration-500" />
        )}

        <div className="p-4">
          <h3 className="font-serif font-semibold text-lg mb-2 line-clamp-1">{capsule.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{capsule.message}</p>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {capsule.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-xs text-primary/60">#{tag}</span>
            ))}
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t border-border/30">
            <div className="flex items-center gap-4">
              <button onClick={(e) => handleLike(capsule._id, e)} className={`flex items-center gap-1.5 text-sm transition-colors ${isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"}`}>
                <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                <span>{capsule.likes.toLocaleString()}</span>
              </button>
              <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
                <MessageCircle className="w-5 h-5" />
                <span>{capsule.comments.length}</span>
              </button>
            </div>
            <Badge variant="outline" className="bg-green-500/10 text-green-500 text-xs">
              <Unlock className="w-3 h-3 mr-1" /> Unlocked
            </Badge>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-serif">Discover</h2>
        <p className="text-sm text-muted-foreground">Explore unlocked capsules from the community</p>
      </div>

      {/* Search Bar */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="pt-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users by username or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {isSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin" />}
          </div>
          {searchResults.length > 0 && (
            <div className="mt-3 space-y-2 border-t border-border/50 pt-3">
              {searchResults.map((user) => (
                <div key={user._id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 cursor-pointer" onClick={(e) => viewUserProfile(user._id, e)}>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10"><AvatarFallback>{getInitials(user.name)}</AvatarFallback></Avatar>
                    <div><p className="font-medium text-sm">{user.name}</p><p className="text-xs text-muted-foreground">@{user.username}</p></div>
                  </div>
                  <Button size="sm" variant="ghost"><Eye className="w-4 h-4" /></Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Infinite Scroll Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {capsules.map((capsule, index) => (
          <CapsuleCard key={capsule._id} capsule={capsule} isLast={index === capsules.length - 1} />
        ))}
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && capsules.length === 0 && (
        <div className="text-center py-12">
          <Globe className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
          <p className="text-muted-foreground">No public capsules available yet</p>
        </div>
      )}

      {/* Capsule Detail Modal */}
      <CapsuleDetailModal capsule={selectedCapsule} isOpen={showDetailModal} onClose={() => { setShowDetailModal(false); setSelectedCapsule(null); }} currentUser={currentUser} />
    </div>
  );
};

export default Discovery;