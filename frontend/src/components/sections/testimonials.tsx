import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal, SectionLabel } from "@/components/animations/reveal";
import { TESTIMONIALS } from "@/data/site";

export function Testimonials() {
  const [i, setI] = useState(0);
  const t = TESTIMONIALS[i];
  const len = TESTIMONIALS.length;

  return (
    <section className="relative py-32 lg:py-44">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-12 text-center">
        <Reveal><div className="flex justify-center"><SectionLabel>Voices</SectionLabel></div></Reveal>
        <Reveal delay={100}>
          <Quote className="mx-auto mt-10 text-gold/40" size={48} strokeWidth={1} />
        </Reveal>

        <div className="mt-10 min-h-[260px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-display text-3xl lg:text-5xl leading-[1.25] italic text-foreground/90">
                "{t.quote}"
              </p>
              <div className="mt-10 text-[11px] uppercase tracking-luxury text-gold">{t.name}</div>
              <div className="mt-2 text-xs text-muted-foreground">{t.role}</div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-12 flex items-center justify-center gap-6">
          <button
            onClick={() => setI((i - 1 + len) % len)}
            className="h-12 w-12 grid place-items-center border border-border hover:border-gold hover:text-gold transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                aria-label={`Testimonial ${idx + 1}`}
                className={`h-px transition-all duration-500 ${idx === i ? "w-12 bg-gold" : "w-6 bg-border"}`}
              />
            ))}
          </div>
          <button
            onClick={() => setI((i + 1) % len)}
            className="h-12 w-12 grid place-items-center border border-border hover:border-gold hover:text-gold transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
