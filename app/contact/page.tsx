import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { ContactForm } from "@/components/ContactForm";
import { StickyCall } from "@/components/StickyCall";
import { Footer } from "@/components/Footer";
import { accreditations, business, contact } from "../content";

const title = "Contact Aurora Electrical | Electrician in South-West London";
const description =
  "Contact Aurora Electrical, a NICEIC-registered electrician in South-West London. Call, WhatsApp or send the form for a free, no-obligation quote.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/contact" },
  openGraph: {
    title,
    description,
    type: "website",
    locale: "en_GB",
    url: "/contact",
    images: [{ url: "/aurora-share.png", width: 1200, height: 630, alt: `${business.name} logo` }],
  },
};

export default function ContactPage() {
  return (
    <div id="top">
      <Nav businessName={business.name} phone={contact.phone} telLink={contact.telLink} />
      {/* Clears the fixed Nav: 69px with the menu button, 65px from lg. */}
      <main className="bg-surface pt-[69px] lg:pt-[65px]">
        {/* The page's one h1. The form keeps its own h2 "Request a free quote". */}
        <h1 className="mx-auto max-w-6xl px-5 pt-10 font-mono text-xs font-medium uppercase tracking-[0.18em] text-ink-subtle">
          Contact {business.name}
        </h1>
        <ContactForm email={contact.email} phone={contact.phone} telLink={contact.telLink} whatsapp={contact.whatsapp} />
      </main>
      <Footer businessName={business.name} phone={contact.phone} telLink={contact.telLink} email={contact.email} serviceArea={contact.serviceArea} accreditations={accreditations} whatsapp={contact.whatsapp} />
      <StickyCall phone={contact.phone} telLink={contact.telLink} />
    </div>
  );
}
