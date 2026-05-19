"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types";

const loginSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(6, "Минимум 6 символов"),
});

const registerSchema = loginSchema.extend({
  full_name: z.string().min(2, "Введите имя (минимум 2 символа)"),
});

export async function loginAction(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const raw = { email: formData.get("email"), password: formData.get("password") };
  const parsed = loginSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ошибка валидации" };
  }

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) return { error: error.message };
  redirect("/dashboard");
}

export async function registerAction(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
    full_name: formData.get("full_name"),
  };
  const parsed = registerSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ошибка валидации" };
  }

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.full_name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    },
  });

  if (error) return { error: error.message };
  return { success: "Проверьте почту — мы отправили ссылку для подтверждения." };
}

export async function resetPasswordAction(
  _prev: unknown,
  formData: FormData,
): Promise<ActionResult> {
  const email = formData.get("email") as string;
  if (!email || !email.includes("@")) return { error: "Введите корректный email" };

  const supabase = getSupabaseServerClient();
  const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/confirm`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

  if (error) return { error: error.message };
  return { success: "Ссылка для сброса пароля отправлена на вашу почту." };
}

export async function signOutAction(): Promise<void> {
  const supabase = getSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}
