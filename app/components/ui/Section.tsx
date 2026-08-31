import type { ReactNode } from "react";
import { Container } from "./Container";

export function Section({
  id,
  title,
  grid = false,
  children,
}: {
  id: string;
  title?: string;
  grid?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`scroll-mt-20 border-t border-border py-20 ${grid ? "bg-grid" : ""}`}>
      <Container>
        {title && (
          <h2 className="mb-10 font-mono text-sm font-semibold uppercase tracking-widest text-primary">
            {title}
          </h2>
        )}
        {children}
      </Container>
    </section>
  );
}
