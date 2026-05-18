import crypto from "crypto";
import type { GatewayWebhookResult } from "./base";
import { uzsToTiyin } from "./base";

// Click — MD5(serviceId + clickTransId + secretKey + merchantTransId + amount + action + signTime)
// Note: Click sends amount in UZS decimal — we convert to tiyin on ingest

export function verifyClickSignature(params: {
  click_trans_id: string;
  service_id: string;
  merchant_trans_id: string;
  amount: string;
  action: string;
  sign_time: string;
  sign_string: string;
}): boolean {
  const secretKey = process.env.CLICK_SECRET_KEY;
  if (!secretKey) throw new Error("CLICK_SECRET_KEY not configured");

  const signString = [
    params.click_trans_id,
    params.service_id,
    secretKey,
    params.merchant_trans_id,
    params.amount,
    params.action,
    params.sign_time,
  ].join("");

  const expected = crypto.createHash("md5").update(signString, "utf8").digest("hex");
  return params.sign_string.toLowerCase() === expected.toLowerCase();
}

export function parseClickWebhook(body: Record<string, unknown>): GatewayWebhookResult {
  // action=0 → Prepare; action=1 → Complete (payment confirmed)
  const action = Number(body.action ?? 0);
  const transactionId = String(body.click_trans_id ?? body.merchant_trans_id ?? "");

  // Click sends amount in UZS decimal — convert to tiyin
  const amountUzs = typeof body.amount === "number" ? body.amount : Number(body.amount ?? 0);
  const amountTiyin = uzsToTiyin(amountUzs);

  const status: GatewayWebhookResult["status"] = action === 1 ? "success" : "pending";

  return {
    transactionId,
    status,
    amountTiyin,
    gateway: "click",
    rawPayload: body,
  };
}
