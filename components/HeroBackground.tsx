"use client";

import { useEffect, useRef } from "react";

/**
 * Muted, looping footage behind the hero. Decorative only: aria-hidden, never
 * audible (the source file carries an audio track — `muted` keeps it silent),
 * and it defers to the user.
 *
 * Playback is deliberately driven from the IntersectionObserver below instead
 * of an `autoPlay` attribute. A hardcoded autoPlay would start the clip before
 * hydration even for prefers-reduced-motion users; here the reduced-motion
 * check runs before play() is ever called, so those users only ever see the
 * poster frame. The same observer pauses the clip whenever the hero is
 * offscreen, so it never decodes for nobody.
 */
export function HeroBackground() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;

    const sync = () => {
      if (reduced.matches || !visible) {
        video.pause();
      } else {
        // play() can reject (low-power mode, data saver); the poster stands in.
        video.play().catch(() => {});
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        // Entries arrive oldest-first and rapid changes coalesce into one
        // delivery — read the newest or a scroll-away-and-back can act on the
        // stale "left the viewport" entry and pause a visible video.
        visible = entries[entries.length - 1].isIntersecting;
        sync();
      },
      { threshold: 0.1 },
    );
    observer.observe(video);
    reduced.addEventListener("change", sync);

    return () => {
      observer.disconnect();
      reduced.removeEventListener("change", sync);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      preload="metadata"
      poster="/aurora-poster.jpg"
      aria-hidden="true"
      tabIndex={-1}
      className="absolute inset-0 h-full w-full object-cover"
    >
      <source src="/aurora-video.mp4" type="video/mp4" />
    </video>
  );
}
