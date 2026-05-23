import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useCountUp } from "@/hooks/use-count-up";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

function Stat({ n, suffix, label, delay }: { n: number; suffix: string; label: string; delay: number }) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  const v = useCountUp(n, visible);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
    >
      <div className="font-display text-4xl md:text-6xl lg:text-8xl text-gradient-gold leading-none">
        {v}
        {suffix}
      </div>
      <div className="mt-4 text-[10px] uppercase tracking-luxury text-muted-foreground">{label}</div>
    </div>
  );
}

export function Stats() {
  const [stats, setStats] = useState([
    { n: 142, suffix: "+", label: "Projects Delivered" },
    { n: 18, suffix: "", label: "Years of Practice" },
    { n: 27, suffix: "", label: "Design Awards" },
    { n: 96, suffix: "%", label: "Client Satisfaction" },
  ]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await api.getStats();
        setStats([
          { n: data.projects_delivered, suffix: "+", label: "Projects Delivered" },
          { n: data.years_of_practice, suffix: "", label: "Years of Practice" },
          { n: data.design_awards, suffix: "", label: "Design Awards" },
          { n: data.repeat_clients, suffix: "%", label: "Client Satisfaction" },
        ]);
      } catch (error) {
        console.error("Failed to load stats:", error);
      }
    };
    loadStats();
  }, []);

  const visibleStats = stats.filter(s => s.n > 0);

  if (visibleStats.length === 0) {
    return null;
  }

  return (
    <section className="relative border-y border-border bg-charcoal/40 py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className={`grid grid-cols-2 gap-8 lg:gap-8 ${visibleStats.length === 1 ? 'sm:grid-cols-1' : visibleStats.length === 2 ? 'sm:grid-cols-2' : visibleStats.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}>
          {visibleStats.map((s, i) => (
            <Stat key={s.label} {...s} delay={i * 120} />
          ))}
        </div>
      </div>
    </section>
  );
}
