"use client";

import { useState, useTransition } from "react";
import { searchStudentAction, grantManualAccessAction } from "@/actions/admin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Course, ActionResult } from "@/types";

interface Props {
  courses: Course[];
}

export function ManualGrantForm({ courses }: Props) {
  const [searchState, setSearchState] = useState<ActionResult<
    { id: string; email: string; full_name: string | null }[]
  > | null>(null);
  const [grantState, setGrantState] = useState<ActionResult<never> | null>(null);
  const [searchPending, startSearchTransition] = useTransition();
  const [grantPending, startGrantTransition] = useTransition();
  const [selectedStudent, setSelectedStudent] = useState<{ id: string; email: string } | null>(
    null,
  );

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startSearchTransition(async () => {
      const result = await searchStudentAction(null, formData);
      setSearchState(result);
    });
  }

  function handleGrant(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startGrantTransition(async () => {
      const result = await grantManualAccessAction(null, formData);
      setGrantState(result);
    });
  }

  const students = searchState?.data ?? [];

  return (
    <div className="border-white/8 space-y-6 rounded-xl border bg-surface-raised p-6">
      {/* Step 1: Search */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-300">Шаг 1 — Найти ученика</h3>
        <form onSubmit={handleSearch} className="flex gap-3">
          <Input name="query" placeholder="Email или телефон или имя" className="flex-1" />
          <Button type="submit" size="md" loading={searchPending}>
            Найти
          </Button>
        </form>
        {searchState?.error && <p className="mt-2 text-sm text-red-400">{searchState.error}</p>}
        {students.length > 0 && (
          <ul className="border-white/8 mt-3 divide-y divide-white/5 rounded-lg border">
            {students.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => setSelectedStudent(s)}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                    selectedStudent?.id === s.id
                      ? "bg-brand-cyan/10 text-brand-cyan"
                      : "text-slate-300 hover:bg-white/5"
                  }`}
                >
                  {s.full_name ? `${s.full_name} (${s.email})` : s.email}
                </button>
              </li>
            ))}
          </ul>
        )}
        {selectedStudent && (
          <p className="mt-2 text-sm text-emerald-400">
            Выбран: <strong>{selectedStudent.email}</strong>
          </p>
        )}
      </div>

      {/* Step 2: Grant */}
      {selectedStudent && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-300">Шаг 2 — Выдать доступ</h3>
          <form onSubmit={handleGrant} className="space-y-3">
            <input type="hidden" name="studentId" value={selectedStudent.id} />
            <div>
              <label className="mb-1 block text-xs text-slate-500">Курс</label>
              <select
                name="courseId"
                className="h-10 w-full rounded-lg border border-white/10 bg-surface-raised px-3 text-sm text-slate-100 focus:border-brand-cyan focus:outline-none"
                required
              >
                <option value="">— выбрать курс —</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            <Input
              name="note"
              label="Комментарий (опционально)"
              placeholder="Оплата наличными 15.01.2025"
            />
            {grantState?.error && <p className="text-sm text-red-400">{grantState.error}</p>}
            {grantState?.success && (
              <p className="text-sm text-emerald-400">{grantState.success}</p>
            )}
            <Button type="submit" loading={grantPending}>
              Выдать доступ
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
