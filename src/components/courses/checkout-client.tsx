"use client";

import { useState } from "react";
import { Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { Course } from "@/types";

interface CheckoutClientProps {
  course: Course;
  userId: string;
}

const PAYMENTS_ENABLED = process.env.NEXT_PUBLIC_PAYMENTS_ENABLED === "true";

const GATEWAYS = [
  { id: "uzumpay", name: "UzumPay", logo: "🟠", description: "Uzum Market" },
  { id: "payme", name: "PayMe", logo: "🔵", description: "Payme.uz" },
  { id: "click", name: "Click", logo: "🟢", description: "Click.uz" },
  { id: "paynet", name: "Paynet", logo: "🟣", description: "Paynet.uz" },
] as const;

type GatewayId = (typeof GATEWAYS)[number]["id"];

export function CheckoutClient({ course }: CheckoutClientProps) {
  const [selected, setSelected] = useState<GatewayId | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    if (!selected) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id, gateway: selected }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ошибка создания платежа");
      window.location.href = data.redirectUrl;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-lg">
      {/* Course info */}
      <div className="border-white/8 mb-6 rounded-2xl border bg-surface-raised p-6">
        <h2 className="mb-1 text-sm text-slate-500">Вы покупаете:</h2>
        <h1 className="mb-2 text-2xl font-bold text-slate-100">{course.title}</h1>
        <div className="flex items-center gap-3">
          <Badge variant="cyan">Полный доступ</Badge>
          <span className="text-lg font-bold text-brand-cyan">
            {formatPrice(course.price_tiyin)}
          </span>
        </div>
      </div>

      {PAYMENTS_ENABLED ? (
        <>
          <div className="border-white/8 mb-6 rounded-2xl border bg-surface-raised p-6">
            <h2 className="mb-4 font-semibold text-slate-100">Выберите способ оплаты</h2>
            <div className="grid grid-cols-2 gap-3">
              {GATEWAYS.map((gw) => (
                <button
                  key={gw.id}
                  onClick={() => setSelected(gw.id)}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                    selected === gw.id
                      ? "border-brand-cyan bg-brand-cyan/10 shadow-cyan-glow"
                      : "border-white/8 bg-surface-DEFAULT hover:border-white/20"
                  }`}
                >
                  <span className="text-2xl">{gw.logo}</span>
                  <span className="text-sm font-semibold text-slate-200">{gw.name}</span>
                  <span className="text-xs text-slate-500">{gw.description}</span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <Button
            className="w-full"
            size="lg"
            disabled={!selected}
            loading={loading}
            onClick={handlePay}
          >
            Перейти к оплате
          </Button>
          <p className="mt-3 text-center text-xs text-slate-600">
            Нажимая кнопку, вы принимаете условия оферты
          </p>
        </>
      ) : (
        /* ── Payments disabled — contact mode ── */
        <div className="border-white/8 rounded-2xl border bg-surface-raised p-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-cyan/10">
            <Phone className="h-6 w-6 text-brand-cyan" />
          </div>
          <h2 className="mb-2 text-lg font-bold text-slate-100">Свяжитесь с нами</h2>
          <p className="mb-6 text-sm text-slate-400">
            Для записи на курс свяжитесь с нами по телефону или напишите в Telegram — мы оформим
            доступ вручную.
          </p>
          <div className="space-y-3">
            <a
              href="tel:+998501556700"
              className="flex items-center justify-center gap-2 rounded-xl border border-brand-cyan/30 bg-brand-cyan/10 px-4 py-3 text-sm font-semibold text-brand-cyan transition hover:bg-brand-cyan/20"
            >
              <Phone className="h-4 w-4" />
              +998 50 155 67 00
            </a>
            <a
              href="https://t.me/suffaitacademy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-brand-indigo/30 bg-brand-indigo/10 px-4 py-3 text-sm font-semibold text-brand-indigo transition hover:bg-brand-indigo/20"
            >
              <Send className="h-4 w-4" />
              @suffaitacademy
            </a>
          </div>
          <p className="mt-4 text-xs text-slate-600">Мы отвечаем ежедневно с 9:00 до 21:00</p>
        </div>
      )}
    </div>
  );
}
