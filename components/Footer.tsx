type Props = {
  businessName: string;
  phone: string | null;
  telLink: string | null;
  email: string | null;
  serviceArea: string | null;
  accreditations: string[];
};

export function Footer({
  businessName,
  phone,
  telLink,
  email,
  serviceArea,
  accreditations,
}: Props) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 pb-20 text-slate-300 sm:pb-0">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <p className="text-lg font-semibold text-white">{businessName}</p>
            {serviceArea && <p className="mt-2 text-sm">{serviceArea}</p>}
            {accreditations.length > 0 && (
              <p className="mt-2 text-sm">{accreditations.join(" · ")}</p>
            )}
          </div>

          <div className="space-y-2 text-sm">
            {telLink && (
              <p>
                <a href={`tel:${telLink}`} className="hover:text-white">
                  {phone}
                </a>
              </p>
            )}
            {email && (
              <p>
                <a href={`mailto:${email}`} className="hover:text-white">
                  {email}
                </a>
              </p>
            )}
          </div>
        </div>

        <p className="mt-10 border-t border-slate-800 pt-6 text-xs text-slate-400">
          © {year} {businessName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
