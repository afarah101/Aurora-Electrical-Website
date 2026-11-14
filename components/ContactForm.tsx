"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { readLeadSource } from "@/lib/lead-source";

/**
 * Field rules match the server schema in app/api/contact/route.ts; only the
 * messages are client-side. Keep the two in sync — they are checked
 * independently, and the server is the one that decides.
 */
const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  // Digits and spaces with an optional leading +, 10 to 15 digits in total.
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d ]+$/, "Please enter a phone number we can call")
    .refine((v) => {
      const digits = v.replace(/\D/g, "").length;
      return digits >= 10 && digits <= 15;
    }, "Please enter a phone number we can call"),
  address: z.string().trim().min(5, "Please enter the address of the job"),
  fault: z.string().trim().min(10, "Please tell us a little about the fault"),
  // Optional: an empty input arrives as "", which must pass.
  email: z.union([z.email("Please enter a valid email address"), z.literal("")]).optional(),
  /**
   * Honeypot. Deliberately permissive, exactly as on the server: rejecting a
   * filled value here would surface a validation error and tell a bot it was
   * caught. The server accepts and silently discards instead.
   */
  company: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;
type Status = { kind: "idle" | "sending" } | { kind: "ok" | "error"; message: string };

type Props = {
  email: string | null;
  phone: string | null;
  telLink: string | null;
  whatsapp: string | null;
};

export function ContactForm({ email, phone, telLink, whatsapp }: Props) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, source: readLeadSource() }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setStatus({
          kind: "error",
          message: body.error ?? "Something went wrong. Please call us instead.",
        });
        return;
      }
      reset();
      setStatus({ kind: "ok", message: "Thanks — we'll be in touch shortly." });
    } catch {
      setStatus({
        kind: "error",
        message: "Couldn't send just now. Please call us instead.",
      });
    }
  };

  const fieldClass =
    "mt-1 block w-full rounded-[12px] border border-ink-faint bg-surface-raised px-3 py-2 text-ink transition-colors duration-[160ms] ease-out focus:border-action-soft focus:outline-2 focus:outline-offset-0 focus:outline-action-soft";

  return (
    <section id="contact" className="border-b border-surface-high bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              Request a free quote
            </h2>
            <p className="mt-3 text-ink-muted">
              Tell us about the job and we&apos;ll come back with a
              no-obligation quote. For emergencies, calling is fastest.
            </p>
            <div className="mt-6 space-y-2 text-sm">
              {telLink && (
                <p>
                  <a href={`tel:${telLink}`} className="font-semibold text-action-soft">
                    {phone}
                  </a>
                </p>
              )}
              {email && (
                <p>
                  <a href={`mailto:${email}`} className="text-ink-muted transition-colors duration-[160ms] ease-out hover-fine:text-ink motion-reduce:transition-none">
                    {email}
                  </a>
                </p>
              )}
            </div>
            <WhatsAppButton whatsapp={whatsapp} className="mt-6" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium text-ink-body">
                Name
              </label>
              <input id="name" aria-required="true" {...register("name")} className={fieldClass} />
              {errors.name && (
                <p role="alert" className="mt-1 text-sm text-red-400">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="text-sm font-medium text-ink-body">
                Phone
              </label>
              <input id="phone" type="tel" aria-required="true" autoComplete="tel" {...register("phone")} className={fieldClass} />
              {errors.phone && (
                <p role="alert" className="mt-1 text-sm text-red-400">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="address" className="text-sm font-medium text-ink-body">
                Address
              </label>
              <input id="address" aria-required="true" autoComplete="street-address" {...register("address")} className={fieldClass} />
              {errors.address && (
                <p role="alert" className="mt-1 text-sm text-red-400">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="fault" className="text-sm font-medium text-ink-body">
                About the fault
              </label>
              <textarea id="fault" aria-required="true" rows={4} {...register("fault")} className={fieldClass} />
              {errors.fault && (
                <p role="alert" className="mt-1 text-sm text-red-400">
                  {errors.fault.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="text-sm font-medium text-ink-body">
                Email <span className="text-ink-subtle">(optional)</span>
              </label>
              <input id="email" type="email" autoComplete="email" {...register("email")} className={fieldClass} />
              {errors.email && (
                <p role="alert" className="mt-1 text-sm text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Honeypot: hidden from users, tempting to bots. */}
            <div aria-hidden="true" className="hidden">
              <label htmlFor="company">Company</label>
              <input id="company" tabIndex={-1} autoComplete="off" {...register("company")} />
            </div>

            <button
              type="submit"
              disabled={status.kind === "sending"}
              className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full bg-action px-6 text-base font-semibold text-ink hover-fine:enabled:bg-action-hover [transition:transform_100ms_var(--ease-out),background-color_160ms_var(--ease-out)] active:scale-[0.97] active:[transition:transform_160ms_var(--ease-out),background-color_160ms_var(--ease-out)] motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-soft disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
            >
              {status.kind === "sending" ? "Sending…" : "Send request"}
            </button>

            <p className="text-sm text-ink-subtle">
              We may message you when your EICR is due. Reply STOP any time to opt out.{" "}
              <Link href="/privacy" className="text-action-soft underline underline-offset-2 transition-colors duration-[160ms] ease-out hover-fine:text-ink motion-reduce:transition-none">
                How we use your details
              </Link>
            </p>

            <div aria-live="polite">
              {status.kind === "ok" && (
                <p className="text-sm font-medium text-emerald-400">{status.message}</p>
              )}
              {status.kind === "error" && (
                <p className="text-sm font-medium text-red-400">{status.message}</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
