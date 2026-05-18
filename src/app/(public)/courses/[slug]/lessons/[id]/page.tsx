import { notFound, redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { hasActiveEnrollment } from "@/lib/supabase/queries";
import { VideoPlayer } from "@/components/courses/video-player";
import { LessonSidebar } from "@/components/courses/lesson-sidebar";
import type { Metadata } from "next";
import type { Lesson } from "@/types";

interface Props {
  params: { slug: string; id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = getSupabaseServerClient();
  const { data: lesson } = await supabase
    .from("lessons")
    .select("title")
    .eq("id", params.id)
    .single();
  const lessonData = lesson as { title: string } | null;
  return { title: lessonData?.title ?? "Урок" };
}

export default async function LessonPage({ params }: Props) {
  const supabase = getSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=/courses/${params.slug}/lessons/${params.id}`);

  const { data: lesson } = await supabase.from("lessons").select("*").eq("id", params.id).single();

  if (!lesson) notFound();

  const lessonTyped = lesson as unknown as Lesson;

  // Check access: preview or enrolled
  if (!lessonTyped.is_preview) {
    const enrolled = await hasActiveEnrollment(user.id, lessonTyped.course_id);
    if (!enrolled) redirect(`/courses/${params.slug}`);
  }

  // Load sibling lessons for sidebar
  const { data: siblings } = await supabase
    .from("lessons")
    .select("id, title, sort_order, is_preview, module_id, duration_sec")
    .eq("course_id", lessonTyped.course_id)
    .order("sort_order");

  return (
    <div className="flex min-h-screen flex-col pt-16 lg:flex-row">
      {/* Video area */}
      <main className="flex-1">
        <VideoPlayer
          playbackId={lessonTyped.mux_playback_id}
          courseId={lessonTyped.course_id}
          lessonId={lessonTyped.id}
          title={lessonTyped.title}
        />
        <div className="p-6">
          <h1 className="text-2xl font-bold text-slate-100">{lessonTyped.title}</h1>
          {lessonTyped.description && (
            <p className="mt-2 text-slate-400">{lessonTyped.description}</p>
          )}
        </div>
      </main>

      {/* Sidebar */}
      <aside className="border-white/8 w-full shrink-0 border-l bg-surface-raised lg:w-80">
        <LessonSidebar
          lessons={(siblings as unknown as Lesson[]) ?? []}
          currentId={params.id}
          courseSlug={params.slug}
        />
      </aside>
    </div>
  );
}
