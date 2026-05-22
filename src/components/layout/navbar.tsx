import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV, SITE } from "@/data/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 1.6 }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled ? "glass py-3" : "py-6"
        )}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 lg:px-12">
          <Link to="/" className="group flex items-center gap-3">
            <div className="h-8 w-8 rotate-45 border border-gold transition-transform duration-700 group-hover:rotate-[225deg]">
              <div className="h-full w-full bg-gradient-gold opacity-60" />
            </div>
            <div className="leading-none">
              <div className="font-display text-xl tracking-wide uppercase">{SITE.name}</div>
              <div className="text-[9px] tracking-luxury uppercase text-muted-foreground">
                Architects & Interiors
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="group relative text-[11px] uppercase tracking-wider-2 text-foreground/80 hover:text-gold transition-colors"
                activeProps={{ className: "text-gold" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <Link
            to="/estimator"
            className="hidden lg:inline-flex items-center gap-2 border border-gold/40 px-5 py-2.5 text-[11px] uppercase tracking-wider-2 text-gold hover:bg-gold hover:text-primary-foreground transition-colors"
          >
            Start a Project
          </Link>

          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden text-gold"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden bg-background/95 backdrop-blur-xl"
          >
            <div className="flex h-full flex-col items-center justify-center gap-8 px-6">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.05 * i, duration: 0.6 }}
                >
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="font-display text-4xl text-foreground hover:text-gold transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                to="/estimator"
                onClick={() => setOpen(false)}
                className="mt-6 border border-gold px-8 py-3 text-xs uppercase tracking-wider-2 text-gold"
              >
                Start a Project
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
