import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, PlayCircle } from "lucide-react";
import type { Metadata } from "next";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Course, Enrollment } from "@/types";

export const metadata: Metadata = { title: "Мои курсы" };

export default async function DashboardPage() {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*, course:courses(*)")
    .eq("user_id", user.id)
    .eq("status", "active");

  const items = (enrollments ?? []) as (Enrollment & { course: Course })[];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-100">Мои курсы</h1>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 p-12 text-center">
          <p className="mb-4 text-slate-400">У вас ещё нет купленных курсов</p>
          <Button asChild>
            <Link href="/#courses">
              Смотреть курсы
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ course, id }) => (
            <div
              key={id}
              className="border-white/8 flex flex-col rounded-2xl border bg-surface-raised p-5 transition-all hover:border-brand-cyan/30"
            >
              <Badge variant="green" className="mb-3 self-start">
                Активен
              </Badge>
              <h3 className="mb-2 font-semibold text-slate-100">{course.title}</h3>
              <p className="mb-4 line-clamp-2 flex-1 text-sm text-slate-500">
                {course.description}
              </p>
              <Button variant="secondary" size="sm" asChild>
                <Link href={`/courses/${course.slug}`}>
                  <PlayCircle className="h-4 w-4" />
                  Продолжить
                </Link>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
