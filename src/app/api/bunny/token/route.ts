/**
 * GET /api/bunny/token?lessonId=xxx
 *
 * Returns a signed Bunny embed URL for a lesson.
 * Checks that the user has an active enrollment for the course.
 */
import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { generateSignedEmbedUrl } from "@/lib/bunny/stream";
import type { Lesson, Enrollment } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lessonId = searchParams.get("lessonId");
  if (!lessonId) return NextResponse.json({ error: "lessonId required" }, { status: 400 });

  const supabase = getSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Check if user is admin — admins bypass enrollment
  const profileResult = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const isAdmin = (profileResult.data as { role: string } | null)?.role === "admin";

  // Fetch lesson to get course_id and bunny_video_id
  const { data: lesson } = await supabase
    .from("lessons")
    .select("course_id, bunny_video_id, is_preview")
    .eq("id", lessonId)
    .single();

  const l = lesson as unknown as Pick<Lesson, "course_id" | "bunny_video_id" | "is_preview"> | null;

  if (!l) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  if (!l.bunny_video_id)
    return NextResponse.json({ error: "Video not uploaded yet" }, { status: 404 });

  // Admins and preview lessons skip enrollment check
  if (!isAdmin && !l.is_preview) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: enrollment } = await (supabase.from("enrollments") as any)
      .select("status")
      .eq("user_id", user.id)
      .eq("course_id", l.course_id)
      .eq("status", "active")
      .maybeSingle();

    const e = enrollment as Pick<Enrollment, "status"> | null;
    if (!e) return NextResponse.json({ error: "No active enrollment" }, { status: 403 });
  }

  const embedUrl = generateSignedEmbedUrl(l.bunny_video_id);
  return NextResponse.json({ url: embedUrl });
}
