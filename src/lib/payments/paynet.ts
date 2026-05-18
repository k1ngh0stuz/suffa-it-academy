import crypto from "crypto";
import type { GatewayWebhookResult } from "./base";

// Paynet — MD5 signature over concatenated key fields + secret
export function verifyPaynetSignature(params: Record<string, string>): boolean {
  const secret = process.env.PAYNET_SECRET;
  if (!secret) throw new Error("PAYNET_SECRET not configured");

  // Canonical sign string: merchantId + transactionId + amount + secret
  const signString = [
    process.env.PAYNET_MERCHANT_ID ?? "",
    params.transaction_id ?? "",
    params.amount ?? "",
    secret,
  ].join("");

  const expected = crypto.createHash("md5").update(signString, "utf8").digest("hex");
  return (params.sign ?? "").toLowerCase() === expected.toLowerCase();
}

type PaynetStatus = "success" | "failed" | "cancelled" | "pending";

export function parsePaynetWebhook(body: Record<string, unknown>): GatewayWebhookResult {
  const status = (body.status as PaynetStatus) ?? "failed";
  const transactionId = String(body.transaction_id ?? body.id ?? "");
  // Paynet sends amount in tiyin
  const amountTiyin = typeof body.amount === "number" ? body.amount : undefined;

  const mappedStatus: GatewayWebhookResult["status"] =
    status === "success"
      ? "success"
      : status === "cancelled"
        ? "cancelled"
        : status === "pending"
          ? "pending"
          : "failed";

  return {
    transactionId,
    status: mappedStatus,
    amountTiyin,
    gateway: "paynet",
    rawPayload: body,
  };
}
