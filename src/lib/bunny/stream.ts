import crypto from "crypto";

const API_KEY = () => process.env.BUNNY_STREAM_API_KEY ?? "";
const LIBRARY_ID = () => process.env.BUNNY_STREAM_LIBRARY_ID ?? "";
const TOKEN_AUTH_KEY = () => process.env.BUNNY_TOKEN_AUTH_KEY ?? "";

export const BUNNY_EMBED_HOST = "https://iframe.mediadelivery.net";
export const BUNNY_TUS_ENDPOINT = "https://video.bunnycdn.com/tusupload";

// ── Create a new video in Bunny Stream library ──────────────────────────────
export async function createBunnyVideo(title: string): Promise<string> {
  const res = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID()}/videos`, {
    method: "POST",
    headers: {
      AccessKey: API_KEY(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Bunny API ${res.status}: ${text}`);
  }
  const data = (await res.json()) as { guid: string };
  return data.guid; // videoId
}

// ── Generate TUS upload auth headers (for browser → Bunny CDN direct upload) ─
export function generateTusAuthHeaders(videoId: string): {
  AuthorizationSignature: string;
  AuthorizationExpire: number;
  VideoId: string;
  LibraryId: string;
} {
  const expiry = Math.floor(Date.now() / 1000) + 3600; // 1 hour
  const signature = crypto
    .createHash("sha256")
    .update(LIBRARY_ID() + API_KEY() + expiry + videoId)
    .digest("hex");

  return {
    AuthorizationSignature: signature,
    AuthorizationExpire: expiry,
    VideoId: videoId,
    LibraryId: LIBRARY_ID(),
  };
}

// ── Generate signed embed URL (Token Auth) ──────────────────────────────────
// Requires "Token Authentication" enabled in Bunny Library settings.
export function generateSignedEmbedUrl(videoId: string): string {
  const libraryId = LIBRARY_ID();
  const tokenAuthKey = TOKEN_AUTH_KEY();

  if (!tokenAuthKey) {
    // Token auth not configured — return open embed (dev/staging)
    return `${BUNNY_EMBED_HOST}/embed/${libraryId}/${videoId}?autoplay=false&preload=true`;
  }

  const expires = Math.floor(Date.now() / 1000) + 2 * 60 * 60; // 2 hours
  const token = crypto
    .createHash("sha256")
    .update(tokenAuthKey + videoId + expires)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  return `${BUNNY_EMBED_HOST}/embed/${libraryId}/${videoId}?token=${token}&expires=${expires}&autoplay=false&preload=true`;
}

// ── Get video status from Bunny (for admin panel) ──────────────────────────
export async function getBunnyVideoStatus(
  videoId: string,
): Promise<{ status: number; encodeProgress: number; title: string }> {
  const res = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID()}/videos/${videoId}`, {
    headers: { AccessKey: API_KEY() },
  });
  if (!res.ok) throw new Error(`Bunny API ${res.status}`);
  const data = (await res.json()) as {
    status: number;
    encodeProgress: number;
    title: string;
  };
  return data;
}

// Bunny video status codes:
// 0 = Created, 1 = Uploaded, 2 = Processing, 3 = Transcoding, 4 = Finished, 5 = Error, 6 = UploadFailed
export function bunnyStatusLabel(code: number): string {
  const map: Record<number, string> = {
    0: "Создан",
    1: "Загружен",
    2: "Обрабатывается",
    3: "Транскодирование",
    4: "Готов",
    5: "Ошибка",
    6: "Ошибка загрузки",
  };
  return map[code] ?? `Статус ${code}`;
}
