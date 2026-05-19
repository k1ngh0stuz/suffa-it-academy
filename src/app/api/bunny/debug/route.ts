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
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
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

  const lib = (await libRes.json()) as {
    TokenAuthenticationKey?: string;
    ApiKey?: string;
    VideoLibraryId?: number;
  };

  const keyFromApi = lib.TokenAuthenticationKey ?? "";
  const keyFromEnv = TOKEN_AUTH_KEY_ENV();
  const expires = Math.floor(Date.now() / 1000) + 7200;

  const tokenFromApi = makeToken(keyFromApi, videoId, expires);
  const tokenFromEnv = makeToken(keyFromEnv, videoId, expires);

  const keysMatch = keyFromApi === keyFromEnv;

  return NextResponse.json({
    keysMatch,
    keyFromApiLength: keyFromApi.length,
    keyFromEnvLength: keyFromEnv.length,
    // Show first+last 4 chars to verify without exposing full key
    keyFromApiPreview: keyFromApi.slice(0, 4) + "…" + keyFromApi.slice(-4),
    keyFromEnvPreview: keyFromEnv.slice(0, 4) + "…" + keyFromEnv.slice(-4),
    expires,
    videoId,
    tokenFromApi,
    tokenFromEnv,
    embedUrlFromApi: `${BUNNY_EMBED_HOST}/embed/${LIBRARY_ID()}/${videoId}?token=${tokenFromApi}&expires=${expires}`,
    embedUrlFromEnv: `${BUNNY_EMBED_HOST}/embed/${LIBRARY_ID()}/${videoId}?token=${tokenFromEnv}&expires=${expires}`,
  });
}
