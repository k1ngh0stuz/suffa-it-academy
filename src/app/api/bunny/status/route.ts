/**
 * GET /api/bunny/status?videoId=xxx
 * Returns the processing status of a Bunny video.
 */
import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getBunnyVideoStatus, bunnyStatusLabel } from "@/lib/bunny/stream";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get("videoId");
  if (!videoId) return NextResponse.json({ error: "videoId required" }, { status: 400 });

  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await getBunnyVideoStatus(videoId);
    return NextResponse.json({
      status: data.status,
      label: bunnyStatusLabel(data.status),
      encodeProgress: data.encodeProgress,
      ready: data.status === 4,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Bunny API error" },
      { status: 502 },
    );
  }
}
