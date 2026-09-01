import { motion, useScroll, useSpring } from "motion/react";

// Sits above the sticky Nav (z-40) — only rendered on the public homepage
// (see routes/home.tsx), since dashboard pages are too short for a scroll
// progress indicator to mean anything.
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-primary"
      aria-hidden="true"
    />
  );
}
