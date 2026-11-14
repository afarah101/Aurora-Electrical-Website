"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Muted, looping footage in the hero frame. The video itself is decorative
 * (aria-hidden, never audible: the file carries an audio track, `muted`
 * keeps it silent), but it moves for more than 5s, so it carries its own
 * pause control (WCAG 2.2.2).
 *
 * Playback is driven from here, not an `autoPlay` attribute, so nothing
 * plays before hydration. It plays only while visible, not paused by the
 * visitor, and, for prefers-reduced-motion visitors, only after they press
 * play: they start paused on the poster frame.
 */
export function HeroBackground() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  // null = the visitor has not chosen; fall back to their motion preference.
  const [choice, setChoice] = useState<boolean | null>(null);
  const paused = choice ?? reduced;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      (entries) => {
        // Entries arrive oldest-first and rapid changes coalesce into one
        // delivery. Read the newest, or a scroll-away-and-back can act on the
        // stale "left the viewport" entry and pause a visible video.
        setVisible(entries[entries.length - 1].isIntersecting);
      },
      { threshold: 0.1 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (visible && !paused) {
      // play() can reject (low-power mode, data saver); the poster stands in.
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [visible, paused]);

  const Icon = paused ? Play : Pause;

  return (
    <>
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="metadata"
        poster="/aurora-poster.jpg"
        aria-hidden="true"
        tabIndex={-1}
        /*
         * 55% horizontal bias: at narrow aspects cover shows only a slice of
         * the 16:9 frame. The electrician stands right-of-centre (~55-70%) in
         * the wide shots and left-of-centre in the close-up; 55% keeps his
         * head inside the visible band in every shot of the loop (measured
         * from frames at 1s, 5s and 8.5s).
         */
        className="absolute inset-0 h-full w-full object-cover object-[55%_50%]"
      >
        <source src="/aurora-video.mp4" type="video/mp4" />
      </video>
      <button
        type="button"
        aria-label="Pause background video"
        aria-pressed={paused}
        onClick={() => setChoice(!paused)}
        className="absolute bottom-3 right-3 flex size-11 cursor-pointer items-center justify-center rounded-full bg-surface/80 text-ink ring-1 ring-hairline-strong [transition:transform_100ms_var(--ease-out),background-color_160ms_var(--ease-out)] hover-fine:bg-surface active:scale-[0.97] active:[transition:transform_160ms_var(--ease-out),background-color_160ms_var(--ease-out)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-soft motion-reduce:active:scale-100"
      >
        <Icon aria-hidden="true" strokeWidth={1.5} className="size-5" />
      </button>
    </>
  );
}
