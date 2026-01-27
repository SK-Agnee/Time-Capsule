import { Clock, Calendar, Archive, Sparkles } from "lucide-react";

const stats = [
  {
    icon: Archive,
    value: "47",
    label: "Capsules Waiting",
    description: "Sealed memories across time",
  },
  {
    icon: Clock,
    value: "9 days",
    label: "Next Unlock",
    description: "Birthday Wishes from Friends",
  },
  {
    icon: Calendar,
    value: "4 years",
    label: "Memories Spanning",
    description: "From 2021 to 2025",
  },
  {
    icon: Sparkles,
    value: "23",
    label: "Capsules Opened",
    description: "Moments rediscovered",
  },
];

const Statistics = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[400px] rounded-full bg-primary/5 blur-3xl rotate-12" />
      </div>

      <div className="container-narrow relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif">
            Your <span className="text-gradient">Journey</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            A quiet reflection of moments preserved and waiting
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="group relative bg-card/30 backdrop-blur-sm rounded-2xl p-6 border border-border/30 hover:border-primary/30 transition-all duration-500 text-center"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>

              {/* Value */}
              <div className="text-3xl md:text-4xl font-serif text-gradient mb-2">
                {stat.value}
              </div>

              {/* Label */}
              <div className="text-foreground font-medium mb-1">{stat.label}</div>

              {/* Description */}
              <div className="text-sm text-muted-foreground">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
