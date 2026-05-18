import { describe, it, expect } from "vitest";
import crypto from "crypto";

// Set env before importing the module
const TEST_SECRET = "test-secret-uzum-123";
process.env.UZUMPAY_WEBHOOK_SECRET = TEST_SECRET;

import { verifyUzumPaySignature, parseUzumPayWebhook } from "@/lib/payments/uzumpay";

function makeSignature(body: string): string {
  return crypto.createHmac("sha256", TEST_SECRET).update(body, "utf8").digest("hex");
}

describe("UzumPay webhook", () => {
  it("verifies correct HMAC-SHA256 signature", () => {
    const body = JSON.stringify({
      event: "PAYMENT_SUCCESS",
      transaction_id: "tx-1",
      amount: 50000,
    });
    const sig = makeSignature(body);
    expect(verifyUzumPaySignature(body, sig)).toBe(true);
  });

  it("rejects wrong signature", () => {
    const body = JSON.stringify({ event: "PAYMENT_SUCCESS" });
    expect(verifyUzumPaySignature(body, "badhash")).toBe(false);
  });

  it("rejects tampered body", () => {
    const body = '{"event":"PAYMENT_SUCCESS","amount":50000}';
    const sig = makeSignature(body);
    const tampered = '{"event":"PAYMENT_SUCCESS","amount":99999}';
    expect(verifyUzumPaySignature(tampered, sig)).toBe(false);
  });

  it("maps PAYMENT_SUCCESS → success", () => {
    const body = { event: "PAYMENT_SUCCESS", transaction_id: "tx-1", amount: 50000 };
    const result = parseUzumPayWebhook(body);
    expect(result.status).toBe("success");
    expect(result.transactionId).toBe("tx-1");
    expect(result.amountTiyin).toBe(50000);
    expect(result.gateway).toBe("uzumpay");
  });

  it("maps PAYMENT_FAILED → failed", () => {
    const result = parseUzumPayWebhook({ event: "PAYMENT_FAILED", transaction_id: "tx-2" });
    expect(result.status).toBe("failed");
  });

  it("maps PAYMENT_CANCELLED → cancelled", () => {
    const result = parseUzumPayWebhook({ event: "PAYMENT_CANCELLED", transaction_id: "tx-3" });
    expect(result.status).toBe("cancelled");
  });

  it("maps PAYMENT_REFUNDED → refunded", () => {
    const result = parseUzumPayWebhook({ event: "PAYMENT_REFUNDED", transaction_id: "tx-4" });
    expect(result.status).toBe("refunded");
  });

  it("timing-safe compare: same-length bad value returns false", () => {
    const body = "test body";
    const realSig = makeSignature(body);
    const fakeSig = "a".repeat(realSig.length); // same length, different value
    expect(verifyUzumPaySignature(body, fakeSig)).toBe(false);
  });
});
