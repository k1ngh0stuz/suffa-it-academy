import type { PaymentGateway, PaymentStatus } from "@/types";

export interface GatewayWebhookResult {
  transactionId: string;
  status: PaymentStatus;
  amountTiyin?: number;
  gateway: PaymentGateway;
  rawPayload: Record<string, unknown>;
}

// Timing-safe string compare to prevent timing attacks on webhook secrets
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// Convert tiyin to decimal UZS (for Click which expects UZS decimal)
export function tiyinToUzs(tiyin: number): number {
  return tiyin / 100;
}

// Convert UZS decimal to tiyin
export function uzsToTiyin(uzs: number): number {
  return Math.round(uzs * 100);
}
