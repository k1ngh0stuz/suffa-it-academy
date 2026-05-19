"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResetPasswordConfirmPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirm = formData.get("confirm") as string;

    if (password.length < 6) {
      setError("Пароль должен быть не менее 6 символов");
      return;
    }
    if (password !== confirm) {
      setError("Пароли не совпадают");
      return;
    }

    startTransition(async () => {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(error.message);
      } else {
        router.push("/dashboard");
      }
    });
  }

  return (
    <div className="border-white/8 w-full max-w-md rounded-2xl border bg-surface-raised p-8">
      <h1 className="mb-2 text-2xl font-bold text-slate-100">Новый пароль</h1>
      <p className="mb-6 text-sm text-slate-400">Введите новый пароль для вашего аккаунта.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="password"
          type="password"
          label="Новый пароль"
          placeholder="Минимум 6 символов"
          required
        />
        <Input
          name="confirm"
          type="password"
          label="Подтвердите пароль"
          placeholder="Повторите пароль"
          required
        />

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" loading={pending}>
          Сохранить пароль
        </Button>
      </form>
    </div>
  );
}
