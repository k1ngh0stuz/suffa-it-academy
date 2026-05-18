"use client";

import { useState, useTransition } from "react";
import { toggleCourseStatusAction } from "@/actions/admin";
import { Badge } from "@/components/ui/badge";
import type { Course, CourseStatus } from "@/types";

interface Props {
  course: Course;
}

export function CourseStatusToggle({ course }: Props) {
  const [status, setStatus] = useState<CourseStatus>(course.status as CourseStatus);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function toggle() {
    const next: CourseStatus = status === "available" ? "coming_soon" : "available";
    startTransition(async () => {
      const result = await toggleCourseStatusAction(course.id, next);
      if (result?.error) {
        setMessage(result.error);
      } else {
        setStatus(next);
        setMessage(result?.success ?? null);
      }
    });
  }

  return (
    <div className="border-white/8 rounded-xl border bg-surface-raised p-5">
      <h3 className="mb-2 font-semibold text-slate-100">{course.title}</h3>
      <div className="mb-3 flex items-center gap-2">
        <Badge variant={status === "available" ? "cyan" : "gray"}>
          {status === "available" ? "Доступен" : "Скоро"}
        </Badge>
      </div>
      {message && <p className="mb-2 text-xs text-emerald-400">{message}</p>}
      <button
        onClick={toggle}
        disabled={pending}
        className="rounded-lg border border-white/10 px-4 py-1.5 text-sm text-slate-400 transition-colors hover:border-brand-cyan/40 hover:text-brand-cyan disabled:opacity-50"
      >
        {pending ? "Сохранение..." : status === "available" ? "→ Скрыть курс" : "→ Опубликовать"}
      </button>
    </div>
  );
}
