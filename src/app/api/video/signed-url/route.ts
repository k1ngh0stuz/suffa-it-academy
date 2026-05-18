import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

// Returns a short-lived Mux signed URL only if the user has an active enrollment
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const playbackId = searchParams.get("playbackId");
  const courseId = searchParams.get("courseId");

  if (!playbackId || !courseId) {
    return NextResponse.json({ error: "missing_params" }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  // Verify enrollment
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .eq("status", "active")
    .single();

  if (!enrollment) {
    return NextResponse.json({ error: "not_enrolled" }, { status: 403 });
  }

  // Check if user is admin (admins always have access)
  const profileResult = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const profile = profileResult.data as { role: string } | null;
  const isAdmin = profile?.role === "admin";

  if (!enrollment && !isAdmin) {
    return NextResponse.json({ error: "not_enrolled" }, { status: 403 });
  }

  // Generate Mux signed URL (JWT, expires in 4 hours)
  const signingKeyId = process.env.MUX_SIGNING_KEY_ID;
  const signingPrivateKey = process.env.MUX_SIGNING_PRIVATE_KEY;

  if (!signingKeyId || !signingPrivateKey) {
    // No Mux configured — return unsigned URL for dev
    return NextResponse.json({
      url: `https://stream.mux.com/${playbackId}.m3u8`,
      expires: null,
    });
  }

  // Dynamic import to avoid build errors when Mux env is missing
  const { Mux } = await import("@mux/mux-node");
  const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
  });

  const token = await mux.jwt.signPlaybackId(playbackId, {
    type: "video",
    expiration: "4h",
    keyId: signingKeyId,
    keySecret: signingPrivateKey,
  });

  const url = `https://stream.mux.com/${playbackId}.m3u8?token=${token}`;
  return NextResponse.json({ url, expires: Date.now() + 4 * 60 * 60 * 1000 });
}
