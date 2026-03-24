import { useEffect, useState } from "react";
import axios from "axios";
import CreateCapsule from "@/components/dashboard/CreateCapsule";
import MyCapsules from "@/components/dashboard/MyCapsules";
import CapsuleFeed from "@/components/CapsuleFeed";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import Footer from "@/components/Footer";

const Dashboard = () => {
  const [capsules, setCapsules] = useState([]);
  const [userName, setUserName] = useState("User");
  const fetchCapsules = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("capsule_current_user") || "{}");
    if (!user?._id) return;

    const res = await axios.get(
      `http://localhost:5000/api/capsules/${user._id}`
    );

    setCapsules(
  res.data.sort((a, b) => {
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
  })
);
  } catch (err) {
    console.error(err);
  }
};

  useEffect(() => {
  const currentUser = localStorage.getItem("capsule_current_user");
  if (currentUser) {
    const user = JSON.parse(currentUser);
    setUserName(user.name || "User");
  }

  fetchCapsules(); // ✅ ADD THIS
}, []);

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
            You have <span className="text-primary font-medium">3 capsules</span> waiting to be opened and{" "}
            <span className="text-primary font-medium">12 memories</span> sealed for the future.
          </p>
        </div>

        {/* Dashboard Content */}
        <DashboardTabs
    capsules={capsules}
    onCapsuleCreated={fetchCapsules}
  />
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
