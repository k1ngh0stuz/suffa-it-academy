import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Оплата прошла успешно" };

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-hero-gradient px-4">
      <div className="w-full max-w-md rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-10 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-emerald-400" />
        <h1 className="mb-2 text-2xl font-bold text-slate-100">Оплата прошла успешно!</h1>
        <p className="mb-8 text-slate-400">
          Ваш платёж обрабатывается. Доступ к курсу появится в течение нескольких минут. Письмо с
          подтверждением отправлено на вашу почту.
        </p>
        <div className="flex flex-col gap-3">
          <Button asChild>
            <Link href="/dashboard">Перейти в личный кабинет</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/">На главную</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
