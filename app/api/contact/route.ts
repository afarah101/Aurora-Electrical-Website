import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { business, contact } from "@/app/content";

/** Mirrors the client schema in components/ContactForm.tsx. */
const schema = z.object({
  name: z.string().min(2),
  email: z.email(),
  phone: z.string().optional(),
  propertyType: z.enum(["domestic", "commercial"]),
  message: z.string().min(10),
  // Honeypot: accepted by the schema so a filled value reaches the silent-accept
  // branch below. Rejecting it here would 400 and tell the bot it was caught.
  company: z.string().optional(),
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

  const { name, email, phone, propertyType, message } = parsed.data;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.FROM_EMAIL ?? "onboarding@resend.dev",
      to,
      replyTo: email,
      subject: `${business.name} — ${propertyType} enquiry from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || "not supplied"}`,
        `Property type: ${propertyType}`,
        "",
        message,
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
