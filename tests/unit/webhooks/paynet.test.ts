import { describe, it, expect } from "vitest";
import crypto from "crypto";

const MERCHANT_ID = "paynet-merchant-1";
const SECRET = "paynet-secret-xyz";
process.env.PAYNET_MERCHANT_ID = MERCHANT_ID;
process.env.PAYNET_SECRET = SECRET;

import { verifyPaynetSignature, parsePaynetWebhook } from "@/lib/payments/paynet";

function makeSign(transactionId: string, amount: string): string {
  const str = [MERCHANT_ID, transactionId, amount, SECRET].join("");
  return crypto.createHash("md5").update(str, "utf8").digest("hex");
}

describe("Paynet webhook", () => {
  describe("verifyPaynetSignature", () => {
    it("accepts valid MD5 signature", () => {
      const params = {
        transaction_id: "paynet-1",
        amount: "50000",
        sign: makeSign("paynet-1", "50000"),
      };
      expect(verifyPaynetSignature(params)).toBe(true);
    });

    it("rejects wrong signature", () => {
      const params = {
        transaction_id: "paynet-1",
        amount: "50000",
        sign: "badhash00000000000000000000000000",
      };
      expect(verifyPaynetSignature(params)).toBe(false);
    });

    it("rejects tampered amount", () => {
      const realSign = makeSign("paynet-1", "50000");
      const params = {
        transaction_id: "paynet-1",
        amount: "99999",
        sign: realSign,
      };
      expect(verifyPaynetSignature(params)).toBe(false);
    });
  });

  describe("parsePaynetWebhook", () => {
    it("maps status=success → success", () => {
      const result = parsePaynetWebhook({
        status: "success",
        transaction_id: "pn-1",
        amount: 30000,
      });
      expect(result.status).toBe("success");
      expect(result.transactionId).toBe("pn-1");
      expect(result.amountTiyin).toBe(30000);
    });

    it("maps status=failed → failed", () => {
      expect(parsePaynetWebhook({ status: "failed", transaction_id: "pn-2" }).status).toBe(
        "failed",
      );
    });

    it("maps status=cancelled → cancelled", () => {
      expect(parsePaynetWebhook({ status: "cancelled", transaction_id: "pn-3" }).status).toBe(
        "cancelled",
      );
    });

    it("maps status=pending → pending", () => {
      expect(parsePaynetWebhook({ status: "pending", transaction_id: "pn-4" }).status).toBe(
        "pending",
      );
    });

    it("gateway is always paynet", () => {
      expect(parsePaynetWebhook({ status: "success", transaction_id: "x" }).gateway).toBe("paynet");
    });
  });
});
