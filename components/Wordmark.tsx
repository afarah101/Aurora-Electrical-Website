import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = { href: string; className?: string };

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-soft";

/**
 * Live-text wordmark that replaces the logo image: a gold Zap, "Aurora" in
 * the heading font, then "ELECTRICAL" in small mono capitals. The link's
 * aria-label is its accessible name; the visible parts are decorative.
 * Below 360px the mono line drops so the nav still fits beside its buttons.
 */
export function Wordmark({ href, className }: Props) {
  return (
    <a
      href={href}
      aria-label="Aurora Electrical home"
      className={cn("inline-flex items-center gap-1.5 rounded-sm text-ink", FOCUS, className)}
    >
      <Zap aria-hidden="true" strokeWidth={1.75} className="size-[18px] shrink-0 fill-trust text-trust" />
      <span aria-hidden="true" className="font-heading text-lg font-semibold leading-none tracking-[-0.02em] text-ink">
        Aurora
      </span>
      <span
        aria-hidden="true"
        className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.18em] text-ink-subtle max-[359px]:hidden"
      >
        Electrical
      </span>
    </a>
  );
}
