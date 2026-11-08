import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { ContactForm } from "@/components/ContactForm";
import { StickyCall } from "@/components/StickyCall";
import { Footer } from "@/components/Footer";
import { accreditations, business, contact } from "../content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Request a quote from Aurora Electrical, a NICEIC-registered electrician in South-West London.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div id="top">
      <Nav businessName={business.name} phone={contact.phone} telLink={contact.telLink} />
      <main>
        <ContactForm email={contact.email} phone={contact.phone} telLink={contact.telLink} whatsapp={contact.whatsapp} />
      </main>
      <Footer businessName={business.name} phone={contact.phone} telLink={contact.telLink} email={contact.email} serviceArea={contact.serviceArea} accreditations={accreditations} whatsapp={contact.whatsapp} />
      <StickyCall phone={contact.phone} telLink={contact.telLink} />
    </div>
  );
}
