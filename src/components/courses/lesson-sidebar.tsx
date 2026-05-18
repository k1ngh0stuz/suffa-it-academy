import Link from "next/link";
import { PlayCircle, Lock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lesson } from "@/types";

interface LessonSidebarProps {
  lessons: Lesson[];
  currentId: string;
  courseSlug: string;
}

export function LessonSidebar({ lessons, currentId, courseSlug }: LessonSidebarProps) {
  return (
    <div className="flex flex-col">
      <div className="border-white/8 border-b p-4">
        <h2 className="text-sm font-semibold text-slate-300">Содержание курса</h2>
      </div>
      <ul className="overflow-y-auto">
        {lessons.map((lesson) => {
          const isCurrent = lesson.id === currentId;
          return (
            <li key={lesson.id}>
              <Link
                href={`/courses/${courseSlug}/lessons/${lesson.id}`}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm transition-colors",
                  isCurrent
                    ? "bg-brand-cyan/10 text-brand-cyan"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200",
                )}
              >
                {isCurrent ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-cyan" />
                ) : lesson.is_preview ? (
                  <PlayCircle className="h-4 w-4 shrink-0 text-brand-indigo" />
                ) : (
                  <Lock className="h-4 w-4 shrink-0 text-slate-600" />
                )}
                <span className="flex-1 leading-tight">{lesson.title}</span>
                {lesson.duration_sec && (
                  <span className="shrink-0 text-xs text-slate-600">
                    {Math.floor(lesson.duration_sec / 60)}м
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
