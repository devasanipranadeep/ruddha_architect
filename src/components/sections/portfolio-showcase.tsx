import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Reveal, SectionLabel } from "@/components/animations/reveal";
import { api, type Project } from "@/lib/api";
import { cn } from "@/lib/utils";

export function PortfolioShowcase() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects:", error);
      // Fallback to static data if backend is not available
      const { PROJECTS } = require("@/data/site");
      setProjects(PROJECTS);
    } finally {
      setLoading(false);
    }
  };

  const featured = projects.slice(0, 6);

  if (loading) {
    return (
      <section className="relative py-32 lg:py-44">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="text-center">Loading projects...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-32 lg:py-44">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Reveal><SectionLabel>Selected work</SectionLabel></Reveal>
            <Reveal delay={100}>
              <h2 className="mt-6 font-display text-5xl lg:text-7xl leading-[1.05] max-w-3xl">
                Quiet projects, <span className="italic text-gradient-gold">long-lived.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={200}>
            <Link
              to="/portfolio"
              className="text-[11px] uppercase tracking-wider-2 text-gold border border-gold/40 px-6 py-3 hover:bg-gold hover:text-primary-foreground transition-colors"
            >
              View all projects
            </Link>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featured.map((p, i) => (
            <Reveal
              key={p.id}
              delay={i * 80}
            >
              <Link
                to="/portfolio/$slug"
                params={{ slug: p.slug }}
                className="group block relative image-zoom h-full"
                data-cursor="hover"
              >
                <div className="relative overflow-hidden h-[420px]">
                  <img
                    src={p.cover_image || (p as any).image}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-90" />
                  <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-luxury text-gold">
                      <span>{p.category}</span>
                      <span>{p.year}</span>
                    </div>
                    <h3 className="mt-3 font-display text-3xl lg:text-4xl">{p.title}</h3>
                    <div className="mt-2 text-xs text-foreground/60">{p.location}</div>
                    <div className="mt-5 inline-flex items-center gap-2 text-[10px] uppercase tracking-wider-2 text-foreground/80 opacity-0 -translate-x-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
                      View project →
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
