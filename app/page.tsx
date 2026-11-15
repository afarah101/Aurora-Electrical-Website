import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { Services } from "@/components/Services";
import { WorkGallery } from "@/components/WorkGallery";
import { Reviews } from "@/components/Reviews";
import { TrustedBy } from "@/components/TrustedBy";
import { ContactForm } from "@/components/ContactForm";
import { MyBuilderBadge } from "@/components/MyBuilderBadge";
import { EicrPricing } from "@/components/EicrPricing";
import { StickyCall } from "@/components/StickyCall";
import { Footer } from "@/components/Footer";
import { mybuilderField } from "@/lib/mybuilder";

import {
  accreditations,
  aggregateRating,
  business,
  certificates,
  claims,
  clients,
  contact,
  positioning,
  reviews,
  services,
} from "./content";

export default function Home() {
  return (
    <div id="top">
      <Nav
        businessName={business.name}
        phone={contact.phone}
        telLink={contact.telLink}
      />

      <main>
        <Hero
          businessName={business.name}
          tagline={business.tagline}
          phone={contact.phone}
          telLink={contact.telLink}
          whatsapp={contact.whatsapp}
          claims={claims}
          accreditations={accreditations}
          reviews={reviews}
          rating={mybuilderField("Rating")}
          ratingOutOf={mybuilderField("Rating out of")}
          reviewCount={mybuilderField("Reviews")}
          verified={/^yes$/i.test(mybuilderField("Verified by MyBuilder") ?? "")}
          mybuilderName={mybuilderField("Trading name")}
          mybuilderUrl={mybuilderField("Profile")}
        />
        <TrustBar serviceArea={contact.serviceArea} positioning={positioning} />
        {/* Ledger paper: reading-heavy sections sit on the cream sheet. */}
        <div className="theme-paper bg-surface text-ink">
          <MyBuilderBadge />
          <Reviews reviews={reviews} aggregateRating={aggregateRating} />
          <TrustedBy clients={clients} />
          <Services services={services} certificates={certificates} />
        </div>
        <WorkGallery />
        <div className="theme-paper bg-surface text-ink">
          <ContactForm
            email={contact.email}
            phone={contact.phone}
            telLink={contact.telLink}
            whatsapp={contact.whatsapp}
          />
          <EicrPricing />
        </div>
      </main>

      <Footer
        businessName={business.name}
        phone={contact.phone}
        telLink={contact.telLink}
        email={contact.email}
        serviceArea={contact.serviceArea}
        accreditations={accreditations}
        whatsapp={contact.whatsapp}
      />

      <StickyCall phone={contact.phone} telLink={contact.telLink} />
    </div>
  );
}
