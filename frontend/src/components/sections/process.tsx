import { Reveal, SectionLabel } from "@/components/animations/reveal";
import { PROCESS } from "@/data/site";

export function Process() {
  return (
    <section className="relative border-y border-border bg-charcoal/30 py-32 lg:py-44">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="max-w-3xl">
          <Reveal><SectionLabel>How we work</SectionLabel></Reveal>
          <Reveal delay={100}>
            <h2 className="mt-6 font-display text-5xl lg:text-7xl leading-[1.05]">
              A five-step <span className="italic text-gradient-gold">choreography.</span>
            </h2>
          </Reveal>
        </div>

        <div className="mt-20 relative">
          <div className="absolute left-0 right-0 top-12 h-px bg-border hidden lg:block" />
          <div className="grid gap-12 lg:grid-cols-5 lg:gap-6">
            {PROCESS.map((p, i) => (
              <Reveal key={p.n} delay={i * 100}>
                <div className="relative">
                  <div className="relative z-10 h-10 w-10 grid place-items-center rounded-full border border-gold bg-background text-[10px] text-gold tracking-wider-2">
                    {p.n}
                  </div>
                  <h3 className="mt-6 font-display text-2xl lg:text-3xl">{p.title}</h3>
                  <p className="mt-3 text-sm text-foreground/60 leading-relaxed">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
