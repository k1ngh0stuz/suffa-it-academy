"use client";

import { useState, useTransition } from "react";
import { ChevronDown, ChevronRight, Plus, Film } from "lucide-react";
import { LessonVideoUpload } from "./lesson-video-upload";
import { addLessonAction, addModuleAction } from "@/actions/admin";
import type { Course, ModuleWithLessons } from "@/types";

interface Props {
  courses: (Course & { modules: ModuleWithLessons[] })[];
}

export function LessonsManager({ courses }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  function toggleCourse(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="space-y-3">
      {courses.map((course) => (
        <div key={course.id} className="border-white/8 overflow-hidden rounded-xl border">
          {/* Course header */}
          <button
            onClick={() => toggleCourse(course.id)}
            className="hover:bg-white/3 flex w-full items-center gap-3 px-4 py-3 text-left"
          >
            {expanded[course.id] ? (
              <ChevronDown className="h-4 w-4 text-slate-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-slate-500" />
            )}
            <span className="font-semibold text-slate-200">{course.title}</span>
            <span className="ml-auto text-xs text-slate-600">
              {course.modules.reduce((n, m) => n + m.lessons.length, 0)} уроков
            </span>
          </button>

          {/* Modules + lessons */}
          {expanded[course.id] && (
            <div className="border-t border-white/5">
              {course.modules.map((mod) => (
                <div key={mod.id} className="border-b border-white/5 last:border-b-0">
                  <div className="bg-white/2 px-6 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {mod.title}
                  </div>
                  <div className="divide-y divide-white/5">
                    {mod.lessons.map((lesson) => (
                      <div key={lesson.id} className="px-6 py-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <Film className="h-4 w-4 shrink-0 text-slate-600" />
                            <span>{lesson.title}</span>
                            {lesson.is_preview && (
                              <span className="rounded border border-brand-cyan/30 px-1 py-0.5 text-xs text-brand-cyan">
                                preview
                              </span>
                            )}
                          </div>
                        </div>
                        <LessonVideoUpload lesson={lesson} />
                      </div>
                    ))}
                    {mod.lessons.length === 0 && (
                      <div className="px-6 py-2 text-xs text-slate-600">Нет уроков</div>
                    )}
                  </div>
                  {/* Add lesson to module */}
                  <AddLessonForm moduleId={mod.id} courseId={course.id} />
                </div>
              ))}
              {/* Add module button — always visible when course is expanded */}
              <AddModuleForm courseId={course.id} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function AddModuleForm({ courseId }: { courseId: string }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.set("title", title.trim());
      fd.set("courseId", courseId);
      const result = await addModuleAction(null, fd);
      if (result.success) {
        setMsg(result.success);
        setTitle("");
        setOpen(false);
      } else {
        setMsg(result.error ?? "Ошибка");
      }
    });
  }

  if (!open) {
    return (
      <div className="border-t border-white/5 px-4 py-3">
        {msg && <p className="mb-1 text-xs text-emerald-400">{msg}</p>}
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 rounded-lg border border-dashed border-white/20 px-3 py-1.5 text-xs text-slate-500 transition-colors hover:border-brand-cyan/40 hover:text-brand-cyan"
        >
          <Plus className="h-3.5 w-3.5" />
          Добавить модуль
        </button>
      </div>
    );
  }

  return (
    <div className="border-t border-white/5 px-4 py-3">
      <p className="mb-2 text-xs text-slate-500">Новый модуль</p>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          autoFocus
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Например: Введение в сети"
          className="flex-1 rounded-lg border border-white/10 bg-slate-800/50 px-3 py-1.5 text-sm text-slate-200 outline-none focus:border-brand-cyan/50"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-brand-cyan px-4 py-1.5 text-sm font-semibold text-slate-900 disabled:opacity-50"
        >
          {pending ? "..." : "Создать"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-slate-600 hover:text-slate-300"
        >
          Отмена
        </button>
      </form>
    </div>
  );
}

function AddLessonForm({ moduleId, courseId }: { moduleId: string; courseId: string }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.set("title", title.trim());
      fd.set("moduleId", moduleId);
      fd.set("courseId", courseId);
      fd.set("isPreview", String(isPreview));
      const result = await addLessonAction(null, fd);
      if (result.success) {
        setMsg(result.success);
        setTitle("");
        setOpen(false);
      } else {
        setMsg(result.error ?? "Ошибка");
      }
    });
  }

  if (!open) {
    return (
      <div className="px-6 pb-3">
        {msg && <p className="mb-1 text-xs text-emerald-400">{msg}</p>}
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1 text-xs text-slate-600 hover:text-brand-cyan"
        >
          <Plus className="h-3.5 w-3.5" />
          Добавить урок
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2 px-6 pb-3">
      <input
        autoFocus
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Название урока"
        className="flex-1 rounded-lg border border-white/10 bg-slate-800/50 px-2 py-1 text-xs text-slate-200 outline-none focus:border-brand-cyan/50"
      />
      <label className="flex items-center gap-1 text-xs text-slate-500">
        <input
          type="checkbox"
          checked={isPreview}
          onChange={(e) => setIsPreview(e.target.checked)}
          className="rounded"
        />
        Preview
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-brand-cyan px-3 py-1 text-xs font-semibold text-slate-900 disabled:opacity-50"
      >
        {pending ? "..." : "Добавить"}
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="text-xs text-slate-600 hover:text-slate-300"
      >
        Отмена
      </button>
    </form>
  );
}
