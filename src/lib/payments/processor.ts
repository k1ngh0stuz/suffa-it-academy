// Shared webhook processing logic — idempotent enrollment creation
import type { GatewayWebhookResult } from "./base";
import { sendEnrollmentEmail } from "@/lib/email/resend";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = any;

export async function processWebhookResult(result: GatewayWebhookResult): Promise<void> {
  // Dynamic import avoids Supabase errors when env is missing in tests
  const { getSupabaseServiceClient } = await import("@/lib/supabase/server");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase: AnyClient = getSupabaseServiceClient();

  const { transactionId, status, amountTiyin, gateway, rawPayload } = result;

  // 1. Upsert the payment record (idempotent via unique(gateway, transaction_id))
  const { data: existingPayment } = await supabase
    .from("payments")
    .select("id, user_id, course_id, status")
    .eq("gateway", gateway)
    .eq("transaction_id", transactionId)
    .single();

  if (existingPayment) {
    // Already processed to a terminal state — do not re-process
    if (existingPayment.status === "success" && status === "success") return;

    await supabase
      .from("payments")
      .update({ status, raw_payload: rawPayload, updated_at: new Date().toISOString() })
      .eq("id", existingPayment.id);

    // If newly succeeded, create enrollment
    if (status === "success" && existingPayment.status !== "success") {
      await grantEnrollment(supabase, existingPayment.user_id, existingPayment.course_id);
    }
    return;
  }

  // 2. For new payment records we need user/course from the transaction
  //    (merchant_trans_id should encode `userId:courseId`)
  const [userId, courseId] = parseTransactionId(transactionId);
  if (!userId || !courseId) {
    console.error(`Cannot parse userId/courseId from transactionId: ${transactionId}`);
    return;
  }

  await supabase.from("payments").insert({
    user_id: userId,
    course_id: courseId,
    gateway,
    status,
    amount_tiyin: amountTiyin ?? 0,
    transaction_id: transactionId,
    raw_payload: rawPayload,
  });

  if (status === "success") {
    await grantEnrollment(supabase, userId, courseId);
  }
}

async function grantEnrollment(
  supabase: AnyClient,
  userId: string,
  courseId: string,
): Promise<void> {
  // Upsert enrollment — if already active don't create a duplicate
  await supabase
    .from("enrollments")
    .upsert(
      { user_id: userId, course_id: courseId, status: "active" },
      { onConflict: "user_id,course_id" },
    );

  // Send confirmation email (non-blocking — failures are swallowed)
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", userId)
      .single();

    const { data: course } = await supabase
      .from("courses")
      .select("title")
      .eq("id", courseId)
      .single();

    if (profile?.email && course?.title) {
      await sendEnrollmentEmail({
        to: profile.email,
        name: profile.full_name ?? profile.email,
        courseTitle: course.title,
      });
    }
  } catch (err) {
    console.error("Enrollment email failed (non-fatal):", err);
  }
}

// Encode transactionId as `userId:courseId` when initiating payment
export function buildTransactionId(userId: string, courseId: string): string {
  return `${userId}:${courseId}`;
}

export function parseTransactionId(transactionId: string): [string | null, string | null] {
  const parts = transactionId.split(":");
  if (parts.length < 2) return [null, null];
  return [parts[0], parts[1]];
}
