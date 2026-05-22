import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/sections/hero";
import { AboutPreview } from "@/components/sections/about-preview";
import { ServicesGrid } from "@/components/sections/services-grid";
import { PortfolioShowcase } from "@/components/sections/portfolio-showcase";
import { Stats } from "@/components/sections/stats";
import { Process } from "@/components/sections/process";
import { Testimonials } from "@/components/sections/testimonials";
import { CTA } from "@/components/sections/cta";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ruddha — Architects & Interiors" },
      { name: "description", content: "Cinematic residential, commercial & landscape architecture. Studio of restraint working at the scale of memory." },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <AboutPreview />
      <ServicesGrid />
      <Stats />
      <PortfolioShowcase />
      <Process />
      <Testimonials />
      <CTA />
    </>
  );
}
