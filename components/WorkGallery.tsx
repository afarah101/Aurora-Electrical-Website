"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";

const AUTOPLAY_MS = 4500;

/**
 * The real job photos in /public/work, copied and numbered at build time.
 * page.tsx renders <WorkGallery /> bare and a "use client" module cannot list
 * the directory itself, so the deck is a constant kept in step with the files;
 * handleError() prunes any path that fails to load, so a deleted file degrades
 * to the next photo — never a broken <img> — and an empty deck falls back to
 * the placeholder tiles.
 */
const PHOTOS = Array.from(
  { length: 19 },
  (_, i) => `/work/work-${String(i + 1).padStart(2, "0")}.jpg`,
);

/**
 * One large panel, one photo at a time — the site's own dark band rather than
 * a light card grid, so the photos read against slate-900 the way the footage
 * does in the hero. Auto-advances; pauses on hover/focus; with reduced motion
 * it holds the first photo and leaves prev/next as the only way to move.
 * The dots are position indicators, not buttons: 19 dots at a 44px touch
 * target each cannot fit a phone width, so prev/next carry all interaction.
 */
export function WorkGallery({ photos = PHOTOS }: { photos?: string[] }) {
  const [deck, setDeck] = useState(photos);
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  const paused = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Auto-advance. No timer at all under reduced motion or with one photo.
  useEffect(() => {
    if (reduced || deck.length < 2) return;
    const id = window.setInterval(() => {
      if (!paused.current) setIndex((i) => (i + 1) % deck.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [reduced, deck.length]);

  const handleError = (src: string) => {
    setDeck((d) => {
      const next = d.filter((p) => p !== src);
      setIndex((i) => (next.length === 0 ? 0 : Math.min(i, next.length - 1)));
      return next;
    });
  };

  const go = (delta: number) =>
    setIndex((i) => (i + delta + deck.length) % deck.length);

  const count = deck.length;
  const current = deck[index];
  const next = count > 1 ? deck[(index + 1) % count] : null;

  return (
    <section id="work" className="bg-slate-900">
      <div
        className="mx-auto max-w-6xl px-5 py-16 sm:py-20"
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
        onFocusCapture={() => (paused.current = true)}
        onBlurCapture={() => (paused.current = false)}
      >
        <h2 className="text-3xl font-semibold tracking-tight text-white">
          Recent work
        </h2>
        <p className="mt-3 max-w-2xl text-slate-300">
          Rewires, fuse boards and installs, photographed on site.
        </p>

        {count > 0 ? (
          <>
            <div className="relative mt-10 aspect-[4/3] w-full overflow-hidden rounded-xl border border-slate-700 sm:aspect-[16/10]">
              <Image
                key={current}
                src={current}
                alt={`Completed electrical work — photo ${index + 1} of ${count}`}
                fill
                sizes="(min-width: 1200px) 1104px, calc(100vw - 40px)"
                className="object-cover"
                onError={() => handleError(current)}
              />
              {/* The upcoming slide, mounted invisibly so the advance is a
                  swap between two decoded images, not a fetch. */}
              {next && (
                <Image
                  src={next}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="(min-width: 1200px) 1104px, calc(100vw - 40px)"
                  className="pointer-events-none object-cover opacity-0"
                  onError={() => handleError(next)}
                />
              )}
            </div>

            <div className="mt-6 flex items-center gap-4">
              {/* Slide number in the mono face — counters are data. */}
              <p className="font-mono text-2xl text-white sm:text-3xl">
                {String(index + 1).padStart(2, "0")}
                <span className="text-base text-slate-400"> / {String(count).padStart(2, "0")}</span>
              </p>

              <div aria-hidden="true" className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
                {deck.map((p, i) => (
                  <span
                    key={p}
                    className={`h-1.5 w-1.5 rounded-full transition-colors ${
                      i === index ? "bg-blue-400" : "bg-slate-600"
                    }`}
                  />
                ))}
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous photo"
                  className="flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-md border border-slate-700 text-slate-200 transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
                >
                  <ChevronLeft aria-hidden="true" className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next photo"
                  className="flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-md border border-slate-700 text-slate-200 transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
                >
                  <ChevronRight aria-hidden="true" className="h-5 w-5" />
                </button>
              </div>
            </div>

            <p aria-live="polite" className="sr-only">
              Photo {index + 1} of {count}
            </p>
          </>
        ) : (
          /* Every photo failed to load (or none shipped) — styled tiles, no <img>. */
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex h-60 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-slate-700 bg-slate-800/50"
              >
                <ImageIcon aria-hidden="true" className="h-8 w-8 text-slate-500" />
                <span className="text-sm font-medium text-slate-400">
                  Completed work
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
