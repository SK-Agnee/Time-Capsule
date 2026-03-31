import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import Footer from "@/components/Footer";

interface Capsule {
  _id: string;
  title: string;
  message: string;
  unlockDate: string;
  createdAt: string;
  image?: string;
  video?: string;
  audio?: string;
  viewed?: boolean;
}

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
}

const Dashboard = () => {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load user from localStorage once on mount
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("capsule_current_user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (e) {
          console.error("Error parsing user:", e);
        }
      }
    };
    loadUser();
  }, []);

  const fetchCapsules = useCallback(async () => {
    if (!user?._id) return;
    
    try {
      setIsLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/capsules/${user._id}`
      );

      const sortedCapsules = res.data.sort((a: Capsule, b: Capsule) => {
        const now = new Date();

        const aUnlocked =
          new Date(a.unlockDate).getTime() <= now.getTime();
        const bUnlocked =
          new Date(b.unlockDate).getTime() <= now.getTime();

        if (aUnlocked && !bUnlocked) return -1;
        if (!aUnlocked && bUnlocked) return 1;

        return (
          new Date(a.unlockDate).getTime() -
          new Date(b.unlockDate).getTime()
        );
      });
      
      setCapsules(sortedCapsules);
    } catch (err) {
      console.error("Error fetching capsules:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user?._id]);

  const handleDataChange = useCallback(() => {
    fetchCapsules();
    setRefreshKey(prev => prev + 1);
  }, [fetchCapsules]);

  useEffect(() => {
    if (user?._id) {
      fetchCapsules();
    }
  }, [user?._id, fetchCapsules]);

  useEffect(() => {
    const handleCapsuleChange = () => {
      fetchCapsules();
    };

    window.addEventListener('capsuleUnlocked', handleCapsuleChange);
    window.addEventListener('capsuleCreated', handleCapsuleChange);
    window.addEventListener('capsuleUpdated', handleCapsuleChange);
    window.addEventListener('capsuleDeleted', handleCapsuleChange);
    window.addEventListener('capsuleViewed', handleCapsuleChange);
    
    return () => {
      window.removeEventListener('capsuleUnlocked', handleCapsuleChange);
      window.removeEventListener('capsuleCreated', handleCapsuleChange);
      window.removeEventListener('capsuleUpdated', handleCapsuleChange);
      window.removeEventListener('capsuleDeleted', handleCapsuleChange);
      window.removeEventListener('capsuleViewed', handleCapsuleChange);
    };
  }, [fetchCapsules]);

  useEffect(() => {
  const handleUserUpdate = (event: CustomEvent) => {
    if (event.detail?.user) {
      const currentStoredUser = localStorage.getItem("capsule_current_user");
      if (currentStoredUser) {
        const parsedUser = JSON.parse(currentStoredUser);
        // Only update if it's the same user
        if (parsedUser._id === event.detail.user._id) {
          setUser(event.detail.user);
        }
      }
    }
  };

  window.addEventListener('userUpdated', handleUserUpdate as EventListener);
  return () => {
    window.removeEventListener('userUpdated', handleUserUpdate as EventListener);
  };
}, []);

  const now = new Date();
  const upcomingCapsules = capsules.filter(
    (c) => new Date(c.unlockDate).getTime() > now.getTime()
  );
  const unlockedCapsules = capsules.filter(
    (c) => new Date(c.unlockDate).getTime() <= now.getTime() && c.viewed
  );

  if (isLoading && capsules.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <DashboardHeader />
        <main className="container-narrow py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading your capsules...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader />
      
      <main className="container-narrow py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-2">
            Welcome back, <span className="text-gradient">{user?.name || "User"}</span>
          </h1>
          <p className="text-muted-foreground">
            You have <span className="text-primary font-medium">{upcomingCapsules.length}</span> capsule{upcomingCapsules.length !== 1 ? 's' : ''} waiting to be opened and{" "}
            <span className="text-primary font-medium">{unlockedCapsules.length}</span> unlocked capsule{unlockedCapsules.length !== 1 ? 's' : ''}.
          </p>
        </div>

        <DashboardTabs
          key={refreshKey}
          capsules={capsules}
          onCapsuleCreated={handleDataChange}
          onCapsuleDeleted={handleDataChange}
          openCapsuleId={undefined}
          onCapsuleOpened={undefined}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;