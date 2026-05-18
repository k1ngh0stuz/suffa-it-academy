import { NextRequest, NextResponse } from "next/server";
import {
  verifyPaymeAuth,
  parsePaymeWebhook,
  buildPaymeError,
  buildPaymeResult,
  PaymeError,
  type PaymeRpcRequest,
} from "@/lib/payments/payme";
import { processWebhookResult } from "@/lib/payments/processor";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  let verified: boolean;
  try {
    verified = verifyPaymeAuth(authHeader);
  } catch (err) {
    console.error("PayMe auth verification error:", err);
    return NextResponse.json(buildPaymeError(PaymeError.WrongPassword, "Configuration error", 0));
  }

  if (!verified) {
    return NextResponse.json(buildPaymeError(PaymeError.WrongPassword, "Unauthorized", 0), {
      status: 401,
    });
  }

  let body: PaymeRpcRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(buildPaymeError(PaymeError.MethodNotFound, "Invalid JSON", 0), {
      status: 400,
    });
  }

  const { id, method } = body;

  // Methods that don't mutate state — reply immediately
  if (method === "CheckPerformTransaction" || method === "GetStatement") {
    return NextResponse.json(buildPaymeResult({ allow: true }, id));
  }

  try {
    const result = parsePaymeWebhook(body);
    await processWebhookResult(result);

    const now = Date.now();
    if (method === "CreateTransaction") {
      return NextResponse.json(
        buildPaymeResult({ create_time: now, transaction: String(body.params.id), state: 1 }, id),
      );
    }
    if (method === "PerformTransaction") {
      return NextResponse.json(
        buildPaymeResult({ perform_time: now, transaction: String(body.params.id), state: 2 }, id),
      );
    }
    if (method === "CancelTransaction") {
      return NextResponse.json(
        buildPaymeResult(
          {
            cancel_time: now,
            transaction: String(body.params.id),
            state: -1,
          },
          id,
        ),
      );
    }
    if (method === "CheckTransaction") {
      return NextResponse.json(buildPaymeResult({ state: 2, create_time: now }, id));
    }

    return NextResponse.json(buildPaymeResult({ status: "ok" }, id));
  } catch (err) {
    console.error("PayMe webhook processing error:", err);
    return NextResponse.json(buildPaymeError(PaymeError.UnablePerform, "Internal error", id), {
      status: 500,
    });
  }
}
