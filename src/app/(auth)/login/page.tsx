"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { loginAction } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/types";

export default function LoginPage() {
  const [state, setState] = useState<ActionResult<never> | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await loginAction(null, formData);
      setState(result);
    });
  }

  return (
    <div className="border-white/8 w-full max-w-md rounded-2xl border bg-surface-raised p-8">
      <h1 className="mb-2 text-2xl font-bold text-slate-100">Вход в систему</h1>
      <p className="mb-6 text-sm text-slate-400">
        Нет аккаунта?{" "}
        <Link href="/register" className="text-brand-cyan hover:underline">
          Зарегистрируйтесь
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="email" type="email" label="Email" placeholder="you@example.com" required />
        <Input name="password" type="password" label="Пароль" placeholder="••••••••" required />

        {state?.error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {state.error}
          </p>
        )}
        {state?.success && (
          <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
            {state.success}
          </p>
        )}

        <Button type="submit" className="w-full" loading={pending}>
          Войти
        </Button>
      </form>

      <div className="mt-4 text-center">
        <Link href="/reset-password" className="text-sm text-slate-500 hover:text-brand-cyan">
          Забыли пароль?
        </Link>
      </div>
    </div>
  );
}
