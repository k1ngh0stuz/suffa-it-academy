"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, AlertCircle } from "lucide-react";

interface VideoPlayerProps {
  /** Bunny videoId — if null the video hasn't been uploaded yet */
  bunnyVideoId?: string | null;
  /** Legacy Mux playback id — kept for backwards compat */
  playbackId?: string | null;
  courseId: string;
  lessonId: string;
  title: string;
}

export function VideoPlayer({
  bunnyVideoId,
  playbackId,
  courseId,
  lessonId,
  title,
}: VideoPlayerProps) {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUrl = useCallback(async () => {
    // Prefer Bunny; fall back to old Mux signed-url flow if no bunnyVideoId
    if (!bunnyVideoId && !playbackId) {
      setError("Видео ещё не загружено");
      setLoading(false);
      return;
    }

    try {
      if (bunnyVideoId) {
        const res = await fetch(`/api/bunny/token?lessonId=${encodeURIComponent(lessonId)}`);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          // Check if video is still processing
          const statusRes = await fetch(
            `/api/bunny/status?videoId=${encodeURIComponent(bunnyVideoId)}`,
          ).catch(() => null);
          if (statusRes?.ok) {
            const s = (await statusRes.json()) as {
              ready: boolean;
              label: string;
              encodeProgress: number;
            };
            if (!s.ready) {
              throw new Error(
                `Видео обрабатывается на сервере: ${s.label}${s.encodeProgress > 0 ? ` (${s.encodeProgress}%)` : ""}. Попробуйте через минуту.`,
              );
            }
          }
          throw new Error(`[${res.status}] ${body.error ?? "Ошибка доступа"}`);
        }
        const data = (await res.json()) as { url: string };
        setEmbedUrl(data.url);
      } else {
        // Legacy Mux path
        const res = await fetch(
          `/api/video/signed-url?playbackId=${encodeURIComponent(playbackId!)}&courseId=${encodeURIComponent(courseId)}`,
        );
        if (!res.ok) throw new Error((await res.json()).error ?? "Ошибка доступа");
        const data = (await res.json()) as { url: string };
        setEmbedUrl(data.url);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Не удалось загрузить видео");
    } finally {
      setLoading(false);
    }
  }, [bunnyVideoId, playbackId, lessonId, courseId]);

  // Fetch URL and refresh before token expiry (every 1.5 hours)
  useEffect(() => {
    fetchUrl();
    const interval = setInterval(fetchUrl, 1.5 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchUrl]);

  // Save progress (for Bunny iframe we listen to postMessage events)
  useEffect(() => {
    if (!embedUrl || !bunnyVideoId) return;

    function onMessage(e: MessageEvent) {
      // Bunny player sends: { event: 'timeupdate', currentTime, duration }
      if (typeof e.data !== "object" || e.data?.event !== "timeupdate") return;
      const { currentTime, duration } = e.data as {
        currentTime: number;
        duration: number;
      };
      if (!currentTime || !duration) return;

      void fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          courseId,
          watchedSec: Math.floor(currentTime),
          completed: currentTime / duration > 0.9,
        }),
      });
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [embedUrl, bunnyVideoId, lessonId, courseId]);

  if (loading) {
    return (
      <div className="flex aspect-video w-full items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-brand-cyan" />
      </div>
    );
  }

  if (error || !embedUrl) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 bg-black text-center">
        <AlertCircle className="h-8 w-8 text-red-400" />
        <p className="text-sm text-slate-400">{error ?? "Видео недоступно"}</p>
      </div>
    );
  }

  const containerStyle = {
    paddingTop: "min(56.25%, calc(100vh - 9rem))",
    maxWidth: "calc((100vh - 9rem) * 16 / 9)",
  };

  // Bunny iframe embed
  if (bunnyVideoId) {
    return (
      <div className="w-full bg-black">
        <div className="relative mx-auto w-full" style={containerStyle}>
          <iframe
            src={embedUrl}
            className="absolute inset-0 h-full w-full"
            title={title}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  // Legacy Mux <video> element
  return (
    <div className="w-full bg-black">
      <div className="relative mx-auto w-full" style={containerStyle}>
        <video
          src={embedUrl}
          controls
          className="absolute inset-0 h-full w-full"
          aria-label={title}
          playsInline
          controlsList="nodownload"
        />
      </div>
    </div>
  );
}
