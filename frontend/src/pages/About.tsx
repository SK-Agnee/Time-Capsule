import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Clock, Heart, Shield, Users, Globe, Sparkles } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Memory Preservation",
    description: "We believe every moment matters. Our mission is to help you capture and protect the memories that define your story.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your memories are sacred. We use end-to-end encryption and strict privacy controls so only you decide who sees your capsules.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Time Capsule is built around connection — sharing memories with loved ones and discovering stories from people around the world.",
  },
  {
    icon: Globe,
    title: "For Everyone",
    description: "Whether it's a letter to your future self or a family archive spanning generations, Time Capsule is designed for all.",
  },
];

const team = [
  { name: "Elena Reyes", role: "Founder & CEO", initials: "ER" },
  { name: "Marcus Chen", role: "CTO", initials: "MC" },
  { name: "Aisha Patel", role: "Head of Design", initials: "AP" },
  { name: "David Kim", role: "Lead Engineer", initials: "DK" },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container-narrow text-center space-y-6 mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Our Story
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight">
            Preserving Moments That
            <br />
            <span className="text-primary">Matter Most</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Time Capsule was born from a simple idea: the most meaningful things in life deserve
            to be remembered, revisited, and shared across time.
          </p>
        </section>

        {/* Mission Section */}
        <section className="container-narrow mb-20">
          <div className="rounded-2xl bg-card/60 border border-border/30 p-8 md:p-12 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-serif font-semibold">Our Mission</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-3xl">
              We started Time Capsule in 2024 with a vision to bridge the gap between past and future.
              In a world of ephemeral content, we wanted to create a space where memories could be
              intentionally preserved — locked away and revealed at just the right moment.
            </p>
            <p className="text-muted-foreground leading-relaxed max-w-3xl">
              Today, thousands of users trust Time Capsule to hold their most cherished photos,
              letters, and milestones. From wedding vows opened on anniversaries to graduation
              messages revealed years later, every capsule tells a story worth waiting for.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="container-narrow mb-20">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">What We Stand For</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-xl bg-card/40 border border-border/30 p-6 space-y-3 hover:border-primary/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <value.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="container-narrow">
          <h2 className="text-3xl font-serif font-bold text-center mb-4">Meet the Team</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-lg mx-auto">
            A passionate group dedicated to helping the world remember what matters.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="text-center space-y-3">
                <div className="w-20 h-20 mx-auto rounded-full bg-primary/15 border-2 border-primary/30 flex items-center justify-center">
                  <span className="text-lg font-semibold text-primary">{member.initials}</span>
                </div>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
