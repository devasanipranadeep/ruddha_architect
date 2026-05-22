import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { api, type Project } from "@/lib/api";
import { Reveal, SectionLabel } from "@/components/animations/reveal";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CTA } from "@/components/sections/cta";

export const Route = createFileRoute("/portfolio/$slug")({
  loader: async ({ params }) => {
    try {
      const projects = await api.getProjects();
      const project = projects.find((p) => p.slug === params.slug);
      if (!project) throw notFound();
      return { project, projects };
    } catch (error) {
      // Fallback to static data if backend is not available
      const { getAdminProjects } = require("@/lib/admin-data");
      const projects = getAdminProjects();
      const project = projects.find((p) => p.slug === params.slug);
      if (!project) throw notFound();
      return { project, projects };
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.project.title} — Ruddha` },
      { name: "description", content: `${loaderData?.project.category} project in ${loaderData?.project.location}.` },
      { property: "og:title", content: `${loaderData?.project.title} — Ruddha` },
      { property: "og:image", content: loaderData?.project.cover_image },
    ],
    links: [{ rel: "canonical", href: `/portfolio/${loaderData?.project.slug}` }],
  }),
  component: ProjectDetail,
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center text-center px-6">
      <div>
        <div className="font-display text-6xl text-gradient-gold">Not found</div>
        <p className="mt-3 text-muted-foreground">This project is no longer on display.</p>
        <Link to="/portfolio" className="mt-8 inline-block border border-gold px-6 py-3 text-[11px] uppercase tracking-wider-2 text-gold">All projects</Link>
      </div>
    </div>
  ),
  errorComponent: () => <div className="min-h-screen grid place-items-center">Something went wrong.</div>,
});

function ProjectDetail() {
  const { project, projects } = Route.useLoaderData();
  const idx = projects.findIndex((p: any) => p.slug === project.slug);
  const next = projects[(idx + 1) % projects.length];
  const prev = projects[(idx - 1 + projects.length) % projects.length];

  return (
    <>
      <section className="relative h-[88vh] min-h-[600px] overflow-hidden">
        <img src={project.cover_image} alt={project.title} className="h-full w-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/30" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1400px] px-6 lg:px-12 pb-16">
          <Reveal><SectionLabel>{project.category}</SectionLabel></Reveal>
          <Reveal delay={100}>
            <h1 className="mt-6 font-display text-6xl md:text-8xl lg:text-9xl leading-[0.95]">
              {project.title}
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-8 flex flex-wrap gap-12 text-[11px] uppercase tracking-wider-2">
              <div><div className="text-muted-foreground">Location</div><div className="mt-2 text-foreground">{project.location}</div></div>
              <div><div className="text-muted-foreground">Year</div><div className="mt-2 text-foreground">{project.year}</div></div>
              <div><div className="text-muted-foreground">Discipline</div><div className="mt-2 text-foreground">{project.category}</div></div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-32">
        <div className="mx-auto max-w-[900px] px-6 lg:px-12">
          <Reveal><SectionLabel>Brief</SectionLabel></Reveal>
          <Reveal delay={100}>
            <p className="mt-8 font-display text-3xl md:text-4xl leading-snug">
              A {project.category.toLowerCase()} project in {project.location}, designed
              around <span className="italic text-gradient-gold">light, ritual and a single material gesture</span> — completed in {project.year}.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-12 grid gap-8 md:grid-cols-2 text-foreground/70 leading-relaxed">
              <p>{project.description || "The site asked for restraint. We answered with a single sweeping plane that wraps the public spaces and dissolves into private courts at either end."}</p>
              <p>Materials were sourced within 200 km of site: travertine, dark-oiled oak, raw brass. Detailing is honest — nothing painted, nothing hidden.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12 grid gap-6 md:grid-cols-2">
          <Reveal><div className="image-zoom"><img src={project.cover_image} loading="lazy" alt="" className="w-full h-[520px] object-cover" /></div></Reveal>
          <Reveal delay={100}><div className="image-zoom"><img src={(projects[(idx + 2) % projects.length] as any).cover_image} loading="lazy" alt="" className="w-full h-[520px] object-cover" /></div></Reveal>
        </div>
      </section>

      <section className="border-y border-border bg-charcoal/30 py-16">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <Link to="/portfolio/$slug" params={{ slug: prev.slug }} className="group flex items-center gap-4 text-foreground/70 hover:text-gold transition-colors">
            <ArrowLeft size={18} />
            <div>
              <div className="text-[10px] uppercase tracking-luxury">Previous</div>
              <div className="font-display text-xl">{prev.title}</div>
            </div>
          </Link>
          <Link to="/portfolio" className="text-[11px] uppercase tracking-wider-2 text-gold border border-gold/40 px-6 py-3 hover:bg-gold hover:text-primary-foreground transition-colors">All Projects</Link>
          <Link to="/portfolio/$slug" params={{ slug: next.slug }} className="group flex items-center gap-4 text-right text-foreground/70 hover:text-gold transition-colors">
            <div>
              <div className="text-[10px] uppercase tracking-luxury">Next</div>
              <div className="font-display text-xl">{next.title}</div>
            </div>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <CTA />
    </>
  );
}
