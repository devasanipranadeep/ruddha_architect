import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE } from "@/data/site";

export function Loader() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
        >
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-display text-5xl text-gradient-gold"
            >
              {SITE.name}
            </motion.div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 200 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 h-px bg-gradient-gold mx-auto"
            />
            <div className="mt-4 text-[10px] tracking-luxury uppercase text-muted-foreground">
              Architects & Interiors
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
