import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { business, contact, services } from "./content";

// IBM Plex — measured, engineered, non-default. Deliberately not Inter.
const plexSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400"],
});

const description = `${business.name} — electrical work for homes and businesses${
  contact.serviceArea ? ` in ${contact.serviceArea}` : ""
}. Rewiring, fuse boards, fault-finding, lighting and installations. Free no-obligation quotes.`;

export const metadata: Metadata = {
  title: {
    default: `${business.name} — Domestic & Commercial Electricians`,
    template: `%s | ${business.name}`,
  },
  description,
  openGraph: {
    title: `${business.name} — Domestic & Commercial Electricians`,
    description,
    type: "website",
    locale: "en_GB",
  },
  robots: { index: true, follow: true },
};

/** schema.org LocalBusiness. Only confirmed fields are emitted. */
function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Electrician",
    name: business.name,
    description,
    ...(contact.telLink ? { telephone: contact.telLink } : {}),
    ...(contact.email ? { email: contact.email } : {}),
    ...(contact.serviceArea ? { areaServed: contact.serviceArea } : {}),
    makesOffer: services.map((service) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: service },
    })),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={`${plexSans.variable} ${plexMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
        />
        {children}
      </body>
    </html>
  );
}
