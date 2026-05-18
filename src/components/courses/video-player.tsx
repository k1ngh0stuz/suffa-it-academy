"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, AlertCircle } from "lucide-react";

interface VideoPlayerProps {
  playbackId: string | null;
  courseId: string;
  lessonId: string;
  title: string;
}

export function VideoPlayer({ playbackId, courseId, lessonId, title }: VideoPlayerProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSignedUrl = useCallback(async () => {
    if (!playbackId) {
      setLoading(false);
      setError("Видео ещё не загружено");
      return;
    }
    try {
      const res = await fetch(
        `/api/video/signed-url?playbackId=${encodeURIComponent(playbackId)}&courseId=${encodeURIComponent(courseId)}`,
      );
      if (!res.ok) throw new Error((await res.json()).error ?? "Ошибка доступа");
      const data = await res.json();
      setUrl(data.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Не удалось загрузить видео");
    } finally {
      setLoading(false);
    }
  }, [playbackId, courseId]);

  useEffect(() => {
    fetchSignedUrl();
    // Refresh signed URL every 3.5 hours (before 4h expiry)
    const interval = setInterval(fetchSignedUrl, 3.5 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchSignedUrl]);

  // Save progress
  useEffect(() => {
    const video = document.querySelector("video");
    if (!video) return;

    const saveProgress = async () => {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          courseId,
          watchedSec: Math.floor(video.currentTime),
          completed: video.currentTime / video.duration > 0.9,
        }),
      });
    };

    video.addEventListener("timeupdate", saveProgress);
    return () => video.removeEventListener("timeupdate", saveProgress);
  }, [lessonId, courseId, url]);

  if (loading) {
    return (
      <div className="flex aspect-video w-full items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-brand-cyan" />
      </div>
    );
  }

  if (error || !url) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 bg-black text-center">
        <AlertCircle className="h-8 w-8 text-red-400" />
        <p className="text-sm text-slate-400">{error ?? "Видео недоступно"}</p>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full bg-black">
      <video
        src={url}
        controls
        className="h-full w-full"
        aria-label={title}
        playsInline
        controlsList="nodownload"
      />
    </div>
  );
}
