import Link from "next/link";
import { Clock, ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { Course } from "@/types";

const COURSE_ICONS: Record<string, string> = {
  "network-engineer": "🌐",
  "windows-server-2022": "🖥️",
  "ethical-hacker": "🔐",
};

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const isAvailable = course.status === "available";
  const icon = COURSE_ICONS[course.slug] ?? "📚";

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-card-gradient transition-all duration-300 ${
        isAvailable
          ? "border-white/10 hover:-translate-y-1 hover:border-brand-cyan/40 hover:shadow-cyan-glow"
          : "border-white/5 opacity-80"
      }`}
    >
      {/* Header gradient */}
      <div
        className={`flex h-44 items-center justify-center text-6xl ${
          isAvailable
            ? "bg-gradient-to-br from-brand-cyan/10 to-brand-indigo/10"
            : "from-white/3 bg-gradient-to-br to-white/5"
        }`}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center justify-between">
          {isAvailable ? (
            <Badge variant="cyan">Доступен</Badge>
          ) : (
            <Badge variant="gray">
              <Clock className="h-3 w-3" />
              Скоро
            </Badge>
          )}
        </div>

        <h3 className="mb-2 text-xl font-bold text-slate-100">{course.title}</h3>
        <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-500">{course.description}</p>

        <div className="flex items-center justify-between">
          {isAvailable ? (
            <>
              <span className="text-sm font-semibold text-brand-cyan">
                {formatPrice(course.price_tiyin)}
              </span>
              <Button size="sm" asChild>
                <Link href={`/courses/${course.slug}`}>
                  Подробнее
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </>
          ) : (
            <>
              <span className="text-sm text-slate-600">В разработке</span>
              <button
                disabled
                className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-600"
              >
                <Lock className="h-3.5 w-3.5" />
                Скоро
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
