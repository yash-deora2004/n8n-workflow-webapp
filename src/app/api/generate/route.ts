import { NextRequest, NextResponse } from "next/server";

// Task creation should complete within 60 seconds
const FETCH_TIMEOUT_MS = 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

    if (!WEBHOOK_URL) {
      return NextResponse.json(
        { error: "N8N_WEBHOOK_URL is not configured" },
        { status: 500 }
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const text = await res.text();

    if (!res.ok) {
      return NextResponse.json(
        { error: `n8n error (${res.status}): ${text}` },
        { status: res.status }
      );
    }

    try {
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch {
      return NextResponse.json(
        { error: `n8n returned invalid JSON: ${text.slice(0, 500)}` },
        { status: 502 }
      );
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Server error: ${message}` },
      { status: 500 }
    );
  }
}
