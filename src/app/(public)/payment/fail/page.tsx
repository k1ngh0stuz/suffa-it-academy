import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Ошибка оплаты" };

export default function PaymentFailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-hero-gradient px-4">
      <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-red-500/5 p-10 text-center">
        <XCircle className="mx-auto mb-4 h-16 w-16 text-red-400" />
        <h1 className="mb-2 text-2xl font-bold text-slate-100">Оплата не прошла</h1>
        <p className="mb-8 text-slate-400">
          Платёж был отклонён или отменён. Попробуйте снова или выберите другой способ оплаты. Если
          проблема повторяется, свяжитесь с нами в Telegram.
        </p>
        <div className="flex flex-col gap-3">
          <Button asChild>
            <Link href="/#courses">Попробовать снова</Link>
          </Button>
          <Button variant="secondary" asChild>
            <a href="https://t.me/suffaitacademy" target="_blank" rel="noopener noreferrer">
              Написать в Telegram
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
