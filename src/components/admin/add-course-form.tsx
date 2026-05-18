"use client";

import { useState, useTransition, useRef } from "react";
import { createCourseAction } from "@/actions/admin";
import type { ActionResult } from "@/types";

export function AddCourseForm() {
  const [state, setState] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createCourseAction(null, fd);
      setState(result);
      if (result.success) {
        formRef.current?.reset();
      }
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="border-white/8 space-y-3 rounded-xl border bg-surface-raised p-5"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-slate-500">Название</label>
          <input
            type="text"
            name="title"
            required
            placeholder="Network Engineer"
            className="w-full rounded-lg border border-white/10 bg-slate-800/50 px-3 py-2 text-sm text-slate-200 outline-none focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/20"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">Slug</label>
          <input
            type="text"
            name="slug"
            required
            placeholder="network-engineer"
            className="w-full rounded-lg border border-white/10 bg-slate-800/50 px-3 py-2 text-sm text-slate-200 outline-none focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/20"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs text-slate-500">Описание</label>
        <textarea
          name="description"
          rows={3}
          placeholder="Краткое описание курса..."
          className="w-full resize-none rounded-lg border border-white/10 bg-slate-800/50 px-3 py-2 text-sm text-slate-200 outline-none focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/20"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-slate-500">Цена (UZS, необязательно)</label>
        <input
          type="number"
          name="price_uzs"
          min="0"
          step="any"
          placeholder="1500000"
          className="w-full rounded-lg border border-white/10 bg-slate-800/50 px-3 py-2 text-sm text-slate-200 outline-none focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/20"
        />
      </div>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state?.success && <p className="text-sm text-emerald-400">{state.success}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-brand-cyan px-5 py-2 text-sm font-semibold text-slate-900 shadow-cyan-glow transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Создание..." : "Создать курс"}
      </button>
    </form>
  );
}
