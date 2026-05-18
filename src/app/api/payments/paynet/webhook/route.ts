import { NextRequest, NextResponse } from "next/server";
import { verifyPaynetSignature, parsePaynetWebhook } from "@/lib/payments/paynet";
import { processWebhookResult } from "@/lib/payments/processor";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    const contentType = req.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      body = await req.json();
    } else {
      // Paynet may send form-encoded data
      const text = await req.text();
      const params = new URLSearchParams(text);
      body = Object.fromEntries(params.entries());
    }
  } catch {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  let verified: boolean;
  try {
    verified = verifyPaynetSignature(body as Record<string, string>);
  } catch (err) {
    console.error("Paynet signature verification error:", err);
    return NextResponse.json({ error: "configuration_error" }, { status: 500 });
  }

  if (!verified) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  try {
    const result = parsePaynetWebhook(body);
    await processWebhookResult(result);
    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("Paynet webhook processing error:", err);
    return NextResponse.json({ error: "processing_error" }, { status: 500 });
  }
}
