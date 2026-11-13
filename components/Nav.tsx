"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, X } from "lucide-react";

type Props = { businessName: string; phone: string | null; telLink: string | null };

// "/#…" so the home-page anchors also work from the other pages. `page` is the
// route this link counts as current on; on that route it points at `pageHref`.
const LINKS: Array<{ href: string; label: string; page?: string; pageHref?: string }> = [
  { href: "/#services", label: "Services" },
  { href: "/emergency-electrician", label: "Emergency", page: "/emergency-electrician" },
  { href: "/eicr-landlords", label: "Landlord EICR", page: "/eicr-landlords" },
  { href: "/#work", label: "Work" },
  { href: "/#clients", label: "Clients" },
  // /contact has its own form, so stay on the page there.
  { href: "/#contact", label: "Contact", page: "/contact", pageHref: "#contact" },
];

export function Nav({ businessName, phone, telLink }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /*
   * FIXED, not sticky: sticky keeps the bar in normal flow, so at the top of
   * the page it sat in its own strip ABOVE the hero with the white body
   * showing through the transparent background — a white bar with an
   * invisible white wordmark. Fixed takes it out of flow so it genuinely
   * overlays the hero video (whose own overlay is slate-950/80 up here).
   * Past 24px it takes the translucent dark treatment. The border is
   * transparent rather than absent so the swap never shifts layout. Easing
   * is per-direction (emil-design-eng): ease-out entering the dark state,
   * ease-in returning to transparent; only one class is ever present. The
   * open mobile drawer forces the dark treatment — transparent glass over
   * the video would be unreadable.
   */
  const dark = scrolled || open;

  const links = LINKS.map((link) => {
    const current = link.page === pathname;
    return { ...link, href: current && link.pageHref ? link.pageHref : link.href, current };
  });
  const currentClass = "text-white underline decoration-action-soft decoration-2 underline-offset-8";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b transition-colors duration-200 motion-reduce:transition-none ${
        dark
          ? "border-slate-800 bg-slate-950/80 ease-out backdrop-blur"
          : "border-transparent bg-transparent ease-in"
      }`}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3"
      >
        {/*
          The wordmark crop of the client's logo (the word is IN the logo, so
          no duplicate text beside it — the mark itself went to the favicon).
          Served at 2x its display height so it stays sharp on retina; its
          navy ground sits on the dark nav closely enough to read as plate,
          and the accessible name keeps the brand for screen readers.
        */}
        <a
          href="#top"
          aria-label={`${businessName} — home`}
          className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-soft"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/aurora-logo-nav.png"
            alt={businessName}
            className="h-7 w-auto rounded-sm sm:h-8"
          />
        </a>

        <div className="flex items-center gap-4 lg:gap-8">
          <ul className="hidden items-center gap-8 lg:flex">
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  aria-current={link.current ? "page" : undefined}
                  className={`rounded-md text-sm font-medium transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-soft ${
                    link.current ? currentClass : "text-slate-300"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          {/* From sm up: StickyCall is sm:hidden, so this is the only call button there. */}
          {telLink && (
            <a
              href={`tel:${telLink}`}
              className="hidden h-10 items-center gap-2 rounded-md bg-action px-4 text-sm font-semibold text-white transition-colors hover:bg-action-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-soft sm:inline-flex"
            >
              <Phone aria-hidden="true" className="h-4 w-4" />
              {phone}
            </a>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="-mr-2 flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-soft lg:hidden"
          >
            {open ? (
              <X aria-hidden="true" className="h-6 w-6 text-white" />
            ) : (
              <Menu aria-hidden="true" className="h-6 w-6 text-white" />
            )}
          </button>
        </div>
      </nav>

      {open && (
        <ul id="mobile-menu" className="border-t border-slate-800 px-5 py-3 lg:hidden">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={link.current ? "page" : undefined}
                className={`flex min-h-11 items-center text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-soft ${
                  link.current ? currentClass : "text-slate-200"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
