import { describe, it, expect } from "vitest";
import crypto from "crypto";

const SERVICE_ID = "click-svc-1";
const SECRET = "click-secret-key";
process.env.CLICK_SERVICE_ID = SERVICE_ID;
process.env.CLICK_SECRET_KEY = SECRET;

import { verifyClickSignature, parseClickWebhook } from "@/lib/payments/click";
import { uzsToTiyin } from "@/lib/payments/base";

function makeClickSignature(params: {
  click_trans_id: string;
  service_id: string;
  merchant_trans_id: string;
  amount: string;
  action: string;
  sign_time: string;
}): string {
  const str = [
    params.click_trans_id,
    params.service_id,
    SECRET,
    params.merchant_trans_id,
    params.amount,
    params.action,
    params.sign_time,
  ].join("");
  return crypto.createHash("md5").update(str, "utf8").digest("hex");
}

describe("Click webhook", () => {
  const baseParams = {
    click_trans_id: "click-1",
    service_id: SERVICE_ID,
    merchant_trans_id: "mch-1",
    amount: "500.00", // UZS decimal
    action: "1",
    sign_time: "2025-01-01 00:00:00",
  };

  describe("verifyClickSignature", () => {
    it("accepts valid MD5 signature", () => {
      const sign_string = makeClickSignature(baseParams);
      expect(verifyClickSignature({ ...baseParams, sign_string })).toBe(true);
    });

    it("rejects wrong signature", () => {
      expect(verifyClickSignature({ ...baseParams, sign_string: "bad" })).toBe(false);
    });

    it("rejects tampered amount", () => {
      const sign_string = makeClickSignature(baseParams);
      expect(verifyClickSignature({ ...baseParams, amount: "9999.00", sign_string })).toBe(false);
    });
  });

  describe("parseClickWebhook", () => {
    it("action=1 maps to success", () => {
      const result = parseClickWebhook({ ...baseParams, action: 1, amount: 500 });
      expect(result.status).toBe("success");
      expect(result.gateway).toBe("click");
    });

    it("action=0 (Prepare) maps to pending", () => {
      const result = parseClickWebhook({ ...baseParams, action: 0, amount: 500 });
      expect(result.status).toBe("pending");
    });

    it("converts UZS decimal to tiyin correctly", () => {
      const result = parseClickWebhook({ ...baseParams, action: 1, amount: 250.5 });
      expect(result.amountTiyin).toBe(uzsToTiyin(250.5));
      expect(result.amountTiyin).toBe(25050);
    });

    it("converts string amount to tiyin", () => {
      const result = parseClickWebhook({ ...baseParams, action: 1, amount: "100.00" });
      expect(result.amountTiyin).toBe(10000);
    });

    it("uses click_trans_id as transactionId", () => {
      const result = parseClickWebhook({ click_trans_id: "clk-99", action: 1, amount: 100 });
      expect(result.transactionId).toBe("clk-99");
    });
  });

  describe("tiyin conversions", () => {
    it("uzsToTiyin(500) = 50000", () => expect(uzsToTiyin(500)).toBe(50000));
    it("uzsToTiyin(0.01) = 1", () => expect(uzsToTiyin(0.01)).toBe(1));
    it("uzsToTiyin(0) = 0", () => expect(uzsToTiyin(0)).toBe(0));
  });
});
