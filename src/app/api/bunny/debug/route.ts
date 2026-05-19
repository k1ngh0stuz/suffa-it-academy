/**
 * GET /api/bunny/debug
 * Admin-only: fetches TokenAuthenticationKey from Bunny API,
 * generates a token using it, and compares with env var key.
 * DELETE THIS ROUTE AFTER DEBUGGING.
 */
import { NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const API_KEY = () => process.env.BUNNY_STREAM_API_KEY ?? "";
const LIBRARY_ID = () => process.env.BUNNY_STREAM_LIBRARY_ID ?? "";
const TOKEN_AUTH_KEY_ENV = () => process.env.BUNNY_TOKEN_AUTH_KEY ?? "";
const BUNNY_EMBED_HOST = "https://iframe.mediadelivery.net";

function makeToken(key: string, videoId: string, expires: number): string {
  return crypto
    .createHash("sha256")
    .update(key + videoId + String(expires))
    .digest("hex");
}

export async function GET(request: Request) {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profileResult = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const isAdmin = (profileResult.data as { role: string } | null)?.role === "admin";
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get("videoId") ?? "7de14748-bcc2-42da-af31-2e205e5c3985";

  // Fetch library from Bunny API to get the real TokenAuthenticationKey
  const libRes = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID()}`, {
    headers: { AccessKey: API_KEY() },
  });

  if (!libRes.ok) {
    return NextResponse.json({ error: `Bunny API ${libRes.status}` }, { status: 502 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lib = (await libRes.json()) as Record<string, any>;

  // Return all field names from the API response so we can find the correct key field
  const fieldNames = Object.keys(lib);
  // Find any field that looks like a token/auth/security key (non-empty string, length > 10)
  const keyLikeFields: Record<string, { length: number; preview: string }> = {};
  for (const [k, v] of Object.entries(lib)) {
    if (typeof v === "string" && v.length > 10) {
      keyLikeFields[k] = {
        length: v.length,
        preview: v.slice(0, 4) + "…" + v.slice(-4),
      };
    }
  }

  const keyFromEnv = TOKEN_AUTH_KEY_ENV();
  const expires = Math.floor(Date.now() / 1000) + 7200;
  const tokenFromEnv = makeToken(keyFromEnv, videoId, expires);

  return NextResponse.json({
    fieldNames,
    keyLikeFields,
    keyFromEnvLength: keyFromEnv.length,
    keyFromEnvPreview: keyFromEnv.slice(0, 4) + "…" + keyFromEnv.slice(-4),
    expires,
    videoId,
    tokenFromEnv,
    embedUrlFromEnv: `${BUNNY_EMBED_HOST}/embed/${LIBRARY_ID()}/${videoId}?token=${tokenFromEnv}&expires=${expires}`,
  });
}
