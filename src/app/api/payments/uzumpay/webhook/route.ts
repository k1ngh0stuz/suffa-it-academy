import { NextRequest, NextResponse } from "next/server";
import { verifyUzumPaySignature, parseUzumPayWebhook } from "@/lib/payments/uzumpay";
import { processWebhookResult } from "@/lib/payments/processor";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-uzum-signature") ?? "";

  let verified: boolean;
  try {
    verified = verifyUzumPaySignature(rawBody, signature);
  } catch (err) {
    console.error("UzumPay signature verification error:", err);
    return NextResponse.json({ error: "configuration_error" }, { status: 500 });
  }

  if (!verified) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  try {
    const result = parseUzumPayWebhook(body);
    await processWebhookResult(result);
    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("UzumPay webhook processing error:", err);
    return NextResponse.json({ error: "processing_error" }, { status: 500 });
  }
}
