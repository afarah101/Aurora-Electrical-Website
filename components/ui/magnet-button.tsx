"use client";

import { type ComponentProps, useEffect, useRef } from "react";

/*
 * A link that drifts a few pixels toward the mouse while the pointer is over
 * it, then settles back on leave. Modelled on the Kokonut UI "Magnet Button"
 * pull; written here because that item is no longer in the @kokonutui
 * registry. No dependencies, no network calls.
 *
 * The pull runs only for a fine pointer (a mouse) with no reduced-motion
 * preference. Phones, tablets and reduced-motion users get a static link.
 */

const MOTION_QUERY = "(pointer: fine) and (prefers-reduced-motion: no-preference)";

type Props = ComponentProps<"a"> & {
  /** Share of the pointer's offset from centre that the link follows. */
  strength?: number;
  /** Largest shift, in px, on either axis. */
  maxShift?: number;
};

export function MagnetButton({ strength = 0.2, maxShift = 6, children, ...props }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const query = window.matchMedia(MOTION_QUERY);
    const clamp = (v: number) => Math.max(-maxShift, Math.min(maxShift, v));
    let raf = 0;
    let listening = false;

    const shift = (x: number, y: number) => {
      // `transform`, not `translate`: it composes with the 1px hover lift
      // and the press scale, which use the separate translate/scale properties.
      el.style.transform = x === 0 && y === 0 ? "" : `translate(${x}px, ${y}px)`;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = el.getBoundingClientRect();
      const x = clamp((event.clientX - (rect.left + rect.width / 2)) * strength);
      const y = clamp((event.clientY - (rect.top + rect.height / 2)) * strength);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => shift(x, y));
    };

    const onLeave = () => {
      cancelAnimationFrame(raf);
      shift(0, 0);
    };

    const sync = () => {
      if (query.matches && !listening) {
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        listening = true;
      } else if (!query.matches && listening) {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
        listening = false;
        onLeave();
      }
    };

    sync();
    query.addEventListener("change", sync);
    return () => {
      query.removeEventListener("change", sync);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [strength, maxShift]);

  return (
    <a ref={ref} {...props}>
      {children}
    </a>
  );
}
