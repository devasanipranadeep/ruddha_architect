import { useMemo, useState, useEffect } from "react";
import { createFileRoute, Link, Outlet, useMatch } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES } from "@/data/site";
import { api, type Project } from "@/lib/api";
import { Reveal, SectionLabel } from "@/components/animations/reveal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Ruddhaa Architects & Interiors" },
      { name: "description", content: "Residential, commercial, interior, landscape and renovation projects by Ruddhaa." },
    ],
    links: [{ rel: "canonical", href: "/projects" }],
  }),
  component: ProjectsLayout,
});

function ProjectsLayout() {
  // Check if a child route (e.g. /projects/$slug) is active
  const childMatch = useMatch({ from: "/projects/$slug", shouldThrow: false });

  // If a child route is active, render only the child (project detail page)
  if (childMatch) {
    return <Outlet />;
  }

  // Otherwise render the projects grid
  return <ProjectsPage />;
}

function ProjectsPage() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
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

  const list = useMemo(
    () => (cat === "All" ? projects : projects.filter((p) => p.category === cat)),
    [cat, projects]
  );

  return (
    <>
      <section className="relative pt-44 pb-16 lg:pt-56 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
          <Reveal><SectionLabel>Selected work</SectionLabel></Reveal>
          <Reveal delay={100}>
            <h1 className="mt-6 font-display text-6xl md:text-8xl lg:text-9xl leading-[0.95] max-w-5xl">
              Projects
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="pb-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="flex flex-wrap gap-3 border-b border-border pb-8">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn(
                  "px-4 py-2 text-[10px] uppercase tracking-wider-2 border transition-all duration-300",
                  cat === c
                    ? "border-gold text-gold bg-gold/10"
                    : "border-border text-foreground/60 hover:text-gold hover:border-gold/40"
                )}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <AnimatePresence mode="popLayout">
              {list.map((p, i) => (
                <motion.div
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    to="/projects/$slug"
                    params={{ slug: p.slug }}
                    className="group block image-zoom h-full"
                    data-cursor="hover"
                  >
                    <div className="relative overflow-hidden h-[420px]">
                      <img src={p.cover_image} alt={p.title} loading="lazy" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-90" />
                      <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
                        <div className="flex items-center justify-between text-[10px] uppercase tracking-luxury text-gold">
                          <span>{p.category}</span>
                          <span>{p.year}</span>
                        </div>
                        <h3 className="mt-3 font-display text-3xl lg:text-4xl">{p.title}</h3>
                        <div className="mt-2 text-xs text-foreground/60">{p.location}</div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
}
