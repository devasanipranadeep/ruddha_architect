import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { IMAGES, SITE } from "@/data/site";

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={IMAGES.hero}
          alt="Cinematic interior of a Ruddha residence"
          width={1920}
          height={1080}
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40" />
        <div className="absolute inset-0 grid-bg opacity-40" />
      </div>

      {/* Floating gold orb */}
      <div className="pointer-events-none absolute top-1/4 right-[10%] h-72 w-72 rounded-full bg-gold/20 blur-3xl animate-float" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1400px] flex-col justify-center px-6 lg:px-12 pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.7 }}
          className="inline-flex items-center gap-3 text-[10px] uppercase tracking-luxury text-gold"
        >
          <span className="h-px w-12 bg-gold" />
          Est. 2025 — Kashibugga, Warangal, Telangana
        </motion.div>

        <h1 className="mt-8 font-display text-[clamp(3rem,9vw,9.5rem)] leading-[0.95] tracking-tight overflow-visible">
          {["Concept to", "Completion"].map((line, li) => (
            <span key={li} className="block overflow-hidden">
              <motion.span
                className="inline-block"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 1.8 + li * 0.15 }}
              >
                {li === 0 ? line : <span className="italic text-gradient-gold">{line}</span>}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.4 }}
          className="mt-10 max-w-xl text-base lg:text-lg text-foreground/70 leading-relaxed"
        >
          {SITE.full} composes residential, commercial and landscape spaces where
          light, material and silence become the architecture itself.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.6 }}
          className="mt-12 flex flex-wrap items-center gap-6"
        >
          <Link
            to="/portfolio"
            className="group relative overflow-hidden border border-gold px-8 py-4 text-[11px] uppercase tracking-wider-2 text-gold"
          >
            <span className="relative z-10 transition-colors duration-500 group-hover:text-primary-foreground">
              Explore Portfolio
            </span>
            <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0" />
          </Link>
          <Link
            to="/contact"
            className="text-[11px] uppercase tracking-wider-2 text-foreground/80 hover:text-gold transition-colors"
          >
            → Begin a conversation
          </Link>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
          className="absolute bottom-10 left-6 lg:left-12 flex items-center gap-3 text-[10px] uppercase tracking-luxury text-muted-foreground"
        >
          <ArrowDown size={14} className="text-gold animate-pulse-gold" />
          Scroll
        </motion.div>
      </div>
    </section>
  );
}
