import crypto from "crypto";
import type { GatewayWebhookResult } from "./base";
import { timingSafeEqual } from "./base";

// UzumPay uses HMAC-SHA256 on the raw request body
export function verifyUzumPaySignature(rawBody: string, receivedSig: string): boolean {
  const secret = process.env.UZUMPAY_WEBHOOK_SECRET;
  if (!secret) throw new Error("UZUMPAY_WEBHOOK_SECRET not configured");

  const expected = crypto.createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
  return timingSafeEqual(expected, receivedSig.toLowerCase());
}

type UzumPayEvent = "PAYMENT_SUCCESS" | "PAYMENT_FAILED" | "PAYMENT_CANCELLED" | "PAYMENT_REFUNDED";

function mapStatus(event: UzumPayEvent): GatewayWebhookResult["status"] {
  switch (event) {
    case "PAYMENT_SUCCESS":
      return "success";
    case "PAYMENT_FAILED":
      return "failed";
    case "PAYMENT_CANCELLED":
      return "cancelled";
    case "PAYMENT_REFUNDED":
      return "refunded";
    default:
      return "failed";
  }
}

export function parseUzumPayWebhook(body: Record<string, unknown>): GatewayWebhookResult {
  const event = body.event as UzumPayEvent;
  const transactionId = String(body.transaction_id ?? body.orderId ?? "");
  // UzumPay sends amount in tiyin directly
  const amountTiyin = typeof body.amount === "number" ? body.amount : undefined;

  return {
    transactionId,
    status: mapStatus(event),
    amountTiyin,
    gateway: "uzumpay",
    rawPayload: body,
  };
}
