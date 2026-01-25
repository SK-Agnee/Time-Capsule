import { Pen, Calendar, Clock, Unlock, Heart } from "lucide-react";

const steps = [
  {
    icon: Pen,
    title: "Create",
    description: "Write a letter to your future self, upload cherished photos, or record a voice message. Pour your heart into something that matters.",
    accent: "from-primary to-accent",
  },
  {
    icon: Calendar,
    title: "Choose a Date",
    description: "Pick when your capsule should unlock. A birthday, an anniversary, or just a random day years from now when you'll need a reminder.",
    accent: "from-secondary to-primary",
  },
  {
    icon: Clock,
    title: "Wait",
    description: "Time passes. Life happens. Your capsule waits patiently, sealed and secure, counting down to its moment.",
    accent: "from-accent to-secondary",
  },
  {
    icon: Unlock,
    title: "Unlock",
    description: "The day arrives. A gentle notification. A moment of anticipation. Then, the capsule opens, releasing memories preserved in time.",
    accent: "from-primary to-secondary",
  },
  {
    icon: Heart,
    title: "Remember",
    description: "Experience the joy of reconnecting with a past version of yourself. Laugh, cry, or simply smile at how far you've come.",
    accent: "from-secondary to-accent",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="section-padding relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container-narrow relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Five simple steps to preserve what matters most
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />

          {/* Steps */}
          <div className="space-y-16 md:space-y-24">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className={`relative flex flex-col md:flex-row items-start gap-8 ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Icon Circle */}
                <div className="relative z-10 flex-shrink-0 ml-0 md:ml-0 md:absolute md:left-1/2 md:-translate-x-1/2">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.accent} p-[2px] glow-amber`}>
                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={`flex-1 pl-12 md:pl-0 ${index % 2 === 0 ? "md:pr-20 md:text-right" : "md:pl-20"}`}>
                  <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-all duration-500 hover:glow-amber">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest font-sans">Step {index + 1}</span>
                    <h3 className="text-2xl md:text-3xl font-serif mt-2 mb-3">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
