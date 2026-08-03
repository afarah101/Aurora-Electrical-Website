"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

/**
 * Field rules match the server schema in app/api/contact/route.ts; only the
 * messages are client-side. Keep the two in sync — they are checked
 * independently, and the server is the one that decides.
 */
const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.email("Please enter a valid email address"),
  phone: z.string().optional(),
  propertyType: z.enum(["domestic", "commercial"]),
  message: z.string().min(10, "Please tell us a little about the job"),
  /**
   * Honeypot. Deliberately permissive, exactly as on the server: rejecting a
   * filled value here would surface a validation error and tell a bot it was
   * caught. The server accepts and silently discards instead.
   */
  company: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;
type Status = { kind: "idle" | "sending" } | { kind: "ok" | "error"; message: string };

type Props = { email: string | null; phone: string | null; telLink: string | null };

export function ContactForm({ email, phone, telLink }: Props) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { propertyType: "domestic" },
  });

  const onSubmit = async (values: FormValues) => {
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
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
    "mt-1 block w-full rounded-md border border-slate-500 bg-slate-900 px-3 py-2 text-white focus:border-action-soft focus:outline-2 focus:outline-offset-0 focus:outline-action-soft";

  return (
    <section id="contact" className="border-b border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              Request a free quote
            </h2>
            <p className="mt-3 text-slate-300">
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
                  <a href={`mailto:${email}`} className="text-slate-300 transition-colors hover:text-white">
                    {email}
                  </a>
                </p>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium text-slate-200">
                Name
              </label>
              <input id="name" {...register("name")} className={fieldClass} />
              {errors.name && (
                <p role="alert" className="mt-1 text-sm text-red-400">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="text-sm font-medium text-slate-200">
                Email
              </label>
              <input id="email" type="email" {...register("email")} className={fieldClass} />
              {errors.email && (
                <p role="alert" className="mt-1 text-sm text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="text-sm font-medium text-slate-200">
                Phone <span className="text-slate-400">(optional)</span>
              </label>
              <input id="phone" type="tel" {...register("phone")} className={fieldClass} />
            </div>

            <fieldset>
              <legend className="text-sm font-medium text-slate-200">Property type</legend>
              <div className="mt-2 flex gap-4">
                <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-slate-300">
                  <input className="cursor-pointer" type="radio" value="domestic" {...register("propertyType")} />
                  Home
                </label>
                <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-slate-300">
                  <input className="cursor-pointer" type="radio" value="commercial" {...register("propertyType")} />
                  Business
                </label>
              </div>
            </fieldset>

            <div>
              <label htmlFor="message" className="text-sm font-medium text-slate-200">
                About the job
              </label>
              <textarea id="message" rows={4} {...register("message")} className={fieldClass} />
              {errors.message && (
                <p role="alert" className="mt-1 text-sm text-red-400">
                  {errors.message.message}
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
              className="inline-flex h-12 cursor-pointer items-center justify-center rounded-md bg-action px-6 text-base font-semibold text-white transition-colors hover:bg-action-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-soft disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status.kind === "sending" ? "Sending…" : "Send request"}
            </button>

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
