"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageIcon, Pause, Play } from "lucide-react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const AUTOPLAY_MS = 3000;

/**
 * The real job photos in /public/work, copied and numbered at build time.
 * page.tsx renders <WorkGallery /> bare and a "use client" module cannot list
 * the directory itself, so the deck is a constant kept in step with the files;
 * handleError() prunes any path that fails to load, so a deleted file degrades
 * to the next photo (never a broken <img>) and an empty deck falls back to
 * the placeholder tiles.
 */
const PHOTOS = Array.from(
  { length: 19 },
  (_, i) => `/work/work-${String(i + 1).padStart(2, "0")}.jpg`,
);

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-soft";
// Press is deliberate (160ms), release snaps (100ms), hover colour eases 160ms.
const PRESS =
  "[transition:transform_100ms_var(--ease-out),background-color_160ms_var(--ease-out)] active:scale-[0.97] active:[transition:transform_160ms_var(--ease-out),background-color_160ms_var(--ease-out)] motion-reduce:active:scale-100";
const CONTROL = `flex size-11 cursor-pointer items-center justify-center rounded-full text-ink-body ring-1 ring-hairline-strong hover-fine:bg-surface-high ${PRESS} ${FOCUS}`;
const ICON = { "aria-hidden": true, strokeWidth: 1.5, className: "size-5" } as const;

/**
 * One large panel, one photo at a time. Advances every 6s; stops while the
 * pointer is over it, while focus is inside it, or after the pause button.
 * Pressing play resumes at once; hover and focus pause it again once the
 * pointer leaves or focus moves to another control.
 * Reduced motion: no autoplay, the first photo holds, prev/next still work.
 * The dots are position indicators, not buttons: 19 dots at a 44px touch
 * target each cannot fit a phone width, so prev/next carry all interaction.
 */
export function WorkGallery({ photos = PHOTOS }: { photos?: string[] }) {
  const [deck, setDeck] = useState(photos);
  const [{ index, prev }, setPos] = useState<{ index: number; prev: number | null }>({
    index: 0,
    prev: null,
  });
  const reduced = useReducedMotion();
  // null = the visitor has not chosen; fall back to their motion preference.
  const [choice, setChoice] = useState<boolean | null>(null);
  const paused = choice ?? reduced;
  const count = deck.length;
  // Only the Pause button (or a reduced-motion preference) stops the slideshow.
  // Hover and focus no longer pause it: the photo fills most of the viewport,
  // so pausing on hover left it looking stuck.
  const rotating = !paused && count > 1;

  const go = (delta: number) =>
    setPos((p) => ({ prev: p.index, index: (p.index + delta + count) % count }));

  // One timeout per slide, so a manual move restarts the full 3s.
  useEffect(() => {
    if (!rotating) return;
    const id = window.setTimeout(
      () => setPos((p) => ({ prev: p.index, index: (p.index + 1) % count })),
      AUTOPLAY_MS,
    );
    return () => window.clearTimeout(id);
  }, [rotating, index, count]);

  const handleError = (src: string) => {
    setDeck((d) => {
      const next = d.filter((p) => p !== src);
      setPos((p) => ({ prev: null, index: next.length === 0 ? 0 : Math.min(p.index, next.length - 1) }));
      return next;
    });
  };

  const current = deck[index];
  const previous = prev !== null ? deck[prev] : undefined;
  const upcoming = count > 1 ? deck[(index + 1) % count] : undefined;

  /*
   * Crossfade without remounts. Layers are keyed by src and kept in deck
   * order, so React never moves a node; z-index does the stacking. The
   * outgoing photo sits on top and eases from opacity 1 to 0 (a class
   * change on the same node, so the transition runs); the current photo is
   * already opaque beneath it. The next photo is mounted at opacity 0 so it
   * is decoded before its turn.
   */
  const roles = new Map<string, "out" | "current" | "next">();
  if (upcoming) roles.set(upcoming, "next");
  if (previous) roles.set(previous, "out");
  roles.set(current, "current");
  const layers = deck.filter((src) => roles.has(src)).map((src) => ({ src, role: roles.get(src)! }));

  return (
    <section id="work" className="bg-surface-raised">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <h2 className="text-3xl font-semibold tracking-tight text-ink">Recent work</h2>
        <p className="mt-3 max-w-2xl text-ink-muted">
          Rewires, fuse boards and installs, photographed on site.
        </p>

        {count > 0 ? (
          <>
            <div className="relative mt-10 aspect-[4/3] w-full overflow-hidden rounded-sm bg-surface ring-1 ring-hairline sm:aspect-[16/10]">
              {layers.map(({ src, role }) => (
                <Image
                  key={src}
                  src={src}
                  alt={role === "current" ? `Completed electrical work, photo ${index + 1} of ${count}` : ""}
                  aria-hidden={role === "current" ? undefined : true}
                  fill
                  sizes="(min-width: 1200px) 1104px, calc(100vw - 40px)"
                  className={`object-cover ${
                    role === "out"
                      ? "pointer-events-none z-20 opacity-0 [transition:opacity_300ms_var(--ease-out)]"
                      : role === "current"
                        ? "z-10 opacity-100"
                        : "pointer-events-none z-0 opacity-0"
                  }`}
                  onError={() => handleError(src)}
                />
              ))}
            </div>

            <div className="mt-6 flex items-center gap-4">
              {/* Slide number in the mono face: counters are data. */}
              <p className="font-mono text-2xl text-ink sm:text-3xl">
                {String(index + 1).padStart(2, "0")}
                <span className="text-base text-ink-subtle"> / {String(count).padStart(2, "0")}</span>
              </p>

              <div aria-hidden="true" className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
                {deck.map((p, i) => (
                  <span
                    key={p}
                    className={`size-1.5 rounded-full ${i === index ? "bg-ink" : "bg-ink-faint"}`}
                  />
                ))}
              </div>

              <div className="flex shrink-0 gap-2">
                {count > 1 && (
                  <button
                    type="button"
                    onClick={() => setChoice(!paused)}
                    aria-label="Pause photo slideshow"
                    aria-pressed={paused}
                    className={CONTROL}
                  >
                    {paused ? <Play {...ICON} /> : <Pause {...ICON} />}
                  </button>
                )}
                <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className={CONTROL}>
                  <ChevronLeft {...ICON} />
                </button>
                <button type="button" onClick={() => go(1)} aria-label="Next photo" className={CONTROL}>
                  <ChevronRight {...ICON} />
                </button>
              </div>
            </div>

            {/* Announces only while not rotating, so a moving slideshow never
                talks over the page (WAI-ARIA carousel pattern). */}
            <p aria-live={rotating ? "off" : "polite"} className="sr-only">
              Photo {index + 1} of {count}
            </p>
          </>
        ) : (
          /* Every photo failed to load (or none shipped): styled tiles, no <img>. */
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex h-60 flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-hairline-strong bg-surface-high/50"
              >
                <ImageIcon aria-hidden="true" strokeWidth={1.5} className="size-8 text-ink-faint" />
                <span className="text-sm font-medium text-ink-subtle">Completed work</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
