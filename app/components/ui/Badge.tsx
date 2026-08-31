export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded border border-border bg-surface-alt px-2 py-0.5 font-mono text-xs text-foreground-muted">
      {children}
    </span>
  );
}
