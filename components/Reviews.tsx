"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { Review } from "@/app/content";

const AUTOPLAY_MS = 3000;

type Props = { reviews: Review[]; aggregateRating: string | null };

/**
 * The parser's Review shape has no job field, so site.md rows carry it inside
 * the area capture ("Clapham, London — Job: New pendant light installation")
 * and it is split back out here. Every word rendered is verbatim from
 * site.md; the five stars are site.md's own "All are 5 stars" line.
 *
 * One review at a time on the dark canvas. Auto-advances; pauses on
 * hover/focus; with reduced motion it holds the first review and the
 * prev/next controls are the only way to move.
 */
export function Reviews({ reviews, aggregateRating }: Props) {
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

  useEffect(() => {
    if (reduced || reviews.length < 2) return;
    const id = window.setInterval(() => {
      if (!paused.current) setIndex((i) => (i + 1) % reviews.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [reduced, reviews.length]);

  if (reviews.length === 0) return null;

  const go = (delta: number) =>
    setIndex((i) => (i + delta + reviews.length) % reviews.length);

  const review = reviews[index];
  const [area, job] = review.area.split(/\s*—\s*Job:\s*/);

  return (
    <section id="reviews" className="border-b border-slate-800 bg-slate-950">
      <div
        className="mx-auto max-w-6xl px-5 py-16 sm:py-20"
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
        onFocusCapture={() => (paused.current = true)}
        onBlurCapture={() => (paused.current = false)}
      >
        <h2 className="text-3xl font-semibold tracking-tight text-white">
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
          <div className="flex min-h-[16rem] flex-col sm:min-h-[13rem]">
            <div
              className="flex items-center gap-1"
              role="img"
              aria-label="5 out of 5 stars"
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  aria-hidden="true"
                  className="h-4 w-4 fill-trust-bright text-trust-bright"
                />
              ))}
            </div>

            {job && (
              <p className="mt-3 font-mono text-xs font-medium uppercase tracking-widest text-slate-400">
                {job}
              </p>
            )}

            <blockquote className="mt-4 text-xl leading-relaxed text-slate-100 sm:text-2xl">
              &ldquo;{review.quote}&rdquo;
            </blockquote>

            <p className="mt-5 text-sm font-semibold text-white">
              {review.name}
              <span className="font-normal text-slate-400"> — {area}</span>
            </p>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <p className="font-mono text-lg text-white">
              {String(index + 1).padStart(2, "0")}
              <span className="text-sm text-slate-400">
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
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    i === index ? "bg-trust-bright" : "bg-slate-600"
                  }`}
                />
              ))}
            </div>

            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous review"
                className="flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-md border border-slate-700 text-slate-200 transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-soft"
              >
                <ChevronLeft aria-hidden="true" className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next review"
                className="flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-md border border-slate-700 text-slate-200 transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-soft"
              >
                <ChevronRight aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
          </div>

          <p aria-live="polite" className="sr-only">
            Review {index + 1} of {reviews.length}: {review.name}, {area}
          </p>
        </div>
      </div>
    </section>
  );
}
