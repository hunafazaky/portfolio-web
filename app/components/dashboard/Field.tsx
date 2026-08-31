import type { ReactNode } from "react";

// Shared across every dashboard form — keeps label/input styling
// consistent without a heavier form-library abstraction.
export const inputClass =
  "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-primary";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-1 block font-mono text-xs text-foreground-muted">{label}</label>
      {children}
    </div>
  );
}
