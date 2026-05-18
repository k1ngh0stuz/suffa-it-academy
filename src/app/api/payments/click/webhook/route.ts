import { NextRequest, NextResponse } from "next/server";
import { verifyClickSignature, parseClickWebhook } from "@/lib/payments/click";
import { processWebhookResult } from "@/lib/payments/processor";

// Click sends both Prepare (action=0) and Complete (action=1) as POST with form data or JSON
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    const contentType = req.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      body = await req.json();
    } else {
      const text = await req.text();
      const params = new URLSearchParams(text);
      body = Object.fromEntries(params.entries());
    }
  } catch {
    return NextResponse.json({ error: -32700, message: "Parse error" }, { status: 400 });
  }

  let verified: boolean;
  try {
    verified = verifyClickSignature(body as Parameters<typeof verifyClickSignature>[0]);
  } catch (err) {
    console.error("Click signature verification error:", err);
    return NextResponse.json({ error: -32504, message: "Configuration error" }, { status: 500 });
  }

  if (!verified) {
    return NextResponse.json({ error: -32504, message: "Invalid sign_string" }, { status: 401 });
  }

  try {
    const result = parseClickWebhook(body);
    const action = Number(body.action ?? 0);

    // Prepare (action=0): validate order existence, return ACCEPTED
    if (action === 0) {
      return NextResponse.json({
        click_trans_id: body.click_trans_id,
        merchant_trans_id: body.merchant_trans_id,
        merchant_prepare_id: body.merchant_trans_id,
        error: 0,
        error_note: "Success",
      });
    }

    // Complete (action=1): process payment
    await processWebhookResult(result);

    return NextResponse.json({
      click_trans_id: body.click_trans_id,
      merchant_trans_id: body.merchant_trans_id,
      merchant_confirm_id: body.merchant_trans_id,
      error: 0,
      error_note: "Success",
    });
  } catch (err) {
    console.error("Click webhook processing error:", err);
    return NextResponse.json({ error: -31001, message: "Internal error" }, { status: 500 });
  }
}
