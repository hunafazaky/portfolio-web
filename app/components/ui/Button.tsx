import { type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";

const base =
  "inline-flex items-center gap-2 rounded-md px-4 py-2 font-mono text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none";
const variants = {
  primary: "bg-primary text-background hover:bg-primary-hover",
  outline: "border border-border text-foreground hover:bg-surface-alt",
  ghost: "text-foreground-muted hover:text-foreground",
  danger: "bg-danger text-background hover:opacity-90",
};

type Variant = keyof typeof variants;

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

export function LinkButton({
  variant = "primary",
  className = "",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant }) {
  return (
    <a className={`${base} ${variants[variant]} ${className}`} {...props} />
  );
}
