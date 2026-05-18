import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { ProfileEditForm } from "@/components/profile/profile-edit-form";
import type { Profile } from "@/types";

export const metadata: Metadata = { title: "Профиль" };

export default async function ProfilePage() {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  const p = profile as unknown as Profile;

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 text-2xl font-bold text-slate-100">Профиль</h1>

      <div className="border-white/8 space-y-4 rounded-2xl border bg-surface-raised p-6">
        <div>
          <label className="mb-1 block text-xs text-slate-500">Имя</label>
          <p className="text-slate-200">{p?.full_name ?? "—"}</p>
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">Email</label>
          <p className="text-slate-200">{p?.email ?? user.email}</p>
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">Телефон</label>
          <p className="text-slate-200">{p?.phone ?? "—"}</p>
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">Роль</label>
          <p className="capitalize text-slate-200">{p?.role ?? "student"}</p>
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">Аккаунт создан</label>
          <p className="text-slate-200">
            {p?.created_at ? new Date(p.created_at).toLocaleDateString("ru-RU") : "—"}
          </p>
        </div>
      </div>

      <ProfileEditForm
        initialName={p?.full_name ?? null}
        initialPhone={p?.phone ?? null}
        initialAvatarUrl={p?.avatar_url ?? null}
        userId={user.id}
      />
    </div>
  );
}
