import Link from "next/link";
import { WhatsAppButton } from "@/components/WhatsAppButton";

// Hover colour only on a real mouse (hover-fine), eased over 160ms.
const LINK = "transition-colors duration-[160ms] ease-out hover-fine:text-ink motion-reduce:transition-none";

type Props = {
  businessName: string;
  phone: string | null;
  telLink: string | null;
  email: string | null;
  serviceArea: string | null;
  accreditations: string[];
  whatsapp: string | null;
};

export function Footer({
  businessName,
  phone,
  telLink,
  email,
  serviceArea,
  accreditations,
  whatsapp,
}: Props) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface-raised pb-20 text-ink-muted sm:pb-0">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <p className="text-lg font-semibold text-ink">{businessName}</p>
            {serviceArea && <p className="mt-2 text-sm">{serviceArea}</p>}
            {accreditations.length > 0 && (
              <p className="mt-2 text-sm">{accreditations.join(" · ")}</p>
            )}
          </div>

          <div className="space-y-2 text-sm">
            {telLink && (
              <p>
                <a href={`tel:${telLink}`} className={LINK}>
                  {phone}
                </a>
              </p>
            )}
            {email && (
              <p>
                <a href={`mailto:${email}`} className={LINK}>
                  {email}
                </a>
              </p>
            )}
            <WhatsAppButton whatsapp={whatsapp} className="mt-2" />
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-6 text-xs text-ink-subtle">
          <p>© {year} {businessName}. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link href="/emergency-electrician" className={LINK}>
                Emergency electrician
              </Link>
            </li>
            <li>
              <Link href="/eicr-landlords" className={LINK}>
                EICR for landlords
              </Link>
            </li>
            <li>
              <Link href="/privacy" className={LINK}>
                Privacy notice
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
