/**
 * POST /api/bunny/create-video
 * Body: { title: string; lessonId: string }
 *
 * Creates a video slot in Bunny Stream, returns the videoId and TUS headers
 * so the browser can upload directly to Bunny CDN.
 * Also persists bunny_video_id on the lesson row.
 */
import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { createBunnyVideo, generateTusAuthHeaders } from "@/lib/bunny/stream";

export async function POST(request: Request) {
  const supabase = getSupabaseServerClient();

  // Auth check — must be admin
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profileResult = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const profile = profileResult.data as { role: string } | null;
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = (await request.json()) as { title?: string; lessonId?: string };
  if (!body.title || !body.lessonId)
    return NextResponse.json({ error: "title and lessonId required" }, { status: 400 });

  // Create video in Bunny
  let videoId: string;
  try {
    videoId = await createBunnyVideo(body.title);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Bunny error" },
      { status: 502 },
    );
  }

  const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID ?? "";

  // Save videoId to lesson
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from("lessons") as any)
    .update({ bunny_video_id: videoId, bunny_library_id: libraryId })
    .eq("id", body.lessonId);

  const tusHeaders = generateTusAuthHeaders(videoId);

  return NextResponse.json({ videoId, tusHeaders });
}
