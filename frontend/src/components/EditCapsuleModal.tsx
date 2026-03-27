import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar, Clock, Lock, X, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import axios from "axios";

type Capsule = {
  _id: string;
  title: string;
  message: string;
  unlockDate: string;
  createdAt: string;
  image?: string;
  video?: string;
  audio?: string;
  viewed?: boolean;
};

interface EditCapsuleModalProps {
  capsule: Capsule | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const EditCapsuleModal = ({ capsule, isOpen, onClose, onUpdate }: EditCapsuleModalProps) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [unlockDate, setUnlockDate] = useState<Date | undefined>();
  const [unlockTime, setUnlockTime] = useState("12:00");
  const [loading, setLoading] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newVideo, setNewVideo] = useState<File | null>(null);
  const [newAudio, setNewAudio] = useState<File | null>(null);

  useEffect(() => {
    if (capsule) {
      setTitle(capsule.title);
      setMessage(capsule.message);
      const date = new Date(capsule.unlockDate);
      setUnlockDate(date);
      setUnlockTime(format(date, "HH:mm"));
    }
  }, [capsule]);

  const handleUpdate = async () => {
    if (!capsule) return;

    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    // Validate unlock date
    let finalDate = unlockDate ? new Date(unlockDate) : new Date();
    if (unlockTime) {
      const [hours, minutes] = unlockTime.split(":");
      finalDate.setHours(Number(hours));
      finalDate.setMinutes(Number(minutes));
      finalDate.setSeconds(0);
    }

    const minAllowed = new Date(Date.now() + 60000);
    if (finalDate <= minAllowed) {
      alert("Unlock time must be at least 1 minute in the future");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("message", message);
      formData.append("unlockDate", finalDate.toISOString());
      
      if (newImage) formData.append("image", newImage);
      if (newVideo) formData.append("video", newVideo);
      if (newAudio) formData.append("audio", newAudio);

      await axios.put(`http://localhost:5000/api/capsules/${capsule._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Capsule updated successfully!");
      onUpdate();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || "Error updating capsule");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !capsule) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-xl max-w-md w-full relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-2 right-3 text-lg hover:text-red-400 transition-colors"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-xl font-semibold mb-4">Edit Time Capsule</h2>

        {/* Title Input */}
        <div className="space-y-2 mb-4">
          <Label htmlFor="edit-title" className="text-sm text-muted-foreground">
            Capsule Title
          </Label>
          <Input
            id="edit-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Name your time capsule..."
            className="bg-muted/30 border-border/50 focus:border-primary"
          />
        </div>

        {/* Message Input */}
        <div className="space-y-2 mb-4">
          <Label htmlFor="edit-message" className="text-sm text-muted-foreground">
            Your Message
          </Label>
          <Textarea
            id="edit-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a message to your future self..."
            className="bg-muted/30 border-border/50 focus:border-primary min-h-[100px]"
          />
        </div>

        {/* Unlock Date & Time */}
        <div className="space-y-2 mb-4">
          <Label className="text-sm text-muted-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Set Release Date & Time
          </Label>
          <div className="grid grid-cols-2 gap-3">
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
        </div>

        {/* File Upload Options */}
        <div className="space-y-2 mb-4">
          <Label className="text-sm text-muted-foreground">Update Files (Optional)</Label>
          
          {/* Image Upload */}
          <div className="border-2 border-dashed border-border/50 rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewImage(e.target.files?.[0] || null)}
              className="hidden"
              id="edit-image-upload"
            />
            <label htmlFor="edit-image-upload" className="cursor-pointer block">
              <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {newImage ? newImage.name : "Upload new image (optional)"}
              </p>
            </label>
            {newImage && (
              <button
                onClick={() => setNewImage(null)}
                className="mt-2 text-xs text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            )}
          </div>
        </div>

        {/* Update Button */}
        <Button
          variant="hero"
          size="lg"
          className="w-full"
          onClick={handleUpdate}
          disabled={loading}
        >
          <Lock className="w-4 h-4 mr-2" />
          {loading ? "Updating..." : "Update Time Capsule"}
        </Button>
      </div>
    </div>
  );
};

export default EditCapsuleModal;