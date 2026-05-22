import { createFileRoute } from "@tanstack/react-router";
import { Reveal, SectionLabel } from "@/components/animations/reveal";
import { IMAGES, SITE } from "@/data/site";
import { CTA } from "@/components/sections/cta";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Ruddha Architects & Interiors" },
      { name: "description", content: "Founded in 2007, Ruddha is a small, deliberate studio of architects, interior designers and craftspeople." },
      { property: "og:title", content: "About — Ruddha" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  const [yearsOfPractice, setYearsOfPractice] = useState(18);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await api.getStats();
        setYearsOfPractice(data.years_of_practice);
      } catch (error) {
        console.error("Failed to load stats:", error);
      }
    };
    loadStats();
  }, []);

  return (
    <>
      <section className="relative pt-44 pb-24 lg:pt-56 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
          <Reveal><SectionLabel>The Studio</SectionLabel></Reveal>
          <Reveal delay={100}>
            <h1 className="mt-6 font-display text-6xl md:text-8xl lg:text-9xl leading-[0.95] max-w-5xl">
              We design <span className="italic text-gradient-gold">slowly,</span>
              <br />on purpose.
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-10 max-w-2xl text-foreground/70 text-lg leading-relaxed">
              {SITE.full} is a {yearsOfPractice}-year-old studio that takes on a handful of
              projects every year. We resist scale — and trade volume for
              attention.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto grid max-w-[1400px] gap-16 px-6 lg:grid-cols-12 lg:px-12">
          <Reveal className="lg:col-span-6 flex items-center">
            <div className="image-zoom w-full">
              <img src={IMAGES.about} alt="Inside the studio" loading="lazy" width={1280} height={1600} className="w-full h-[400px] object-cover" />
            </div>
          </Reveal>
          <div className="lg:col-span-6 flex flex-col justify-center">
            <Reveal><SectionLabel>Philosophy</SectionLabel></Reveal>
            <Reveal delay={100}>
              <h2 className="mt-6 font-display text-4xl lg:text-5xl leading-tight">
                Design should serve <span className="italic text-gradient-gold">emotion</span> as much as function.
              </h2>
            </Reveal>
            <div className="mt-8 space-y-5 text-foreground/70 leading-relaxed">
              <Reveal delay={200}><p>We believe architecture should do more than simply work well — it should make people feel connected, calm, and comfortable. A space is not defined only by its function, but by the emotions it creates through light, proportion, material, and atmosphere.</p></Reveal>
              <Reveal delay={300}><p>Good design balances practicality with human experience. Every space should quietly support everyday life while creating moments of warmth, belonging, and memory. When emotion and function exist together, architecture becomes timeless.</p></Reveal>
            </div>
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
