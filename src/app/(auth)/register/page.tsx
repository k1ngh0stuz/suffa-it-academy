"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { registerAction } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/types";

export default function RegisterPage() {
  const [state, setState] = useState<ActionResult<never> | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await registerAction(null, formData);
      setState(result);
    });
  }

  return (
    <div className="border-white/8 w-full max-w-md rounded-2xl border bg-surface-raised p-8">
      <h1 className="mb-2 text-2xl font-bold text-slate-100">Создать аккаунт</h1>
      <p className="mb-6 text-sm text-slate-400">
        Уже есть аккаунт?{" "}
        <Link href="/login" className="text-brand-cyan hover:underline">
          Войдите
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="full_name" label="Ваше имя" placeholder="Иван Иванов" required />
        <Input name="email" type="email" label="Email" placeholder="you@example.com" required />
        <Input
          name="password"
          type="password"
          label="Пароль"
          placeholder="Минимум 6 символов"
          required
        />

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
          Зарегистрироваться
        </Button>
      </form>

      <p className="mt-4 text-center text-xs text-slate-600">
        Регистрируясь, вы принимаете условия использования платформы
      </p>
    </div>
  );
}
