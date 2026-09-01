import { useRef, type ReactNode } from "react";
import { motion } from "motion/react";
import { Container } from "./Container";
import { ContourDivider } from "./ContourDivider";
import { ParallaxMarks } from "./ParallaxMarks";

export function Section({
  id,
  title,
  side = "left",
  wide = false,
  children,
}: {
  id: string;
  title?: string;
  /** Which side of the page the content column sits on — sections
   * alternate this for left/right rhythm instead of every section
   * pinning to the left edge. */
  side?: "left" | "right";
  /** True for grid-heavy content (Projects, Skills, Certificates) that
   * should stay full-width below the header, rather than being squeezed
   * into the same narrow column as prose sections. */
  wide?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const alignRight = side === "right";

  return (
    <>
      <ContourDivider />
      <section id={id} ref={ref} className="relative overflow-hidden py-20 scroll-mt-20">
        <ParallaxMarks containerRef={ref} side={side} seed={id} />
        <Container className="relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {title && (
              <h2 className={`mb-8 max-w-md text-2xl font-semibold text-foreground md:text-3xl ${alignRight ? "ml-auto" : ""}`}>
                {title}
              </h2>
            )}
            <div className={wide ? "" : `max-w-xl ${alignRight ? "ml-auto" : ""}`}>{children}</div>
          </motion.div>
        </Container>
      </section>
    </>
  );
}
