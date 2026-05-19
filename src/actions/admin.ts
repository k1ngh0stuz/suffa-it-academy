"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionResult, CourseStatus } from "@/types";

async function requireAdmin() {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthenticated");

  const profileResult = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const profile = profileResult.data as { role: string } | null;

  if (profile?.role !== "admin") throw new Error("Forbidden");
  return { supabase, adminId: user.id };
}

export async function toggleCourseStatusAction(
  courseId: string,
  newStatus: CourseStatus,
): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("courses") as any)
      .update({ status: newStatus })
      .eq("id", courseId);
    if (error) return { error: error.message };
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: `Статус курса обновлён: ${newStatus}` };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Ошибка" };
  }
}

export async function grantManualAccessAction(
  _prev: unknown,
  formData: FormData,
): Promise<ActionResult> {
  const studentId = formData.get("studentId") as string;
  const courseId = formData.get("courseId") as string;
  const note = formData.get("note") as string;

  if (!studentId || !courseId) return { error: "Заполните все поля" };

  try {
    const { supabase, adminId } = await requireAdmin();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("enrollments") as any).upsert(
      { user_id: studentId, course_id: courseId, status: "active", granted_by: adminId },
      { onConflict: "user_id,course_id" },
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("manual_grants") as any).insert({
      admin_id: adminId,
      student_id: studentId,
      course_id: courseId,
      note: note || null,
    });

    revalidatePath("/admin");
    return { success: "Доступ выдан успешно" };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Ошибка" };
  }
}

export async function revokeEnrollmentAction(enrollmentId: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("enrollments") as any)
      .update({ status: "revoked" })
      .eq("id", enrollmentId);
    if (error) return { error: error.message };
    revalidatePath("/admin");
    return { success: "Доступ отозван" };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Ошибка" };
  }
}

export async function updateCoursePriceAction(
  courseId: string,
  priceTiyin: number | null,
): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("courses") as any)
      .update({ price_tiyin: priceTiyin, updated_at: new Date().toISOString() })
      .eq("id", courseId);
    if (error) return { error: error.message };
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: "Цена обновлена" };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Ошибка" };
  }
}

export async function createCourseAction(
  _prev: unknown,
  formData: FormData,
): Promise<ActionResult> {
  const title = (formData.get("title") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const priceStr = formData.get("price_uzs") as string;
  const price_tiyin = priceStr ? Math.round(parseFloat(priceStr) * 100) : null;

  if (!title || !slug) return { error: "Название и slug обязательны" };

  try {
    const { supabase } = await requireAdmin();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("courses") as any).insert({
      title,
      slug,
      description,
      price_tiyin,
      status: "coming_soon",
      sort_order: 99,
    });
    if (error) return { error: error.message };
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: `Курс "${title}" создан` };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Ошибка" };
  }
}

export async function addModuleAction(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const title = (formData.get("title") as string)?.trim();
  const courseId = formData.get("courseId") as string;

  if (!title || !courseId) return { error: "Заполните все поля" };

  try {
    const { supabase } = await requireAdmin();

    const { data: existing } = await supabase
      .from("modules")
      .select("sort_order")
      .eq("course_id", courseId)
      .order("sort_order", { ascending: false })
      .limit(1);
    const nextOrder = ((existing?.[0] as { sort_order: number } | undefined)?.sort_order ?? 0) + 1;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("modules") as any).insert({
      title,
      course_id: courseId,
      sort_order: nextOrder,
    });
    if (error) return { error: error.message };
    revalidatePath("/admin");
    return { success: `Модуль "${title}" создан` };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Ошибка" };
  }
}

export async function addLessonAction(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const title = (formData.get("title") as string)?.trim();
  const moduleId = formData.get("moduleId") as string;
  const courseId = formData.get("courseId") as string;
  const isPreview = formData.get("isPreview") === "true";

  if (!title || !moduleId || !courseId) return { error: "Заполните все поля" };

  try {
    const { supabase } = await requireAdmin();

    // Get next sort_order for this module
    const { data: existing } = await supabase
      .from("lessons")
      .select("sort_order")
      .eq("module_id", moduleId)
      .order("sort_order", { ascending: false })
      .limit(1);
    const nextOrder = ((existing?.[0] as { sort_order: number } | undefined)?.sort_order ?? 0) + 1;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("lessons") as any).insert({
      title,
      module_id: moduleId,
      course_id: courseId,
      is_preview: isPreview,
      sort_order: nextOrder,
    });
    if (error) return { error: error.message };
    revalidatePath("/admin");
    return { success: `Урок "${title}" добавлен` };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Ошибка" };
  }
}

export async function searchStudentAction(
  _prev: unknown,
  formData: FormData,
): Promise<ActionResult<{ id: string; email: string; full_name: string | null }[]>> {
  const query = formData.get("query") as string;
  if (!query || query.length < 3) return { error: "Введите минимум 3 символа" };

  try {
    const { supabase } = await requireAdmin();
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, full_name")
      .or(`email.ilike.%${query}%,phone.ilike.%${query}%,full_name.ilike.%${query}%`)
      .limit(10);

    if (error) return { error: error.message };
    return {
      success: `Найдено: ${data?.length ?? 0}`,
      data: data as { id: string; email: string; full_name: string | null }[],
    };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Ошибка" };
  }
}
