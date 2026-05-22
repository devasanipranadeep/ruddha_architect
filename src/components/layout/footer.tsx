import { Link } from "@tanstack/react-router";
import { SITE, NAV } from "@/data/site";
import { Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-charcoal/40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-20">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="font-display text-5xl text-gradient-gold leading-none uppercase">
              {SITE.name}
            </div>
            <div className="text-[10px] tracking-luxury uppercase text-muted-foreground mt-1">
              Architects & Interiors
            </div>
            <p className="mt-6 max-w-md text-sm text-muted-foreground leading-relaxed">
              {SITE.description}
            </p>
          </div>

          <div className="lg:col-span-3">
            <div className="text-[10px] tracking-luxury uppercase text-gold">Studio</div>
            <ul className="mt-6 space-y-3 text-sm">
              {NAV.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="text-foreground/70 hover:text-gold transition-colors">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <div className="text-[10px] tracking-luxury uppercase text-gold">Contact</div>
            <ul className="mt-6 space-y-4 text-sm text-foreground/70">
              <li className="flex items-start gap-3"><MapPin size={15} className="mt-0.5 text-gold" />{SITE.address}</li>
              <li className="flex items-center gap-3"><Mail size={15} className="text-gold" />{SITE.email}</li>
              <li className="flex items-center gap-3"><Phone size={15} className="text-gold" />{SITE.phone}</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-border pt-8 text-[11px] tracking-wider-2 uppercase text-muted-foreground">
          <div>© {new Date().getFullYear()} {SITE.full}. All rights reserved.</div>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-gold">Privacy</Link>
            <Link to="/terms" className="hover:text-gold">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
