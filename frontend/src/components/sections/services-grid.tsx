import { Reveal, SectionLabel } from "@/components/animations/reveal";
import { SERVICES } from "@/data/site";
import { ArrowUpRight } from "lucide-react";

export function ServicesGrid() {
  return (
    <section className="relative border-y border-border bg-charcoal/30 py-32 lg:py-44">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Reveal><SectionLabel>What we do</SectionLabel></Reveal>
            <Reveal delay={100}>
              <h2 className="mt-6 font-display text-5xl lg:text-7xl leading-[1.05] max-w-3xl">
                Six disciplines, <span className="italic text-gradient-gold">one studio.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={200}>
            <p className="max-w-sm text-foreground/70">
              From the first sketch to the last finish — we keep the whole
              architecture under one roof.
            </p>
          </Reveal>
        </div>

        <div className="mt-20 grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.n} delay={i * 80}>
              <div className="group relative bg-background p-10 lg:p-12 min-h-[320px] flex flex-col justify-between transition-colors duration-500 hover:bg-charcoal cursor-pointer h-full">
                <div className="flex items-start justify-between">
                  <span className="font-display text-2xl text-gold/60">{s.n}</span>
                  <ArrowUpRight
                    size={20}
                    className="text-foreground/40 transition-all duration-500 group-hover:text-gold group-hover:-translate-y-1 group-hover:translate-x-1"
                  />
                </div>
                <div>
                  <h3 className="font-display text-3xl lg:text-4xl">{s.title}</h3>
                  <p className="mt-4 text-sm text-foreground/60 leading-relaxed">
                    {s.blurb}
                  </p>
                </div>
                <span className="absolute inset-x-10 bottom-0 h-px bg-gold scale-x-0 origin-left transition-transform duration-700 group-hover:scale-x-100" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
