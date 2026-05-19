"use client";

import { useState, useRef } from "react";
import { Upload, CheckCircle, XCircle, Loader2, Film } from "lucide-react";
import * as tus from "tus-js-client";
import type { Lesson } from "@/types";

interface Props {
  lesson: Pick<Lesson, "id" | "title" | "bunny_video_id">;
  onUploaded?: (videoId: string) => void;
}

type UploadState =
  | { status: "idle" }
  | { status: "creating" }
  | { status: "uploading"; progress: number }
  | { status: "done"; videoId: string }
  | { status: "error"; message: string };

export function LessonVideoUpload({ lesson, onUploaded }: Props) {
  const [state, setState] = useState<UploadState>(
    lesson.bunny_video_id ? { status: "done", videoId: lesson.bunny_video_id } : { status: "idle" },
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<tus.Upload | null>(null);

  async function handleFile(file: File) {
    setState({ status: "creating" });

    // 1. Create video slot in Bunny + get TUS auth headers
    let videoId: string;
    let tusHeaders: Record<string, string>;
    try {
      const res = await fetch("/api/bunny/create-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: lesson.title, lessonId: lesson.id }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Ошибка создания видео");
      const data = (await res.json()) as {
        videoId: string;
        tusHeaders: Record<string, string>;
      };
      videoId = data.videoId;
      tusHeaders = {
        AuthorizationSignature: String(data.tusHeaders.AuthorizationSignature),
        AuthorizationExpire: String(data.tusHeaders.AuthorizationExpire),
        VideoId: data.tusHeaders.VideoId,
        LibraryId: data.tusHeaders.LibraryId,
      };
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Ошибка",
      });
      return;
    }

    setState({ status: "uploading", progress: 0 });

    // 2. Upload via TUS directly to Bunny CDN
    const upload = new tus.Upload(file, {
      endpoint: "https://video.bunnycdn.com/tusupload",
      retryDelays: [0, 3000, 5000, 10000],
      headers: tusHeaders,
      metadata: {
        filename: file.name,
        filetype: file.type,
        title: lesson.title,
      },
      onProgress(bytesUploaded, bytesTotal) {
        const pct = Math.round((bytesUploaded / bytesTotal) * 100);
        setState({ status: "uploading", progress: pct });
      },
      onSuccess() {
        setState({ status: "done", videoId });
        onUploaded?.(videoId);
      },
      onError(err) {
        setState({ status: "error", message: err.message });
      },
    });

    uploadRef.current = upload;

    // Resume previous attempt if exists
    const previousUploads = await upload.findPreviousUploads();
    if (previousUploads.length > 0) upload.resumeFromPreviousUpload(previousUploads[0]);

    upload.start();
  }

  function handleCancel() {
    uploadRef.current?.abort();
    setState({ status: "idle" });
  }

  return (
    <div className="mt-2">
      {state.status === "idle" && (
        <button
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:border-brand-cyan/40 hover:text-brand-cyan"
        >
          <Upload className="h-3.5 w-3.5" />
          Загрузить видео
        </button>
      )}

      {state.status === "creating" && (
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Создание слота в Bunny...
        </div>
      )}

      {state.status === "uploading" && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-cyan" />
              Загрузка {state.progress}%
            </span>
            <button onClick={handleCancel} className="text-red-400 hover:text-red-300">
              Отмена
            </button>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
            <div
              className="h-full rounded-full bg-brand-cyan transition-all duration-300"
              style={{ width: `${state.progress}%` }}
            />
          </div>
        </div>
      )}

      {state.status === "done" && (
        <div className="flex items-center gap-2 text-xs">
          <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-emerald-400">Видео загружено</span>
          <span className="font-mono text-slate-600">{state.videoId.slice(0, 8)}…</span>
          <button
            onClick={() => setState({ status: "idle" })}
            className="ml-auto text-slate-500 hover:text-slate-300"
          >
            Заменить
          </button>
        </div>
      )}

      {state.status === "error" && (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-red-400">
            <XCircle className="h-3.5 w-3.5" />
            {state.message}
          </div>
          <button
            onClick={() => setState({ status: "idle" })}
            className="text-xs text-slate-500 hover:text-slate-300"
          >
            Попробовать снова
          </button>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />

      {/* Bunny processing note */}
      {state.status === "done" && (
        <p className="mt-1 flex items-center gap-1 text-xs text-slate-600">
          <Film className="h-3 w-3" />
          Bunny транскодирует видео ~2–5 мин после загрузки
        </p>
      )}
    </div>
  );
}
