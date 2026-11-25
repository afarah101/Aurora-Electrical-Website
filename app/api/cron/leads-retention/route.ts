import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { deleteRowsOlderThan } from "@/lib/leads-sheet";

/** Daily Vercel cron (vercel.json). Vercel sends "Authorization: Bearer <CRON_SECRET>". */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const given = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  if (!secret || given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const deleted = await deleteRowsOlderThan(365);
    return NextResponse.json({ ok: true, deleted });
  } catch (err) {
    console.error("leads-retention: failed", err);
    return NextResponse.json({ error: "Retention failed" }, { status: 500 });
  }
}
