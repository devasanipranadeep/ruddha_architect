import { createFileRoute } from "@tanstack/react-router";
import { ServicesGrid } from "@/components/sections/services-grid";
import { Process } from "@/components/sections/process";
import { Reveal, SectionLabel } from "@/components/animations/reveal";
import { CTA } from "@/components/sections/cta";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Ruddhaa Architects & Interiors" },
      { name: "description", content: "Architecture, interiors, landscape, renovation, turnkey build and consulting — all under one studio." },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <section className="relative pt-44 pb-12 lg:pt-56 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
          <Reveal><SectionLabel>Capabilities</SectionLabel></Reveal>
          <Reveal delay={100}>
            <h1 className="mt-6 font-display text-6xl md:text-8xl lg:text-9xl leading-[0.95] max-w-5xl">
              One studio. <span className="italic text-gradient-gold">Every</span> discipline.
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-10 max-w-2xl text-foreground/70 leading-relaxed">
              From a feasibility sketch to the day you hang your first painting,
              every decision passes through the same studio.
            </p>
          </Reveal>
        </div>
      </section>
      <ServicesGrid />
      <Process />
      <CTA />
    </>
  );
}
