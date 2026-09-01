import { useMemo, type RefObject } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

type Mark = { type: "cross" | "dot" | "tick"; x: number; y: number; depth: number };

// mulberry32 PRNG seeded from the section id — deterministic (stable
// between prerendered HTML and client hydration, unlike Math.random())
// but well-distributed, unlike the previous linear-congruential-ish hash
// which clustered marks together.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function marksForSeed(seed: string): Mark[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const rand = mulberry32(h);
  const types: Mark["type"][] = ["cross", "dot", "tick"];
  return Array.from({ length: 7 }, (_, i) => ({
    type: types[i % types.length],
    x: 8 + rand() * 84,
    y: 8 + rand() * 84,
    depth: 0.4 + rand() * 0.6,
  }));
}

function MarkShape({ type }: { type: Mark["type"] }) {
  if (type === "cross") {
    return (
      <svg width="22" height="22" viewBox="0 0 22 22" className="text-primary">
        <path d="M11 0v22M0 11h22" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }
  if (type === "dot") {
    return <span className="block size-3 rounded-full border-2 border-accent-teal" />;
  }
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" className="text-foreground-muted">
      <path d="M0 9h18" stroke="currentColor" strokeWidth="1.5" />
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
  const range = 140 * mark.depth;
  const y = useTransform(progress, [0, 1], [-range, range]);
  const xPos = side === "right" ? mark.x : 100 - mark.x;

  return (
    // Centering lives on this plain div (a static Tailwind transform).
    // The animated `y` lives on the motion.div nested inside it — on
    // separate elements so Motion's inline `transform` style never
    // collides with (and silently overrides) Tailwind's transform
    // classes, which is what was making these invisible before.
    <div
      style={{ left: `${xPos}%`, top: `${mark.y}%` }}
      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
    >
      <motion.div style={{ y, opacity: 0.55 + mark.depth * 0.35 }}>
        <MarkShape type={mark.type} />
      </motion.div>
    </div>
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
