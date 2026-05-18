import type { Metadata } from "next";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { CourseStatusToggle } from "@/components/admin/course-status-toggle";
import { CoursePriceForm } from "@/components/admin/course-price-form";
import { AddCourseForm } from "@/components/admin/add-course-form";
import { ManualGrantForm } from "@/components/admin/manual-grant-form";
import { EnrollmentList } from "@/components/admin/enrollment-list";
import { ManualGrantLog } from "@/components/admin/manual-grant-log";
import type { Course, Enrollment, ManualGrant, Profile } from "@/types";

export const metadata: Metadata = { title: "Администрирование" };

export const revalidate = 0;

export default async function AdminPage() {
  const supabase = getSupabaseServerClient();

  const [coursesRes, enrollmentsRes, grantsRes, statsRes] = await Promise.all([
    supabase.from("courses").select("*").order("sort_order"),
    supabase
      .from("enrollments")
      .select("*, profile:profiles(email, full_name), course:courses(title, slug)")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("manual_grants")
      .select(
        "*, admin:profiles!manual_grants_admin_id_fkey(email, full_name), student:profiles!manual_grants_student_id_fkey(email, full_name), course:courses(title)",
      )
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("enrollments")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
  ]);
  const courses = coursesRes.data;
  const enrollments = enrollmentsRes.data;
  const grants = grantsRes.data;
  const activeCount = statsRes.count;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Панель администратора</h1>
        <p className="mt-1 text-sm text-slate-500">
          Активных учеников:{" "}
          <span className="font-semibold text-brand-cyan">{activeCount ?? 0}</span>
        </p>
      </div>

      {/* Add new course */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-100">Добавить новый курс</h2>
        <AddCourseForm />
      </section>

      {/* Course status */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-100">Курсы — статусы</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(courses as unknown as Course[])?.map((course) => (
            <div key={course.id}>
              <CourseStatusToggle course={course} />
              <CoursePriceForm course={course} />
            </div>
          ))}
        </div>
      </section>

      {/* Manual grant */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-100">Ручная выдача доступа</h2>
        <ManualGrantForm courses={(courses as unknown as Course[]) ?? []} />
      </section>

      {/* Enrollments */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-100">Все записи (последние 50)</h2>
        <EnrollmentList
          enrollments={
            (enrollments as unknown as (Enrollment & {
              profile: Pick<Profile, "email" | "full_name">;
              course: { title: string; slug: string };
            })[]) ?? []
          }
        />
      </section>

      {/* Manual grants log */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-100">Журнал ручных выдач</h2>
        <ManualGrantLog
          grants={
            (grants as unknown as (ManualGrant & {
              admin: Pick<Profile, "email" | "full_name">;
              student: Pick<Profile, "email" | "full_name">;
              course: { title: string };
            })[]) ?? []
          }
        />
      </section>
    </div>
  );
}
