import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import CreateCapsule from "@/components/dashboard/CreateCapsule";
import MyCapsules from "@/components/dashboard/MyCapsules";
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

const Dashboard = () => {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [userName, setUserName] = useState("User");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchCapsules = useCallback(async () => {
    try {
      setIsLoading(true);
      const user = JSON.parse(localStorage.getItem("capsule_current_user") || "{}");
      if (!user?._id) return;

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
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh function to be passed to child components
  const handleDataChange = useCallback(async () => {
    await fetchCapsules();
    setRefreshKey(prev => prev + 1);
  }, [fetchCapsules]);

  useEffect(() => {
    const currentUser = localStorage.getItem("capsule_current_user");
    if (currentUser) {
      const user = JSON.parse(currentUser);
      setUserName(user.name || "User");
    }

    fetchCapsules();
  }, [fetchCapsules]);

  // Listen for capsule events
  useEffect(() => {
    const handleCapsuleChange = () => {
      fetchCapsules();
    };

    window.addEventListener('capsuleUnlocked', handleCapsuleChange);
    window.addEventListener('capsuleCreated', handleCapsuleChange);
    window.addEventListener('capsuleUpdated', handleCapsuleChange);
    window.addEventListener('capsuleDeleted', handleCapsuleChange);
    window.addEventListener('capsuleViewed', handleCapsuleChange); // Add this line
    
    return () => {
      window.removeEventListener('capsuleUnlocked', handleCapsuleChange);
      window.removeEventListener('capsuleCreated', handleCapsuleChange);
      window.removeEventListener('capsuleUpdated', handleCapsuleChange);
      window.removeEventListener('capsuleDeleted', handleCapsuleChange);
      window.removeEventListener('capsuleViewed', handleCapsuleChange); // Add this line
    };
  }, [fetchCapsules]);

  // Calculate actual counts - these will update whenever capsules changes
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-2">
            Welcome back, <span className="text-gradient">{userName}</span>
          </h1>
          <p className="text-muted-foreground">
            You have <span className="text-primary font-medium">{upcomingCapsules.length}</span> capsule{upcomingCapsules.length !== 1 ? 's' : ''} waiting to be opened and{" "}
            <span className="text-primary font-medium">{unlockedCapsules.length}</span> unlocked capsule{unlockedCapsules.length !== 1 ? 's' : ''}.
          </p>
        </div>

        {/* Dashboard Content */}
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