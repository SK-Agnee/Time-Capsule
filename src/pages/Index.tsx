import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import CapsuleFeed from "@/components/CapsuleFeed";
import Statistics from "@/components/Statistics";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <CapsuleFeed />
        <Statistics />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
