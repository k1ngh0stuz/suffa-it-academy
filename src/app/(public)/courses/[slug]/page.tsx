import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Lock, PlayCircle, CheckCircle2, Clock, BookOpen } from "lucide-react";
import type { Metadata } from "next";
import { getCourseBySlug } from "@/lib/supabase/queries";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { hasActiveEnrollment } from "@/lib/supabase/queries";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = await getCourseBySlug(params.slug);
  if (!course) return {};
  return { title: course.title, description: course.description ?? undefined };
}

export default async function CourseDetailPage({ params }: Props) {
  const course = await getCourseBySlug(params.slug);
  if (!course) notFound();

  if (course.status === "coming_soon") {
    redirect("/#courses");
  }

  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const enrolled = user ? await hasActiveEnrollment(user.id, course.id) : false;

  const totalLessons = course.modules?.flatMap((m) => m.lessons ?? []).length ?? 0;

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <div className="bg-gradient-to-b from-surface-raised to-brand-bg py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Badge variant={course.status === "available" ? "cyan" : "gray"} className="mb-4">
            {course.status === "available" ? "Доступен" : "Скоро"}
          </Badge>
          <h1 className="mb-4 text-4xl font-bold text-slate-100">{course.title}</h1>
          <p className="mb-8 text-slate-400">{course.description}</p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-brand-cyan" />
              {course.modules?.length ?? 0} модулей
            </span>
            <span className="flex items-center gap-1.5">
              <PlayCircle className="h-4 w-4 text-brand-cyan" />
              {totalLessons} уроков
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-brand-cyan" />
              Доступ 24/7
            </span>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <span className="text-2xl font-bold text-brand-cyan">
              {formatPrice(course.price_tiyin)}
            </span>
            {enrolled ? (
              <Badge variant="green">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Вы записаны
              </Badge>
            ) : (
              <Button asChild>
                <Link
                  href={user ? `/checkout/${course.id}` : `/login?redirect=/checkout/${course.id}`}
                >
                  Записаться на курс
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Curriculum */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-bold text-slate-100">Программа курса</h2>

        {course.modules?.length === 0 && (
          <p className="text-slate-500">Программа курса скоро будет добавлена.</p>
        )}

        <div className="space-y-4">
          {course.modules?.map((module) => (
            <div
              key={module.id}
              className="border-white/8 overflow-hidden rounded-xl border bg-surface-raised"
            >
              <div className="border-white/8 border-b px-5 py-4">
                <h3 className="font-semibold text-slate-100">{module.title}</h3>
                <span className="text-xs text-slate-500">{module.lessons?.length ?? 0} уроков</span>
              </div>
              <ul className="divide-y divide-white/5">
                {module.lessons?.map((lesson) => (
                  <li key={lesson.id} className="flex items-center gap-3 px-5 py-3">
                    {lesson.is_preview ? (
                      <PlayCircle className="h-4 w-4 shrink-0 text-brand-cyan" />
                    ) : (
                      <Lock className="h-4 w-4 shrink-0 text-slate-600" />
                    )}
                    <span className="flex-1 text-sm text-slate-300">{lesson.title}</span>
                    {lesson.duration_sec && (
                      <span className="text-xs text-slate-600">
                        {Math.floor(lesson.duration_sec / 60)} мин
                      </span>
                    )}
                    {(enrolled || lesson.is_preview) && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/courses/${params.slug}/lessons/${lesson.id}`}>Смотреть</Link>
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
