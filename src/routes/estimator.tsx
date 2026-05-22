import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal, SectionLabel } from "@/components/animations/reveal";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/estimator")({
  head: () => ({
    meta: [
      { title: "Cost Estimator — Ruddha" },
      { name: "description", content: "A quiet, multi-step estimator. Tell us your scope and we'll respond with a feasibility-grade range within two days." },
    ],
    links: [{ rel: "canonical", href: "/estimator" }],
  }),
  component: EstimatorPage,
});

type State = {
  type: string; size: string; finish: string; location: string;
  name: string; email: string; phone: string;
};

const TYPES = [
  { v: "residential", label: "Residential", rate: 4500 },
  { v: "commercial", label: "Commercial", rate: 3800 },
  { v: "interior", label: "Interior Only", rate: 2800 },
  { v: "renovation", label: "Renovation", rate: 2200 },
];
const SIZES = [
  { v: "s", label: "Up to 2,000 sqft", area: 1800 },
  { v: "m", label: "2,000 — 5,000 sqft", area: 3500 },
  { v: "l", label: "5,000 — 10,000 sqft", area: 7500 },
  { v: "xl", label: "10,000+ sqft", area: 12000 },
];
const FINISHES = [
  { v: "standard", label: "Standard", mult: 1 },
  { v: "premium", label: "Premium", mult: 1.45 },
  { v: "luxury", label: "Luxury / Bespoke", mult: 2.1 },
];

function EstimatorPage() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [data, setData] = useState<State>({
    type: "", size: "", finish: "", location: "",
    name: "", email: "", phone: "",
  });

  const steps = ["Project Type", "Project Size", "Finish Level", "Location", "Your Details"];

  const t = TYPES.find((x) => x.v === data.type);
  const s = SIZES.find((x) => x.v === data.size);
  const f = FINISHES.find((x) => x.v === data.finish);
  const low = t && s && f ? Math.round(t.rate * s.area * f.mult * 0.85 / 100000) : 0;
  const high = t && s && f ? Math.round(t.rate * s.area * f.mult * 1.15 / 100000) : 0;

  const canNext =
    (step === 0 && data.type) ||
    (step === 1 && data.size) ||
    (step === 2 && data.finish) ||
    (step === 3 && data.location.trim().length > 1) ||
    (step === 4 && data.name && data.email);

  return (
    <section className="relative pt-44 pb-32 lg:pt-56 min-h-screen">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="relative mx-auto max-w-[1100px] px-6 lg:px-12">
        <Reveal><SectionLabel>Estimator</SectionLabel></Reveal>
        <Reveal delay={100}>
          <h1 className="mt-6 font-display text-5xl md:text-7xl leading-[1.02]">
            A quiet <span className="italic text-gradient-gold">opening number.</span>
          </h1>
        </Reveal>
        <Reveal delay={200}>
          <p className="mt-6 max-w-xl text-foreground/70">
            Five short questions. We'll show a feasibility-grade range immediately and a studio-grade proposal within two days.
          </p>
        </Reveal>

        {!done ? (
          <div className="mt-16">
            {/* Progress */}
            <div className="flex items-center gap-3">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-px flex-1 transition-all duration-700",
                    i <= step ? "bg-gold" : "bg-border"
                  )}
                />
              ))}
            </div>
            <div className="mt-4 flex justify-between text-[10px] uppercase tracking-luxury text-muted-foreground">
              <span>Step {step + 1} / {steps.length}</span>
              <span>{steps[step]}</span>
            </div>

            <div className="mt-12 min-h-[340px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {step === 0 && (
                    <Choices items={TYPES} value={data.type} onChange={(v) => setData({ ...data, type: v })} />
                  )}
                  {step === 1 && (
                    <Choices items={SIZES} value={data.size} onChange={(v) => setData({ ...data, size: v })} />
                  )}
                  {step === 2 && (
                    <Choices items={FINISHES} value={data.finish} onChange={(v) => setData({ ...data, finish: v })} />
                  )}
                  {step === 3 && (
                    <Field label="Project location" value={data.location} onChange={(v) => setData({ ...data, location: v })} placeholder="City, country" />
                  )}
                  {step === 4 && (
                    <div className="grid gap-6 md:grid-cols-2">
                      <Field label="Full name" value={data.name} onChange={(v) => setData({ ...data, name: v })} placeholder="" />
                      <Field label="Email" value={data.email} onChange={(v) => setData({ ...data, email: v })} placeholder="" />
                      <Field label="Phone" value={data.phone} onChange={(v) => setData({ ...data, phone: v })} placeholder="" />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-12 flex items-center justify-between border-t border-border pt-8">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="text-[11px] uppercase tracking-wider-2 text-foreground/60 hover:text-gold disabled:opacity-30 disabled:hover:text-foreground/60 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={() => (step === steps.length - 1 ? setDone(true) : setStep((s) => s + 1))}
                disabled={!canNext}
                className="group relative overflow-hidden border border-gold px-8 py-3 text-[11px] uppercase tracking-wider-2 text-gold disabled:opacity-30"
              >
                <span className="relative z-10 transition-colors duration-500 group-hover:text-primary-foreground">
                  {step === steps.length - 1 ? "Submit" : "Continue →"}
                </span>
                <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-700 group-hover:translate-x-0" />
              </button>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="mt-20 text-center"
          >
            <div className="mx-auto h-16 w-16 rounded-full border border-gold grid place-items-center text-gold">
              <Check size={24} />
            </div>
            <h2 className="mt-8 font-display text-4xl md:text-6xl">Thank you, {data.name.split(" ")[0] || "friend"}.</h2>
            <p className="mt-4 text-muted-foreground">A feasibility-grade range based on your inputs:</p>
            <div className="mt-10 font-display text-5xl md:text-7xl text-gradient-gold">
              ₹{low} — ₹{high} L
            </div>
            <p className="mt-6 max-w-xl mx-auto text-sm text-foreground/60">
              A studio-grade proposal will arrive at {data.email} within two working days.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function Choices<T extends { v: string; label: string }>({
  items, value, onChange,
}: { items: T[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => {
        const active = value === item.v;
        return (
          <button
            key={item.v}
            onClick={() => onChange(item.v)}
            className={cn(
              "group relative text-left p-8 border transition-all duration-500",
              active
                ? "border-gold bg-gold/5"
                : "border-border hover:border-gold/40"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="font-display text-2xl">{item.label}</div>
              <div className={cn("h-5 w-5 rounded-full border transition-colors", active ? "bg-gold border-gold" : "border-border")} />
            </div>
          </button>
        );
      })}
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-luxury text-gold mb-3">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-b border-border px-0 py-3 text-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-gold transition-colors"
      />
    </div>
  );
}
