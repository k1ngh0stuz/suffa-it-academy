"use client";

import { useState, useTransition, useRef } from "react";
import { User } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { updateProfileAction } from "@/actions/profile";
import { useLanguage } from "@/lib/i18n/context";
import type { ActionResult } from "@/types";

interface Props {
  initialName: string | null;
  initialPhone: string | null;
  initialAvatarUrl: string | null;
  userId: string;
}

export function ProfileEditForm({ initialName, initialPhone, initialAvatarUrl, userId }: Props) {
  const { t } = useLanguage();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl);
  const [uploading, setUploading] = useState(false);
  const [state, setState] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const ext = file.name.split(".").pop();
      const path = `${userId}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("avatars").upload(path, file, {
        upsert: true,
      });
      if (error) {
        setState({ error: error.message });
        return;
      }
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      setAvatarUrl(data.publicUrl);
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    // Ensure avatarUrl from state is included
    if (avatarUrl !== null) {
      fd.set("avatar_url", avatarUrl);
    }
    startTransition(async () => {
      const result = await updateProfileAction(null, fd);
      setState(result);
    });
  }

  return (
    <div className="border-white/8 mt-6 rounded-2xl border bg-surface-raised p-6">
      <h2 className="mb-4 text-lg font-semibold text-slate-100">{t.profilePage.editTitle}</h2>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        {/* Avatar */}
        <div>
          <label className="mb-2 block text-xs text-slate-500">{t.profilePage.avatar}</label>
          <div className="flex items-center gap-4">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-700">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <User className="h-8 w-8 text-slate-400" />
              )}
            </div>
            <label className="cursor-pointer rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-400 transition-colors hover:border-brand-cyan/40 hover:text-brand-cyan">
              {uploading ? "..." : t.profilePage.uploadPhoto}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
          </div>
          <input type="hidden" name="avatar_url" value={avatarUrl ?? ""} />
        </div>

        {/* Full name */}
        <div>
          <label className="mb-1 block text-xs text-slate-500">{t.profilePage.name}</label>
          <input
            type="text"
            name="full_name"
            defaultValue={initialName ?? ""}
            className="w-full rounded-lg border border-white/10 bg-slate-800/50 px-3 py-2 text-sm text-slate-200 outline-none focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/20"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="mb-1 block text-xs text-slate-500">{t.profilePage.phone}</label>
          <input
            type="text"
            name="phone"
            defaultValue={initialPhone ?? ""}
            placeholder="+998 xx xxx xx xx"
            className="w-full rounded-lg border border-white/10 bg-slate-800/50 px-3 py-2 text-sm text-slate-200 outline-none focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/20"
          />
        </div>

        {/* Feedback */}
        {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
        {state?.success && <p className="text-sm text-emerald-400">{state.success}</p>}

        <button
          type="submit"
          disabled={pending || uploading}
          className="rounded-lg bg-brand-cyan px-5 py-2 text-sm font-semibold text-slate-900 shadow-cyan-glow transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? t.profilePage.saving : t.profilePage.save}
        </button>
      </form>
    </div>
  );
}
