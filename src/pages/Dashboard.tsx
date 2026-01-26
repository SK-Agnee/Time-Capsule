import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import Footer from "@/components/Footer";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader />
      
      <main className="container-narrow py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-2">
            Welcome back, <span className="text-gradient">Alex</span>
          </h1>
          <p className="text-muted-foreground">
            You have <span className="text-primary font-medium">3 capsules</span> waiting to be opened and{" "}
            <span className="text-primary font-medium">12 memories</span> sealed for the future.
          </p>
        </div>

        {/* Dashboard Content */}
        <DashboardTabs />
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
