import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { buildTransactionId } from "@/lib/payments/processor";
import type { PaymentGateway } from "@/types";

// Placeholder — generates redirect URLs for each gateway
// Replace the redirect URLs with real gateway initiation API calls

const GATEWAY_CHECKOUT_URLS: Record<PaymentGateway, string> = {
  uzumpay: process.env.UZUMPAY_API_BASE ?? "https://api.uzum.uz/pay/create",
  payme: process.env.PAYME_CHECKOUT_URL ?? "https://checkout.paycom.uz",
  paynet: process.env.PAYNET_CHECKOUT_URL ?? "https://paynet.uz/checkout",
  click: `https://my.click.uz/services/pay?service_id=${process.env.CLICK_SERVICE_ID}&merchant_id=${process.env.CLICK_MERCHANT_ID}`,
};

export async function POST(req: NextRequest) {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const { courseId, gateway } = (await req.json()) as {
    courseId: string;
    gateway: PaymentGateway;
  };

  const courseResult = await supabase
    .from("courses")
    .select("id, price_tiyin, title")
    .eq("id", courseId)
    .single();
  const course = courseResult.data as {
    id: string;
    price_tiyin: number | null;
    title: string;
  } | null;

  if (!course) return NextResponse.json({ error: "course_not_found" }, { status: 404 });
  if (course.price_tiyin === null)
    return NextResponse.json({ error: "price_not_set" }, { status: 400 });

  const transactionId = buildTransactionId(user.id, courseId);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  // Create pending payment record
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from("payments") as any).upsert(
    {
      user_id: user.id,
      course_id: courseId,
      gateway,
      status: "pending",
      amount_tiyin: course.price_tiyin,
      transaction_id: transactionId,
    },
    { onConflict: "gateway,transaction_id" },
  );

  const base = GATEWAY_CHECKOUT_URLS[gateway];
  const params = new URLSearchParams({
    merchant_trans_id: transactionId,
    amount: String(course.price_tiyin / 100), // UZS decimal for most gateways
    return_url: `${appUrl}/payment/success`,
    cancel_url: `${appUrl}/payment/fail`,
  });

  return NextResponse.json({ redirectUrl: `${base}?${params}` });
}
