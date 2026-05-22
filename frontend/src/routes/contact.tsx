import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Phone, MapPin, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, SectionLabel } from "@/components/animations/reveal";
import { SITE } from "@/data/site";
import { cn } from "@/lib/utils";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Ruddha Architects & Interiors" },
      { name: "description", content: "Write to the studio. We respond to every enquiry within two working days." },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  service: z.string().optional(),
  message: z.string().min(10, "Tell us a little more"),
});
type FormData = z.infer<typeof schema>;

function ContactPage() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSent(true);
      reset();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <>
      <section className="relative pt-44 pb-12 lg:pt-56 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
          <Reveal><SectionLabel>Begin a conversation</SectionLabel></Reveal>
          <Reveal delay={100}>
            <h1 className="mt-6 font-display text-6xl md:text-8xl lg:text-9xl leading-[0.95] max-w-5xl">
              Write to the <span className="italic text-gradient-gold">studio.</span>
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="pb-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12 grid gap-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <div className="space-y-10">
              <div>
                <div className="text-[10px] uppercase tracking-luxury text-gold">Studio</div>
                <div className="mt-3 flex items-start gap-3 text-foreground/80"><MapPin size={16} className="mt-1 text-gold" />{SITE.address}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-luxury text-gold">Email</div>
                <div className="mt-3 flex items-center gap-3 text-foreground/80"><Mail size={16} className="text-gold" />{SITE.email}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-luxury text-gold">Phone</div>
                <div className="mt-3 flex items-center gap-3 text-foreground/80"><Phone size={16} className="text-gold" />{SITE.phone}</div>
              </div>
              <div className="pt-6 border-t border-border">
                <div className="text-[10px] uppercase tracking-luxury text-gold">Hours</div>
                <div className="mt-3 text-foreground/80">Mon — Sat · 10:00 — 18:30 IST</div>
                <div className="text-foreground/60 text-sm mt-1">By appointment on Sundays</div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100} className="lg:col-span-8">
            {!sent ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-8 md:grid-cols-2">
                  <FormField label="Name" error={errors.name?.message}>
                    <input {...register("name")} className="form-input" />
                  </FormField>
                  <FormField label="Email" error={errors.email?.message}>
                    <input type="email" {...register("email")} className="form-input" />
                  </FormField>
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                  <FormField label="Phone" error={errors.phone?.message}>
                    <input {...register("phone")} className="form-input" />
                  </FormField>
                  <FormField label="Service (Optional)" error={errors.service?.message}>
                    <select {...register("service")} className="form-input">
                      <option value="">Select a service</option>
                      <option value="Architecture">Architecture</option>
                      <option value="Interior Design">Interior Design</option>
                      <option value="Landscape">Landscape</option>
                      <option value="Renovation">Renovation</option>
                      <option value="Turnkey Build">Turnkey Build</option>
                      <option value="Consulting">Consulting</option>
                    </select>
                  </FormField>
                </div>
                <FormField label="Tell us about your project" error={errors.message?.message}>
                  <textarea {...register("message")} rows={6} className="form-input resize-none" />
                </FormField>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative overflow-hidden border border-gold px-10 py-4 text-[11px] uppercase tracking-wider-2 text-gold disabled:opacity-60"
                >
                  <span className="relative z-10 transition-colors duration-500 group-hover:text-primary-foreground">
                    {isSubmitting ? "Sending…" : "Send message"}
                  </span>
                  <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-700 group-hover:translate-x-0" />
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="border border-gold/30 p-12 text-center"
              >
                <div className="mx-auto h-14 w-14 rounded-full border border-gold grid place-items-center text-gold">
                  <Check size={22} />
                </div>
                <h3 className="mt-8 font-display text-4xl">Message received.</h3>
                <p className="mt-3 text-muted-foreground">We'll respond within two working days.</p>
              </motion.div>
            )}
          </Reveal>
        </div>
      </section>

      <style>{`
        .form-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--border);
          padding: 0.75rem 0;
          font-size: 1rem;
          color: var(--foreground);
          transition: border-color 0.4s ease;
        }
        .form-input:focus { outline: none; border-color: var(--gold); }
        .form-input option {
          background: var(--card);
          color: var(--foreground);
        }
      `}</style>
    </>
  );
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-luxury text-gold mb-2">{label}</label>
      {children}
      {error && <div className={cn("mt-2 text-xs text-destructive")}>{error}</div>}
    </div>
  );
}
