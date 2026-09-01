import { useMemo, type RefObject } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

type Mark = { type: "cross" | "dot" | "tick"; x: number; y: number; depth: number };

// Deterministic layout seeded by the section id, not Math.random() — a
// random layout would differ between the prerendered HTML and the client
// hydration pass and cause a mismatch. Sparse on purpose (5 marks per
// section, hidden below md) so this reads as texture, not decoration.
function marksForSeed(seed: string): Mark[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 997;
  const rand = (n: number) => ((h * (n + 1) * 97) % 233) / 233;
  const types: Mark["type"][] = ["cross", "dot", "tick"];
  return Array.from({ length: 5 }, (_, i) => ({
    type: types[i % types.length],
    x: 10 + rand(i) * 80,
    y: 10 + rand(i + 5) * 80,
    depth: 0.3 + rand(i + 10) * 0.7,
  }));
}

function MarkShape({ type }: { type: Mark["type"] }) {
  if (type === "cross") {
    return (
      <svg width="24" height="24" viewBox="0 0 14 14" className="text-border">
        <path d="M7 0v14M0 7h14" stroke="currentColor" strokeWidth="4" />
      </svg>
    );
  }
  if (type === "dot") {
    return <span className="block size-8 rounded-full border-6 border-border" />;
  }
  return (
    <svg width="20" height="20" viewBox="0 0 10 10" className="text-border">
      <path d="M0 5h10" stroke="currentColor" strokeWidth="4" />
    </svg>
  );
}

function ParallaxMark({
  mark,
  progress,
  side,
}: {
  mark: Mark;
  progress: MotionValue<number>;
  side: "left" | "right";
}) {
  const range = 60 * mark.depth;
  const y = useTransform(progress, [0, 1], [-range, range]);
  // Bias marks toward the side opposite the content column, so they fill
  // the empty half rather than competing with text.
  const xPos = side === "right" ? mark.x : 100 - mark.x;

  return (
    <motion.div
      style={{ y, left: `${xPos}%`, top: `${mark.y}%`, opacity: 0.4 + mark.depth * 0.3 }}
      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
    >
      <MarkShape type={mark.type} />
    </motion.div>
  );
}

export function ParallaxMarks({
  containerRef,
  side,
  seed,
}: {
  containerRef: RefObject<HTMLElement | null>;
  side: "left" | "right";
  seed: string;
}) {
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const marks = useMemo(() => marksForSeed(seed), [seed]);

  return (
    <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true">
      {marks.map((mark, i) => (
        <ParallaxMark key={i} mark={mark} progress={scrollYProgress} side={side} />
      ))}
    </div>
  );
}
