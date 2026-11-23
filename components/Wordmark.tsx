import { cn } from "@/lib/utils";

type Props = { href: string; variant?: "inline" | "stacked"; className?: string };

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-soft";

/** "Dawn arc" mark: three rising arcs over a horizon line. Colours come from theme tokens. */
function DawnMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 35"
      fill="none"
      strokeWidth={2.4}
      strokeLinecap="round"
      className={cn("shrink-0", className)}
    >
      <path d="M10 30 A22 22 0 0 1 54 30" className="stroke-trust" />
      <path d="M18 30 A14 14 0 0 1 46 30" className="stroke-ink-subtle" />
      <path d="M26 30 A6 6 0 0 1 38 30" className="stroke-ink" />
      <path d="M2 30 H62" className="stroke-ink" />
    </svg>
  );
}

/**
 * Live-text wordmark. "inline" sits in the nav: the mark, then "AURORA".
 * "stacked" sits in the footer: the mark above "AURORA" and a ruled
 * "ELECTRICAL" line. The link's aria-label is its accessible name; the
 * visible parts are decorative.
 */
export function Wordmark({ href, variant = "inline", className }: Props) {
  if (variant === "stacked") {
    return (
      <a
        href={href}
        aria-label="Aurora Electrical home"
        className={cn("inline-flex flex-col items-center gap-2 rounded-sm text-ink", FOCUS, className)}
      >
        <DawnMark className="h-10 w-[72px]" />
        <span aria-hidden="true" className="font-heading text-xl font-medium leading-none tracking-[0.3em] text-ink">
          AURORA
        </span>
        <span aria-hidden="true" className="flex items-center gap-2">
          <span className="h-px w-8 bg-trust" />
          <span className="font-mono text-[11px] font-medium leading-none tracking-[0.46em] text-ink-subtle">
            ELECTRICAL
          </span>
          <span className="h-px w-8 bg-trust" />
        </span>
      </a>
    );
  }

  return (
    <a
      href={href}
      aria-label="Aurora Electrical home"
      className={cn("inline-flex items-center gap-2 rounded-sm text-ink", FOCUS, className)}
    >
      <DawnMark className="h-[22px] w-10" />
      <span aria-hidden="true" className="font-heading text-lg font-medium leading-none tracking-[0.28em] text-ink">
        AURORA
      </span>
    </a>
  );
}
