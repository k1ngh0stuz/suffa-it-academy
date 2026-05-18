"use client";

import { useState, useTransition } from "react";
import { updateCoursePriceAction } from "@/actions/admin";
import type { Course } from "@/types";
import type { ActionResult } from "@/types";

interface Props {
  course: Course;
}

export function CoursePriceForm({ course }: Props) {
  const currentPriceUzs = course.price_tiyin != null ? course.price_tiyin / 100 : null;
  const [priceInput, setPriceInput] = useState<string>(
    currentPriceUzs != null ? String(currentPriceUzs) : "",
  );
  const [state, setState] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = priceInput.trim() === "" ? null : parseFloat(priceInput);
    const priceTiyin = parsed != null && !isNaN(parsed) ? Math.round(parsed * 100) : null;
    startTransition(async () => {
      const result = await updateCoursePriceAction(course.id, priceTiyin);
      setState(result);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex items-center gap-2">
      <input
        type="number"
        min="0"
        step="any"
        value={priceInput}
        onChange={(e) => setPriceInput(e.target.value)}
        placeholder="Цена (UZS)"
        className="w-32 rounded-lg border border-white/10 bg-slate-800/50 px-2 py-1 text-sm text-slate-200 outline-none focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/20"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-white/10 px-3 py-1 text-xs text-slate-400 transition-colors hover:border-brand-cyan/40 hover:text-brand-cyan disabled:opacity-50"
      >
        {pending ? "..." : "Сохранить цену"}
      </button>
      {state?.error && <span className="text-xs text-red-400">{state.error}</span>}
      {state?.success && <span className="text-xs text-emerald-400">{state.success}</span>}
    </form>
  );
}
