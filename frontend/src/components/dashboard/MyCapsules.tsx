<<<<<<< Updated upstream
import { Clock, Lock, Unlock, Diamond, Trash2, Edit2, Calendar as CalendarIcon, ChevronDown, Check, ArrowUp, ArrowDown } from "lucide-react";
=======
import { Clock, Lock, Unlock, Diamond, Trash2 } from "lucide-react";
>>>>>>> Stashed changes
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
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

<<<<<<< Updated upstream
type SortField = "unlockDate" | "createdAt";
type SortOrder = "asc" | "desc";

const getStatusStyles = (status: string) => {
=======
const getStatusStyles = (status) => {
>>>>>>> Stashed changes
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

const getStatusIcon = (status: string) => {
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

<<<<<<< Updated upstream
const getCountdown = (diff: number) => {
=======
const getCountdown = (diff) => {
>>>>>>> Stashed changes
  if (diff <= 0) return "Unlocked";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

  return `${days}d ${hours}h left`;
};

<<<<<<< Updated upstream
// Sort Dropdown Component with simple up/down arrows
const SortDropdown = ({ field, order, onFieldChange, onOrderChange }: {
  field: SortField;
  order: SortOrder;
  onFieldChange: (field: SortField) => void;
  onOrderChange: (order: SortOrder) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getFieldLabel = (f: SortField) => {
    return f === "unlockDate" ? "Unlock Date" : "Created Date";
  };

  const handleFieldSelect = (newField: SortField) => {
    onFieldChange(newField);
  };

  const toggleOrder = () => {
    onOrderChange(order === "asc" ? "desc" : "asc");
  };

  return (
    <div className="relative sort-dropdown" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-muted/30 hover:bg-muted/50 rounded-lg border border-border/50 transition-all"
      >
        <span className="text-muted-foreground">Sort by:</span>
        <span className="font-medium text-foreground">{getFieldLabel(field)}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleOrder();
          }}
          className="p-0.5 hover:bg-muted/50 rounded-md transition-colors"
        >
          {order === "asc" ? (
            <ArrowUp className="w-4 h-4 text-primary" />
          ) : (
            <ArrowDown className="w-4 h-4 text-primary" />
          )}
        </button>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-popover rounded-lg shadow-lg border border-border z-50 overflow-hidden">
          <div className="p-2">
            <p className="text-xs font-medium text-muted-foreground px-2 py-1 mb-1">Sort By</p>
            <div className="space-y-1">
              <button
                onClick={() => handleFieldSelect("unlockDate")}
                className={cn(
                  "w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-md transition-all",
                  field === "unlockDate"
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted/50 text-foreground"
                )}
              >
                <span>Unlock Date</span>
                {field === "unlockDate" && <Check className="w-4 h-4" />}
              </button>
              <button
                onClick={() => handleFieldSelect("createdAt")}
                className={cn(
                  "w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-md transition-all",
                  field === "createdAt"
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted/50 text-foreground"
                )}
              >
                <span>Created Date</span>
                {field === "createdAt" && <Check className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MyCapsules = ({ 
  capsules: initialCapsules, 
  onCapsuleDeleted, 
  openCapsuleId = null, 
  onCapsuleOpened = () => {} 
}: { 
  capsules: Capsule[], 
  onCapsuleDeleted?: () => void,
  openCapsuleId?: string | null,
  onCapsuleOpened?: () => void
}) => {
=======
const MyCapsules = ({ capsules, onCapsuleDeleted }: { capsules: Capsule[], onCapsuleDeleted?: () => void }) => {
>>>>>>> Stashed changes
  const [time, setTime] = useState(Date.now());
  const [selectedCapsule, setSelectedCapsule] = useState<Capsule | null>(null);
  const [showModal, setShowModal] = useState(false);
<<<<<<< Updated upstream
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCapsule, setEditingCapsule] = useState<Capsule | null>(null);
  const [localCapsules, setLocalCapsules] = useState<Capsule[]>(initialCapsules);
  const [isLoading, setIsLoading] = useState(false);
  
  // Sorting states
  const [upcomingSortField, setUpcomingSortField] = useState<SortField>("unlockDate");
  const [upcomingSortOrder, setUpcomingSortOrder] = useState<SortOrder>("asc");
  const [unlockedSortField, setUnlockedSortField] = useState<SortField>("unlockDate");
  const [unlockedSortOrder, setUnlockedSortOrder] = useState<SortOrder>("asc");
  
  // Edit form states
  const [editTitle, setEditTitle] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [editUnlockDate, setEditUnlockDate] = useState<Date | undefined>();
  const [editUnlockTime, setEditUnlockTime] = useState("12:00");
  const [editLoading, setEditLoading] = useState(false);
  const [dateError, setDateError] = useState<string>("");
  
  // Fetch fresh data from database
  const fetchCapsules = async () => {
    try {
      setIsLoading(true);
      const user = JSON.parse(localStorage.getItem("capsule_current_user") || "{}");
      if (user?._id) {
        const response = await axios.get(`http://localhost:5000/api/capsules/${user._id}`);
        setLocalCapsules(response.data);
      }
    } catch (err) {
      console.error("Error fetching capsules:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchCapsules();
  }, []);

  // Update local capsules when initialCapsules prop changes
  useEffect(() => {
    if (initialCapsules.length > 0) {
      setLocalCapsules(initialCapsules);
    }
  }, [initialCapsules]);

  // Timer for countdown updates
=======
  const [localCapsules, setLocalCapsules] = useState<Capsule[]>(capsules);
  
  useEffect(() => {
    setLocalCapsules(capsules);
  }, [capsules]);

>>>>>>> Stashed changes
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

<<<<<<< Updated upstream
  // Open capsule when openCapsuleId is set
  useEffect(() => {
    if (openCapsuleId && localCapsules.length > 0) {
      const capsuleToOpen = localCapsules.find(c => c._id === openCapsuleId);
      if (capsuleToOpen) {
        setSelectedCapsule(capsuleToOpen);
        setShowModal(true);
        onCapsuleOpened();
      }
    }
  }, [openCapsuleId, localCapsules, onCapsuleOpened]);

  const upcomingCapsulesRaw = localCapsules.filter(
    (c) => new Date(c.unlockDate).getTime() > time || !c.viewed
  );

  const unlockedCapsulesRaw = localCapsules.filter(
    (c) => new Date(c.unlockDate).getTime() <= time && c.viewed
  );

  // Sort function
  const sortCapsules = (capsules: Capsule[], field: SortField, order: SortOrder): Capsule[] => {
    return [...capsules].sort((a, b) => {
      let aValue: number, bValue: number;
      
      if (field === "unlockDate") {
        aValue = new Date(a.unlockDate).getTime();
        bValue = new Date(b.unlockDate).getTime();
      } else {
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
      }
      
      if (order === "asc") {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
  };

  // Apply sorting to capsules
  const upcomingCapsules = sortCapsules(upcomingCapsulesRaw, upcomingSortField, upcomingSortOrder);
  const unlockedCapsules = sortCapsules(unlockedCapsulesRaw, unlockedSortField, unlockedSortOrder);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
=======
  const upcomingCapsules = localCapsules.filter(
    (c) =>
      new Date(c.unlockDate).getTime() > time || !c.viewed
  );

  const unlockedCapsules = localCapsules.filter(
    (c) =>
      new Date(c.unlockDate).getTime() <= time && c.viewed
  );

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevents opening modal
>>>>>>> Stashed changes
    
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this capsule?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/capsules/${id}`);
      
<<<<<<< Updated upstream
      window.dispatchEvent(new CustomEvent('capsuleDeleted'));
      await fetchCapsules();
      
=======
      // Update local state to remove deleted capsule
      setLocalCapsules(prev => prev.filter(c => c._id !== id));
      
      // Close modal if the deleted capsule was open
>>>>>>> Stashed changes
      if (selectedCapsule?._id === id) {
        setShowModal(false);
        setSelectedCapsule(null);
      }
      
<<<<<<< Updated upstream
=======
      // Call the callback if provided
>>>>>>> Stashed changes
      if (onCapsuleDeleted) {
        onCapsuleDeleted();
      }
      
    } catch (err) {
      console.error(err);
      alert("Error deleting capsule");
    }
  };

<<<<<<< Updated upstream
  const handleEdit = (c: Capsule, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCapsule(c);
    setEditTitle(c.title);
    setEditMessage(c.message);
    const date = new Date(c.unlockDate);
    setEditUnlockDate(date);
    setEditUnlockTime(format(date, "HH:mm"));
    setDateError("");
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!editingCapsule) return;

    if (!editTitle.trim()) {
      alert("Title is required");
      return;
    }

    let finalDate = editUnlockDate ? new Date(editUnlockDate) : new Date();
    if (editUnlockTime) {
      const [hours, minutes] = editUnlockTime.split(":");
      finalDate.setHours(Number(hours));
      finalDate.setMinutes(Number(minutes));
      finalDate.setSeconds(0);
    }

    const currentUnlockDate = new Date(editingCapsule.unlockDate);
    const now = new Date();
    const minAllowed = new Date(now.getTime() + 60000);
    const isSameDateTime = finalDate.getTime() === currentUnlockDate.getTime();
    
    if (isSameDateTime) {
      setEditLoading(true);
      setDateError("");
      
      try {
        const formData = new FormData();
        formData.append("title", editTitle);
        formData.append("message", editMessage);
        formData.append("unlockDate", finalDate.toISOString());

        await axios.put(`http://localhost:5000/api/capsules/${editingCapsule._id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        alert("Capsule updated successfully!");
        window.dispatchEvent(new CustomEvent('capsuleUpdated'));
        await fetchCapsules();
        setShowEditModal(false);
        setEditingCapsule(null);
      } catch (err: any) {
        console.error(err);
        alert(err.response?.data?.error || "Error updating capsule");
      } finally {
        setEditLoading(false);
      }
      return;
    }
    
    if (finalDate.getTime() <= minAllowed.getTime()) {
      setDateError(`Unlock date must be at least 1 minute in the future. Current time: ${format(now, "h:mm a")}`);
      return;
    }
    
    if (finalDate.getTime() <= currentUnlockDate.getTime()) {
      setDateError(`❌ New unlock date must be AFTER ${format(currentUnlockDate, "MMM d, yyyy 'at' h:mm a")}. You can only move the date forward.`);
      return;
    }

    setEditLoading(true);
    setDateError("");
    
    try {
      const formData = new FormData();
      formData.append("title", editTitle);
      formData.append("message", editMessage);
      formData.append("unlockDate", finalDate.toISOString());

      await axios.put(`http://localhost:5000/api/capsules/${editingCapsule._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Capsule updated successfully!");
      window.dispatchEvent(new CustomEvent('capsuleUpdated'));
      await fetchCapsules();
      setShowEditModal(false);
      setEditingCapsule(null);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || "Error updating capsule");
    } finally {
      setEditLoading(false);
    }
  };

  const isDateDisabled = (date: Date) => {
    if (!editingCapsule) return true;
    
    const currentUnlockDate = new Date(editingCapsule.unlockDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateToCheck = new Date(date);
    dateToCheck.setHours(0, 0, 0, 0);
    const currentDateStart = new Date(currentUnlockDate);
    currentDateStart.setHours(0, 0, 0, 0);
    
    if (dateToCheck.getTime() === currentDateStart.getTime()) {
      return false;
    }
    if (dateToCheck.getTime() < today.getTime()) {
      return true;
    }
    if (dateToCheck.getTime() < currentDateStart.getTime()) {
      return true;
    }
    return false;
  };

  const isTimeValid = (selectedDate: Date | undefined, timeStr: string, currentUnlockDate: Date) => {
    if (!selectedDate) return true;
    
    const [hours, minutes] = timeStr.split(":");
    const newDateTime = new Date(selectedDate);
    newDateTime.setHours(Number(hours));
    newDateTime.setMinutes(Number(minutes));
    newDateTime.setSeconds(0);
    const currentDateTime = new Date(currentUnlockDate);
    const now = new Date();
    const minAllowed = new Date(now.getTime() + 60000);
    
    if (newDateTime.getTime() === currentDateTime.getTime()) {
      return true;
    }
    if (newDateTime.toDateString() === currentDateTime.toDateString()) {
      if (newDateTime.getTime() <= currentDateTime.getTime()) {
        return false;
      }
    }
    if (newDateTime.getTime() <= minAllowed.getTime()) {
      return false;
    }
    return true;
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setEditUnlockTime(newTime);
    
    if (editUnlockDate && editingCapsule) {
      const currentUnlockDate = new Date(editingCapsule.unlockDate);
      const isValid = isTimeValid(editUnlockDate, newTime, currentUnlockDate);
      if (!isValid) {
        setDateError("Selected time must be after the current unlock time and at least 1 minute in the future");
      } else {
        setDateError("");
      }
    }
  };

  if (isLoading && localCapsules.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your capsules...</p>
        </div>
      </div>
    );
  }

=======
>>>>>>> Stashed changes
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Capsules List */}
      <Card className="lg:col-span-2 bg-card/50 border-border/30 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
          <CardTitle className="text-xl font-serif flex items-center gap-2">
            <Diamond className="w-5 h-5 text-primary" />
            Upcoming Capsules
          </CardTitle>
          <SortDropdown
            field={upcomingSortField}
            order={upcomingSortOrder}
            onFieldChange={setUpcomingSortField}
            onOrderChange={setUpcomingSortOrder}
          />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingCapsules.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No upcoming capsules. Create one to get started!
              </p>
            ) : (
              upcomingCapsules.map((c) => {
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
                    key={c._id}
                    onClick={async () => {
                      setSelectedCapsule(c);
                      setShowModal(true);

                      const isUnlocked = new Date(c.unlockDate).getTime() <= Date.now();

<<<<<<< Updated upstream
                      if (isUnlocked && !c.viewed) {
                        await axios.put(`http://localhost:5000/api/capsules/view/${c._id}`);
                        // Dispatch event to notify dashboard that a capsule was viewed
                        window.dispatchEvent(new CustomEvent('capsuleViewed'));
                        await fetchCapsules();
                      }
                    }}
                    className={`p-4 rounded-lg border transition-all hover:border-primary/50 cursor-pointer ${getStatusStyles(status)}`}
                  >
                    <div className="mb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(status)}
                          <span className="font-medium text-foreground">{c.title}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {status === "locked" && (
                            <button
                              onClick={(e) => handleEdit(c, e)}
                              className="text-blue-400 hover:text-blue-300 transition-colors p-1"
                              title="Edit capsule"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={(e) => handleDelete(c._id, e)}
                            className="text-red-400 hover:text-red-300 transition-colors p-1"
                            title="Delete capsule"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
                      </div>
=======
                    if (isUnlocked && !c.viewed) {
                      await axios.put(`http://localhost:5000/api/capsules/view/${c._id}`);
                      // Update local state to mark as viewed
                      setLocalCapsules(prev => prev.map(capsule => 
                        capsule._id === c._id ? { ...capsule, viewed: true } : capsule
                      ));
                    }
                  }}
                  className={`p-4 rounded-lg border transition-all hover:border-primary/50 cursor-pointer ${getStatusStyles(status)}`}
                >
                  <div className="mb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(status)}
                        <span className="font-medium text-foreground">{c.title}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* DELETE BUTTON */}
                        <button
                          onClick={(e) => handleDelete(c._id, e)}
                          className="text-red-400 hover:text-red-300 transition-colors p-1"
                          title="Delete capsule"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        {/* UNLOCK BADGE */}
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
                    </div>
>>>>>>> Stashed changes

                      <p className="text-sm mt-1 text-muted-foreground">
                        {unlockDate.getTime() > time
                          ? `🔓 Unlocks on ${format(unlockDate, "MMM d, yyyy 'at' h:mm a")}`
                          : c.message}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>{createdYear}</span>
                        <span className="text-primary">→</span>
                        <span className="text-primary font-medium">{unlockYear}</span>
                      </div>

                      {status === "locked" && (
                        <p className="text-xs text-primary mt-1">
                          {countdown}
                        </p>
                      )}
                    </div>
                    <Progress value={progress} className="h-1.5" />
                  </div>
                );
              })
            )}
          </div>

<<<<<<< Updated upstream
          {upcomingCapsules.length > 0 && (
            <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Diamond className="w-4 h-4 text-primary" />
                <span>{upcomingCapsules.length} capsule{upcomingCapsules.length !== 1 ? 's' : ''} remaining</span>
              </div>
              <span>{new Date().getFullYear()}</span>
=======
          {/* Progress indicator */}
          <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Diamond className="w-4 h-4 text-primary" />
              <span>{upcomingCapsules.length} of {localCapsules.length}</span>
>>>>>>> Stashed changes
            </div>
          )}
        </CardContent>
      </Card>

      {/* Unlocked Capsules */}
      <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
          <CardTitle className="text-lg font-serif flex items-center gap-2">
            <Unlock className="w-5 h-5 text-accent" />
            Unlocked Capsules
          </CardTitle>
          <SortDropdown
            field={unlockedSortField}
            order={unlockedSortOrder}
            onFieldChange={setUnlockedSortField}
            onOrderChange={setUnlockedSortOrder}
          />
        </CardHeader>
        <CardContent className="space-y-4">
          {unlockedCapsules.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No unlocked capsules yet
            </p>
          ) : (
            unlockedCapsules.map((c) => (
              <div
                key={c._id}
                onClick={() => {
                  setSelectedCapsule(c);
                  setShowModal(true);
                }}
<<<<<<< Updated upstream
                className="p-4 rounded-lg bg-muted/30 border border-border/30 cursor-pointer hover:border-primary/50 group transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {c.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Created: {format(new Date(c.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
=======
                className="p-4 rounded-lg bg-muted/30 border border-border/30 cursor-pointer hover:border-primary/50 group"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">
                    {c.title}
                  </p>
                  
                  {/* DELETE BUTTON */}
>>>>>>> Stashed changes
                  <button
                    onClick={(e) => handleDelete(c._id, e)}
                    className="text-red-400 hover:text-red-300 transition-colors p-1 opacity-0 group-hover:opacity-100"
                    title="Delete capsule"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
<<<<<<< Updated upstream
                <p className="text-xs text-muted-foreground mt-1">
                  Unlocked on {format(new Date(c.unlockDate), "MMM d, yyyy")}
=======

                <p className="text-xs text-muted-foreground mt-1">
                  Click to view
>>>>>>> Stashed changes
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
      
<<<<<<< Updated upstream
      {/* View Modal */}
      {selectedCapsule && showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div
            className={`bg-card p-6 rounded-xl max-w-md w-full relative transform transition-all duration-300 scale-100 opacity-100 max-h-[90vh] overflow-y-auto`}
            onClick={(e) => e.stopPropagation()}
          >
=======
      {selectedCapsule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className={`bg-card p-6 rounded-xl max-w-md w-full relative transform transition-all duration-300 ${
              showModal ? "scale-100 opacity-100" : "scale-90 opacity-0"
            }`}
          >
            {/* Close Button */}
>>>>>>> Stashed changes
            <button
              className="absolute top-2 right-3 text-lg hover:text-red-400 transition-colors"
              onClick={() => {
                setShowModal(false);
                setTimeout(() => setSelectedCapsule(null), 200);
              }}
            >
              ✖
            </button>

<<<<<<< Updated upstream
            <h2 className="text-xl font-semibold mb-2 pr-6">
              {selectedCapsule.title}
            </h2>

            <p className="text-sm text-muted-foreground mb-4">
              {new Date(selectedCapsule.unlockDate).getTime() > Date.now() 
                ? `Unlocks on ${new Date(selectedCapsule.unlockDate).toLocaleString()}`
                : `Unlocked on ${new Date(selectedCapsule.unlockDate).toLocaleString()}`
              }
            </p>

            <div className="bg-muted p-4 rounded-md space-y-3">
              {new Date(selectedCapsule.unlockDate).getTime() > Date.now() ? (
                <div className="text-center py-4">
                  <Lock className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">🔒 This capsule is still locked</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Check back on {new Date(selectedCapsule.unlockDate).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <>
                  <div className="whitespace-pre-wrap">
                    <p className="font-medium mb-2">Message:</p>
                    <p className="text-muted-foreground">{selectedCapsule.message}</p>
                  </div>

                  {selectedCapsule.image && (
                    <div>
                      <p className="font-medium mb-2">Image:</p>
                      <img
                        src={`http://localhost:5000/${selectedCapsule.image}`}
                        alt="capsule"
                        className="rounded-lg max-h-60 w-full object-cover"
                      />
                    </div>
                  )}
                  {selectedCapsule.video && (
                    <div>
                      <p className="font-medium mb-2">Video:</p>
                      <video
                        controls
                        className="rounded-lg max-h-60 w-full"
                      >
                        <source
                          src={`http://localhost:5000/${selectedCapsule.video}`}
                          type="video/mp4"
                        />
                      </video>
                    </div>
                  )}
                  {selectedCapsule.audio && (
                    <div>
                      <p className="font-medium mb-2">Audio:</p>
                      <audio controls className="w-full">
                        <source
                          src={`http://localhost:5000/${selectedCapsule.audio}`}
                          type="audio/mpeg"
                        />
                      </audio>
                    </div>
=======
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
            <div className="bg-muted p-4 rounded-md space-y-3">
              {new Date(selectedCapsule.unlockDate).getTime() > Date.now() ? (
                "🔒 This capsule is still locked"
              ) : (
                <>
                  {/* Message */}
                  <p>{selectedCapsule.message}</p>

                  {/* Image */}
                  {selectedCapsule.image && (
                    <img
                      src={`http://localhost:5000/${selectedCapsule.image}`}
                      alt="capsule"
                      className="rounded-lg max-h-60 w-full object-cover"
                    />
                  )}
                  {selectedCapsule.video && (
                    <video
                      controls
                      className="rounded-lg max-h-60 w-full"
                    >
                      <source
                        src={`http://localhost:5000/${selectedCapsule.video}`}
                        type="video/mp4"
                      />
                    </video>
                  )}
                  {selectedCapsule.audio && (
                    <audio controls className="w-full">
                      <source
                        src={`http://localhost:5000/${selectedCapsule.audio}`}
                        type="audio/mpeg"
                      />
                    </audio>
>>>>>>> Stashed changes
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
<<<<<<< Updated upstream

      {/* Edit Modal */}
      {showEditModal && editingCapsule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowEditModal(false)}>
          <div 
            className="bg-card p-6 rounded-xl max-w-md w-full relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-3 text-lg hover:text-red-400 transition-colors"
              onClick={() => {
                setShowEditModal(false);
                setEditingCapsule(null);
              }}
            >
              ✖
            </button>

            <h2 className="text-xl font-semibold mb-4">Edit Time Capsule</h2>

            <div className="space-y-2 mb-4">
              <Label htmlFor="edit-title" className="text-sm text-muted-foreground">
                Capsule Title
              </Label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Name your time capsule..."
                className="bg-muted/30 border-border/50 focus:border-primary"
              />
            </div>

            <div className="space-y-2 mb-4">
              <Label htmlFor="edit-message" className="text-sm text-muted-foreground">
                Your Message
              </Label>
              <Textarea
                id="edit-message"
                value={editMessage}
                onChange={(e) => setEditMessage(e.target.value)}
                placeholder="Write a message to your future self..."
                className="bg-muted/30 border-border/50 focus:border-primary min-h-[100px]"
              />
            </div>

            <div className="space-y-2 mb-4">
              <Label className="text-sm text-muted-foreground flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Set Release Date & Time
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-muted/30 border-border/50 hover:border-primary",
                        !editUnlockDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editUnlockDate ? format(editUnlockDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={editUnlockDate}
                      onSelect={setEditUnlockDate}
                      disabled={isDateDisabled}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="time"
                    value={editUnlockTime}
                    onChange={handleTimeChange}
                    className="pl-10 bg-muted/30 border-border/50 focus:border-primary"
                  />
                </div>
              </div>
              
              <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
                <p className="text-xs text-muted-foreground">
                  Current unlock date:
                </p>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {format(new Date(editingCapsule.unlockDate), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
              
              <div className="mt-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                <p className="text-xs font-medium text-yellow-600 dark:text-yellow-400 mb-2">
                  ⚠️ Update Rules:
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>✓ You can keep the same date and time (no change)</li>
                  <li>• To move forward, new date must be at least 1 minute in the future</li>
                  <li>• New unlock date must be AFTER the current date if changed</li>
                  <li className="text-green-600 dark:text-green-400">✓ Example: Current date Mar 27 12:00 → You can keep same or select Mar 27 12:01 or later</li>
                </ul>
              </div>
              
              {dateError && (
                <p className="text-xs text-red-500 mt-2 p-2 bg-red-500/10 rounded-md border border-red-500/20">
                  ❌ {dateError}
                </p>
              )}
            </div>

            <Button
              variant="hero"
              size="lg"
              className="w-full"
              onClick={handleUpdate}
              disabled={editLoading}
            >
              <Lock className="w-4 h-4 mr-2" />
              {editLoading ? "Updating..." : "Update Time Capsule"}
            </Button>
          </div>
        </div>
      )}
=======
>>>>>>> Stashed changes
    </div>
  );
};

export default MyCapsules;