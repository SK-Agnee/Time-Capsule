import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Upload, Image, Video, Mic, MessageSquare, Calendar, Lock, Sparkles, Clock, LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import axios from "axios";

interface ContentType {
  id: string;
  icon: LucideIcon;
  label: string;
  description: string;
}

const contentTypes: ContentType[] = [
  { id: "image", icon: Image, label: "Photos", description: "Upload photos & images" },
  { id: "video", icon: Video, label: "Videos", description: "Record or upload videos" },
  { id: "audio", icon: Mic, label: "Audio", description: "Record voice messages" },
  { id: "text", icon: MessageSquare, label: "Message", description: "Write a letter" },
];

interface Props {
  onCapsuleCreated?: () => void;
}

const CreateCapsule = ({ onCapsuleCreated }: Props) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [unlockDate, setUnlockDate] = useState<Date | undefined>();
  const [unlockTime, setUnlockTime] = useState("12:00");
  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!unlockDate) return;

    const now = new Date();
    const selected = new Date(unlockDate);

    if (selected.toDateString() === now.toDateString()) {
      const minTime = new Date(Date.now() + 60000);
      const hh = String(minTime.getHours()).padStart(2, "0");
      const mm = String(minTime.getMinutes()).padStart(2, "0");
      setUnlockTime(`${hh}:${mm}`);
    }
  }, [unlockDate]);

  // Clear preview when file changes
  useEffect(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (image) {
      setPreviewUrl(URL.createObjectURL(image));
    } else if (video) {
      setPreviewUrl(URL.createObjectURL(video));
    } else if (audio) {
      setPreviewUrl(URL.createObjectURL(audio));
    } else {
      setPreviewUrl(null);
    }
  }, [image, video, audio]);

  const toggleType = (typeId: string) => {
    setSelectedTypes((prev) => {
      const newSelected = prev.includes(typeId) 
        ? prev.filter((id) => id !== typeId) 
        : [...prev, typeId];
      
      // Clear file when deselecting type
      if (prev.includes(typeId)) {
        if (typeId === "image") setImage(null);
        if (typeId === "video") setVideo(null);
        if (typeId === "audio") setAudio(null);
      }
      
      return newSelected;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert("File size must be less than 50MB");
      return;
    }

    if (type === "image") {
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file");
        return;
      }
      setImage(file);
    } else if (type === "video") {
      if (!file.type.startsWith("video/")) {
        alert("Please select a valid video file");
        return;
      }
      setVideo(file);
    } else if (type === "audio") {
      if (!file.type.startsWith("audio/")) {
        alert("Please select a valid audio file");
        return;
      }
      setAudio(file);
    }
  };

  const handleCreateCapsule = async () => {
    try {
      if (!title.trim()) {
        alert("Title is required");
        return;
      }

      const user = JSON.parse(localStorage.getItem("capsule_current_user") || "{}");
      if (!user?._id) {
        alert("User not logged in");
        return;
      }

      // Combine date + time
      let finalDate = unlockDate ? new Date(unlockDate) : new Date();
      if (unlockTime) {
        const [hours, minutes] = unlockTime.split(":");
        finalDate.setHours(Number(hours));
        finalDate.setMinutes(Number(minutes));
        finalDate.setSeconds(0);
      }

      // Check if unlock time is at least 1 minute in the future
      const minAllowed = new Date(Date.now() + 60000);
      if (finalDate <= minAllowed) {
        alert("Unlock time must be at least 1 minute in the future");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("message", message);
      formData.append("unlockDate", finalDate.toISOString());
      formData.append("userId", user._id);

      // Only append files if they exist
      if (image) formData.append("image", image);
      if (video) formData.append("video", video);
      if (audio) formData.append("audio", audio);

      const res = await axios.post(
        "http://localhost:5000/api/capsules",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(res.data);
      alert("Capsule Created Successfully!");
      
// Dispatch event to notify dashboard
window.dispatchEvent(new CustomEvent('capsuleCreated'));

      // Reset form
      setTitle("");
      setMessage("");
      setUnlockDate(undefined);
      setUnlockTime("12:00");
      setSelectedTypes([]);
      setImage(null);
      setVideo(null);
      setAudio(null);
      setPreviewUrl(null);
      
      if (onCapsuleCreated) {
        onCapsuleCreated();
      }
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.error || "Error creating capsule");
    }
  };

  const getUploadAreaContent = () => {
    if (previewUrl) {
      if (image) {
        return (
          <div className="space-y-2">
            <img
              src={previewUrl}
              alt="preview"
              className="mx-auto max-h-40 rounded object-contain"
            />
            <button
              onClick={() => setImage(null)}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Remove image
            </button>
          </div>
        );
      } else if (video) {
        return (
          <div className="space-y-2">
            <video controls className="mx-auto max-h-40 rounded">
              <source src={previewUrl} type={video.type} />
            </video>
            <button
              onClick={() => setVideo(null)}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Remove video
            </button>
          </div>
        );
      } else if (audio) {
        return (
          <div className="space-y-2">
            <audio controls className="w-full">
              <source src={previewUrl} type={audio.type} />
            </audio>
            <button
              onClick={() => setAudio(null)}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Remove audio
            </button>
          </div>
        );
      }
    }

    return (
      <>
        <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
        <p className="text-foreground font-medium mb-1">
          Click to upload
        </p>
        <p className="text-sm text-muted-foreground">
          Max file size: 50MB
        </p>
      </>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Create Form */}
      <Card className="lg:col-span-2 bg-card/50 border-border/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-serif flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Create New Capsule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm text-muted-foreground">Capsule Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Name your time capsule..."
              className="bg-muted/30 border-border/50 focus:border-primary"
            />
          </div>

          {/* Content Types */}
          <div className="space-y-3">
            <Label className="text-sm text-muted-foreground">What would you like to include?</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {contentTypes.map((type) => {
                const isSelected = selectedTypes.includes(type.id);
                return (
                  <button
                    key={type.id}
                    onClick={() => toggleType(type.id)}
                    className={`p-4 rounded-lg border transition-all text-center ${
                      isSelected
                        ? "bg-primary/20 border-primary text-primary"
                        : "bg-muted/20 border-border/50 hover:border-primary/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <type.icon className="w-6 h-6 mx-auto mb-2" />
                    <p className="text-sm font-medium">{type.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upload Area - Dynamic based on selected types */}
          {selectedTypes.includes("image") && (
            <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "image")}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer block">
                {getUploadAreaContent()}
              </label>
            </div>
          )}

          {selectedTypes.includes("video") && (
            <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleFileChange(e, "video")}
                className="hidden"
                id="video-upload"
              />
              <label htmlFor="video-upload" className="cursor-pointer block">
                {video ? (
                  <div className="space-y-2">
                    <video controls className="mx-auto max-h-40 rounded">
                      <source src={URL.createObjectURL(video)} type={video.type} />
                    </video>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setVideo(null);
                      }}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Remove video
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-foreground font-medium mb-1">
                      Click to upload video
                    </p>
                    <p className="text-sm text-muted-foreground">
                      MP4, WebM supported (max 50MB)
                    </p>
                  </>
                )}
              </label>
            </div>
          )}

          {selectedTypes.includes("audio") && (
            <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => handleFileChange(e, "audio")}
                className="hidden"
                id="audio-upload"
              />
              <label htmlFor="audio-upload" className="cursor-pointer block">
                {audio ? (
                  <div className="space-y-2">
                    <audio controls className="w-full">
                      <source src={URL.createObjectURL(audio)} type={audio.type} />
                    </audio>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setAudio(null);
                      }}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Remove audio
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-foreground font-medium mb-1">
                      Click to upload audio
                    </p>
                    <p className="text-sm text-muted-foreground">
                      MP3, WAV supported (max 50MB)
                    </p>
                  </>
                )}
              </label>
            </div>
          )}

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm text-muted-foreground">Your Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a message to your future self..."
              className="bg-muted/30 border-border/50 focus:border-primary min-h-[120px]"
            />
          </div>

          {/* Unlock Date & Time */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Set Release Date & Time
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-muted/30 border-border/50 hover:border-primary",
                      !unlockDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {unlockDate ? format(unlockDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={unlockDate}
                    onSelect={setUnlockDate}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="time"
                  value={unlockTime}
                  onChange={(e) => setUnlockTime(e.target.value)}
                  className="pl-10 bg-muted/30 border-border/50 focus:border-primary"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Your capsule will unlock on {unlockDate ? format(unlockDate, "MMMM d, yyyy") : "the selected date"} at {unlockTime}
            </p>
          </div>

          {/* Create Button */}
          <Button
            variant="hero"
            size="lg"
            className="w-full"
            onClick={handleCreateCapsule}
          >
            <Lock className="w-4 h-4 mr-2" />
            Seal Time Capsule
          </Button>
        </CardContent>
      </Card>

      {/* Tips & Preview */}
      <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-serif">Tips for Your Capsule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm text-foreground leading-relaxed">
              "Write as if you're speaking to a stranger who happens to be you. What would you want them to know?"
            </p>
          </div>

          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Include specific details about your current life
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Add photos of everyday moments, not just special occasions
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Record your voice – you'll love hearing it later
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Write about your hopes and predictions
            </li>
          </ul>

          <div className="pt-4 border-t border-border/30">
            <p className="text-xs text-muted-foreground">
              Your capsule will be encrypted and securely stored until the release date.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateCapsule;