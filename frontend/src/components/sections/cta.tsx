import { Link } from "@tanstack/react-router";
import { Reveal, SectionLabel } from "@/components/animations/reveal";

export function CTA() {
  return (
    <section className="relative py-32 lg:py-48 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-gold/15 blur-[120px]" />

      <div className="relative mx-auto max-w-[1100px] px-6 lg:px-12 text-center">
        <Reveal><div className="flex justify-center"><SectionLabel>Begin</SectionLabel></div></Reveal>
        <Reveal delay={100}>
          <h2 className="mt-8 font-display text-5xl md:text-7xl lg:text-8xl leading-[1.02]">
            Build the space
            <br />
            you've been <span className="italic text-gradient-gold">imagining.</span>
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <p className="mt-8 mx-auto max-w-xl text-foreground/70">
            Tell us about your site, your brief, your unspoken hopes for the
            project. We'll respond within two working days.
          </p>
        </Reveal>
        <Reveal delay={300}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
            <Link
              to="/estimator"
              className="group relative overflow-hidden border border-gold px-10 py-4 text-[11px] uppercase tracking-wider-2 text-gold"
            >
              <span className="relative z-10 transition-colors duration-500 group-hover:text-primary-foreground">
                Get an estimate
              </span>
              <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-700 group-hover:translate-x-0" />
            </Link>
            <Link
              to="/contact"
              className="text-[11px] uppercase tracking-wider-2 text-foreground/80 hover:text-gold transition-colors"
            >
              → Write to the studio
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
