import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProfileDashboard from "@/components/profile/ProfileDashboard";
import Footer from "@/components/Footer";

const Profile = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader />
      <main className="container-narrow py-8">
        <ProfileDashboard />
      </main>
      <Footer />
    </div>
  );
};

export default Profile;