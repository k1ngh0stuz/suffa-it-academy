import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { lessonId, courseId, watchedSec, completed } = body as {
      lessonId: string;
      courseId: string;
      watchedSec: number;
      completed: boolean;
    };

    if (!lessonId || !courseId) {
      return NextResponse.json({ error: "Missing lessonId or courseId" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("lesson_progress") as any).upsert(
      {
        user_id: user.id,
        lesson_id: lessonId,
        course_id: courseId,
        watched_sec: watchedSec ?? 0,
        completed: completed ?? false,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,lesson_id" },
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
