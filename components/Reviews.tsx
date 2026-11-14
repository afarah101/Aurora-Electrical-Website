"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, Star } from "lucide-react";
import type { Review } from "@/app/content";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const AUTOPLAY_MS = 6000;

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-soft";
// Press is deliberate (160ms), release snaps (100ms), hover colour eases 160ms.
const PRESS =
  "[transition:transform_100ms_var(--ease-out),background-color_160ms_var(--ease-out)] active:scale-[0.97] active:[transition:transform_160ms_var(--ease-out),background-color_160ms_var(--ease-out)] motion-reduce:active:scale-100";
const CONTROL = `flex size-11 cursor-pointer items-center justify-center rounded-full text-ink-body ring-1 ring-hairline-strong hover-fine:bg-surface-high ${PRESS} ${FOCUS}`;
const ICON = { "aria-hidden": true, strokeWidth: 1.5, className: "size-5" } as const;

type Props = { reviews: Review[]; aggregateRating: string | null };

/**
 * The parser's Review shape has no job field, so site.md rows carry it inside
 * the area capture ("Clapham, London — Job: New pendant light installation")
 * and it is split back out here. Every word rendered is verbatim from
 * site.md; the five stars are site.md's own "All are 5 stars" line.
 *
 * One review at a time on the dark canvas. Advances every 6s; stops while
 * the pointer is over it, while focus is inside it, or after the pause
 * button; pressing play resumes at once. Reduced motion: no autoplay, the first review holds, prev/next
 * still work. A new quote fades and rises 4px into place (250ms).
 */
export function Reviews({ reviews, aggregateRating }: Props) {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  // null = the visitor has not chosen; fall back to their motion preference.
  const [choice, setChoice] = useState<boolean | null>(null);
  const paused = choice ?? reduced;
  // An explicit Play (choice === false) wins over hover and focus: the button
  // sits inside the region, so pressing it always leaves pointer or focus there.
  const rotating = !paused && (choice === false || (!hovered && !focused)) && reviews.length > 1;

  // One timeout per slide, so a manual move restarts the full 6s.
  useEffect(() => {
    if (!rotating) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % reviews.length), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [rotating, index, reviews.length]);

  if (reviews.length === 0) return null;

  const go = (delta: number) =>
    setIndex((i) => (i + delta + reviews.length) % reviews.length);

  const review = reviews[index];
  const [area, job] = review.area.split(/\s*—\s*Job:\s*/);

  return (
    <section id="reviews" className="border-b border-hairline bg-surface">
      <div
        className="mx-auto max-w-6xl px-5 py-16 sm:py-20"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
        }}
      >
        <h2 className="text-3xl font-semibold tracking-tight text-ink">
          What customers say
        </h2>
        {aggregateRating && (
          <p className="mt-3 text-sm font-medium text-trust-bright">
            {aggregateRating}
          </p>
        )}

        <div className="mx-auto mt-12 max-w-3xl">
          {/* Fixed minimum height so short and long quotes don't bounce the
              controls around between slides. */}
          {/* Keyed by slide so each quote mounts fresh and enters through
              @starting-style; reduced motion keeps the fade, drops the rise. */}
          <div
            key={index}
            className="flex min-h-[16rem] flex-col [transition:opacity_250ms_var(--ease-out),transform_250ms_var(--ease-out)] starting:opacity-0 starting:[transform:translateY(4px)] motion-reduce:starting:[transform:none] sm:min-h-[13rem]"
          >
            <div
              className="flex items-center gap-1"
              role="img"
              aria-label="5 out of 5 stars"
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="size-4 fill-trust-bright text-trust-bright"
                />
              ))}
            </div>

            {job && (
              <p className="mt-3 font-mono text-xs font-medium uppercase tracking-widest text-ink-subtle">
                {job}
              </p>
            )}

            <blockquote className="mt-4 text-xl leading-relaxed text-ink-soft sm:text-2xl">
              &ldquo;{review.quote}&rdquo;
            </blockquote>

            <p className="mt-5 text-sm font-semibold text-ink">
              {review.name}
              <span className="font-normal text-ink-subtle"> — {area}</span>
            </p>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <p className="font-mono text-lg text-ink">
              {String(index + 1).padStart(2, "0")}
              <span className="text-sm text-ink-subtle">
                {" "}
                / {String(reviews.length).padStart(2, "0")}
              </span>
            </p>

            <div
              aria-hidden="true"
              className="flex flex-1 items-center gap-1.5"
            >
              {reviews.map((r, i) => (
                <span
                  key={`${r.name}-${r.area}`}
                  className={`size-1.5 rounded-full ${
                    i === index ? "bg-trust-bright" : "bg-ink-faint"
                  }`}
                />
              ))}
            </div>

            <div className="flex shrink-0 gap-2">
              {reviews.length > 1 && (
                <button
                  type="button"
                  onClick={() => setChoice(!paused)}
                  aria-label="Pause review slideshow"
                  aria-pressed={paused}
                  className={CONTROL}
                >
                  {paused ? <Play {...ICON} /> : <Pause {...ICON} />}
                </button>
              )}
              <button type="button" onClick={() => go(-1)} aria-label="Previous review" className={CONTROL}>
                <ChevronLeft {...ICON} />
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Next review" className={CONTROL}>
                <ChevronRight {...ICON} />
              </button>
            </div>
          </div>

          {/* Announces only while not rotating (WAI-ARIA carousel pattern). */}
          <p aria-live={rotating ? "off" : "polite"} className="sr-only">
            Review {index + 1} of {reviews.length}: {review.name}, {area}
          </p>
        </div>
      </div>
    </section>
  );
}
