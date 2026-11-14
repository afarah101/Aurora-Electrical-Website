import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { business, contact } from "@/app/content";
import { describeLeadSource } from "@/lib/lead-source";

/**
 * Field rules match the client schema in components/ContactForm.tsx, which
 * carries the user-facing messages. This is the authoritative check — the
 * client copy is a convenience and can be bypassed entirely.
 */
// Lead-source fields go into the plain-text email, so control characters
// (such as newlines that could fake a "Phone:" line) are turned into spaces.
const oneLine = (max: number) =>
  z
    .string()
    .max(max)
    .transform((value) => value.replace(/[\u0000-\u001f\u007f]+/g, " ").trim())
    .optional();

const schema = z.object({
  name: z.string().trim().min(2),
  // Digits and spaces with an optional leading +, 10 to 15 digits in total.
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d ]+$/)
    .refine((v) => {
      const digits = v.replace(/\D/g, "").length;
      return digits >= 10 && digits <= 15;
    }),
  address: z.string().trim().min(5),
  fault: z.string().trim().min(10),
  // Optional: the form sends "" when the field is left empty.
  email: z.union([z.email(), z.literal("")]).optional(),
  // Honeypot: accepted by the schema so a filled value reaches the silent-accept
  // branch below. Rejecting it here would 400 and tell the bot it was caught.
  company: z.string().optional(),
  // Where the enquiry came from (see lib/lead-source.ts). Optional and capped.
  source: z
    .object({
      page: oneLine(300),
      referrer: oneLine(300),
      utm_source: oneLine(200),
      utm_medium: oneLine(200),
      utm_campaign: oneLine(200),
      gclid: oneLine(200),
    })
    .optional(),
});

/**
 * In-memory rate limit: 5 requests per IP per 10 minutes.
 * Adequate for a single-instance marketing site. Note this resets on cold
 * start and is not shared across instances — swap for a durable store if the
 * site is ever scaled horizontally.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later, or call us." },
      { status: 429 },
    );
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }

  // Honeypot tripped — accept silently so bots get no signal.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.TO_EMAIL ?? contact.email;

  if (!apiKey || !to) {
    console.error("contact: RESEND_API_KEY or TO_EMAIL not configured");
    return NextResponse.json(
      { error: "Enquiries aren't available right now. Please call us instead." },
      { status: 503 },
    );
  }

  const { name, email, phone, address, fault, source } = parsed.data;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.FROM_EMAIL ?? "onboarding@resend.dev",
      to,
      // No email means Reply can't reach the customer, so the phone goes in the subject.
      ...(email ? { replyTo: email } : {}),
      subject: email ? `${business.name} — enquiry from ${name}` : `New enquiry — ${name} — ${phone}`,
      text: [
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Address: ${address}`,
        `Email: ${email || "not supplied"}`,
        `Source: ${describeLeadSource(source)}`,
        `Page: ${source?.page ?? "unknown"}`,
        "",
        fault,
      ].join("\n"),
    });

    if (error) {
      console.error("contact: resend error", error);
      return NextResponse.json(
        { error: "Couldn't send your message. Please call us instead." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("contact: unexpected error", err);
    return NextResponse.json(
      { error: "Couldn't send your message. Please call us instead." },
      { status: 500 },
    );
  }
}
