import type { Metadata } from "next";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatPrice } from "@/lib/utils";
import type { Payment, Course, Profile, PaymentGateway } from "@/types";

export const metadata: Metadata = { title: "Журнал платежей" };
export const revalidate = 0;

const GATEWAY_LABELS: Record<PaymentGateway, string> = {
  uzumpay: "UzumPay",
  payme: "PayMe",
  paynet: "Paynet",
  click: "Click",
};

export default async function AdminPaymentsPage() {
  const supabase = getSupabaseServerClient();

  const [{ data: payments }] = await Promise.all([
    supabase
      .from("payments")
      .select("*, profile:profiles(email, full_name), course:courses(title)")
      .order("created_at", { ascending: false })
      .limit(200),
  ]);

  // Revenue by gateway
  const revenue: Record<PaymentGateway, number> = {
    uzumpay: 0,
    payme: 0,
    paynet: 0,
    click: 0,
  };
  const rows = (payments ?? []) as (Payment & {
    profile: Pick<Profile, "email" | "full_name">;
    course: Pick<Course, "title">;
  })[];

  for (const p of rows) {
    if (p.status === "success") {
      revenue[p.gateway] = (revenue[p.gateway] ?? 0) + p.amount_tiyin;
    }
  }

  const totalRevenue = Object.values(revenue).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-100">Журнал платежей</h1>

      {/* Revenue stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
        <div className="border-white/8 rounded-xl border bg-surface-raised p-4 lg:col-span-1">
          <div className="text-xs text-slate-500">Всего выручки</div>
          <div className="mt-1 text-lg font-bold text-brand-cyan">{formatPrice(totalRevenue)}</div>
        </div>
        {(Object.keys(revenue) as PaymentGateway[]).map((gw) => (
          <div key={gw} className="border-white/8 rounded-xl border bg-surface-raised p-4">
            <div className="text-xs text-slate-500">{GATEWAY_LABELS[gw]}</div>
            <div className="mt-1 text-base font-bold text-slate-200">
              {formatPrice(revenue[gw])}
            </div>
          </div>
        ))}
      </div>

      {/* Payments table */}
      <div className="border-white/8 overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-white/8 border-b text-left text-xs text-slate-500">
              <th className="px-4 py-3">Ученик</th>
              <th className="px-4 py-3">Курс</th>
              <th className="px-4 py-3">Шлюз</th>
              <th className="px-4 py-3">Сумма</th>
              <th className="px-4 py-3">Статус</th>
              <th className="px-4 py-3">Дата</th>
              <th className="px-4 py-3">Transaction ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((p) => (
              <tr key={p.id} className="hover:bg-white/2">
                <td className="px-4 py-3 text-slate-300">
                  {p.profile.full_name ?? p.profile.email}
                  <div className="text-xs text-slate-600">{p.profile.email}</div>
                </td>
                <td className="px-4 py-3 text-slate-300">{p.course.title}</td>
                <td className="px-4 py-3">
                  <Badge variant="indigo">{GATEWAY_LABELS[p.gateway]}</Badge>
                </td>
                <td className="px-4 py-3 font-semibold text-slate-200">
                  {formatPrice(p.amount_tiyin)}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant={
                      p.status === "success" ? "green" : p.status === "pending" ? "yellow" : "red"
                    }
                  >
                    {p.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{formatDate(p.created_at)}</td>
                <td
                  className="max-w-[140px] truncate px-4 py-3 text-xs text-slate-600"
                  title={p.transaction_id}
                >
                  {p.transaction_id}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="p-6 text-center text-sm text-slate-500">Платежей пока нет</p>
        )}
      </div>
    </div>
  );
}
