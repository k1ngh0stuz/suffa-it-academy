import { describe, it, expect } from "vitest";

process.env.PAYME_MERCHANT_ID = "test-merchant";
process.env.PAYME_MERCHANT_KEY = "test-payme-key-secret";

import {
  verifyPaymeAuth,
  parsePaymeWebhook,
  buildPaymeError,
  buildPaymeResult,
  PaymeError,
} from "@/lib/payments/payme";

function makeBasicAuth(key: string): string {
  return `Basic ${Buffer.from(`Paycom:${key}`).toString("base64")}`;
}

describe("PayMe webhook", () => {
  describe("verifyPaymeAuth", () => {
    it("accepts correct Basic auth", () => {
      expect(verifyPaymeAuth(makeBasicAuth("test-payme-key-secret"))).toBe(true);
    });

    it("rejects wrong key", () => {
      expect(verifyPaymeAuth(makeBasicAuth("wrong-key"))).toBe(false);
    });

    it("rejects missing header", () => {
      expect(verifyPaymeAuth(null)).toBe(false);
    });
  });

  describe("parsePaymeWebhook", () => {
    it("maps PerformTransaction → success", () => {
      const result = parsePaymeWebhook({
        method: "PerformTransaction",
        params: { id: "pay-tx-1", amount: 100000 },
        id: 1,
      });
      expect(result.status).toBe("success");
      expect(result.transactionId).toBe("pay-tx-1");
      expect(result.gateway).toBe("payme");
    });

    it("maps CreateTransaction → pending", () => {
      const result = parsePaymeWebhook({
        method: "CreateTransaction",
        params: { id: "pay-tx-2", amount: 200000 },
        id: 2,
      });
      expect(result.status).toBe("pending");
    });

    it("maps CancelTransaction → cancelled", () => {
      const result = parsePaymeWebhook({
        method: "CancelTransaction",
        params: { id: "pay-tx-3" },
        id: 3,
      });
      expect(result.status).toBe("cancelled");
    });

    it("extracts tiyin amount from number", () => {
      const result = parsePaymeWebhook({
        method: "PerformTransaction",
        params: { id: "tx", amount: 75000 },
        id: 1,
      });
      expect(result.amountTiyin).toBe(75000);
    });
  });

  describe("builders", () => {
    it("buildPaymeError shapes correctly", () => {
      const res = buildPaymeError(PaymeError.InvalidAmount, "Bad amount", 42);
      expect(res.error?.code).toBe(PaymeError.InvalidAmount);
      expect(res.id).toBe(42);
    });

    it("buildPaymeResult shapes correctly", () => {
      const res = buildPaymeResult({ state: 2 }, 99);
      expect(res.result?.state).toBe(2);
      expect(res.id).toBe(99);
    });
  });
});
