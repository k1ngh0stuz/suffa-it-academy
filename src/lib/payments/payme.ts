// PayMe — full JSON-RPC 2.0 implementation
// Auth: Basic `Paycom:<PAYME_MERCHANT_KEY>`
// Methods: CheckPerformTransaction, CreateTransaction, PerformTransaction, CancelTransaction, CheckTransaction, GetStatement

import type { GatewayWebhookResult } from "./base";

// PayMe error codes
export const PaymeError = {
  InvalidAmount: -31001,
  InvalidAccount: -31050,
  WrongPassword: -32504,
  MethodNotFound: -32601,
  AlreadyDone: -31060,
  UnablePerform: -31008,
  CancelledByUser: -31007,
} as const;

export interface PaymeRpcRequest {
  method: string;
  params: Record<string, unknown>;
  id: string | number;
}

export interface PaymeRpcResponse {
  result?: Record<string, unknown>;
  error?: { code: number; message: { ru: string; uz: string; en: string }; data?: unknown };
  id: string | number;
}

export function verifyPaymeAuth(authHeader: string | null): boolean {
  if (!authHeader) return false;
  const merchantId = process.env.PAYME_MERCHANT_ID;
  const merchantKey = process.env.PAYME_MERCHANT_KEY;
  if (!merchantId || !merchantKey) throw new Error("PayMe credentials not configured");

  const expected = `Basic ${Buffer.from(`Paycom:${merchantKey}`).toString("base64")}`;
  return authHeader === expected;
}

export function parsePaymeWebhook(body: PaymeRpcRequest): GatewayWebhookResult {
  const { method, params } = body;
  const transactionId = String(params.id ?? params.transaction ?? "");

  let status: GatewayWebhookResult["status"] = "pending";

  switch (method) {
    case "PerformTransaction":
      status = "success";
      break;
    case "CancelTransaction":
      status = "cancelled";
      break;
    case "CreateTransaction":
      status = "pending";
      break;
    default:
      status = "pending";
  }

  // PayMe sends amount in tiyin
  const amountTiyin =
    typeof params.amount === "number"
      ? params.amount
      : typeof (params.amount as Record<string, unknown>)?.tiyin === "number"
        ? (params.amount as Record<string, unknown>).tiyin
        : undefined;

  return {
    transactionId,
    status,
    amountTiyin: amountTiyin as number | undefined,
    gateway: "payme",
    rawPayload: body as unknown as Record<string, unknown>,
  };
}

export function buildPaymeError(
  code: number,
  message: string,
  id: string | number,
): PaymeRpcResponse {
  return {
    error: {
      code,
      message: { ru: message, uz: message, en: message },
    },
    id,
  };
}

export function buildPaymeResult(
  result: Record<string, unknown>,
  id: string | number,
): PaymeRpcResponse {
  return { result, id };
}
