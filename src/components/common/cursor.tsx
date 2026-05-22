import { useEffect, useState } from "react";
import { useMousePosition } from "@/hooks/use-mouse-position";

export function Cursor() {
  const { x, y } = useMousePosition();
  const [hover, setHover] = useState(false);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (max-width: 768px)");
    setEnabled(!mq.matches);
    const fn = () => setEnabled(!mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHover(!!t.closest("a, button, [data-cursor='hover']"));
    };
    window.addEventListener("mouseover", onOver);
    return () => window.removeEventListener("mouseover", onOver);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden md:block"
        style={{
          transform: `translate(${x}px, ${y}px)`,
          transition: "width 0.3s, height 0.3s",
        }}
      >
        <div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-gold mix-blend-difference transition-all duration-300"
          style={{
            width: hover ? 56 : 28,
            height: hover ? 56 : 28,
          }}
        />
      </div>
      <div
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden md:block"
        style={{
          transform: `translate(${x}px, ${y}px)`,
          transition: "transform 0.15s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <div className="-translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-gold" />
      </div>
    </>
  );
}
