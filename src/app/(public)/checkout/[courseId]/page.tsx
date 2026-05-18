import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { hasActiveEnrollment } from "@/lib/supabase/queries";
import { CheckoutClient } from "@/components/courses/checkout-client";
import type { Course } from "@/types";

interface Props {
  params: { courseId: string };
}

export const metadata: Metadata = { title: "Оплата курса" };

export default async function CheckoutPage({ params }: Props) {
  const supabase = getSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=/checkout/${params.courseId}`);

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", params.courseId)
    .single();

  if (!course) notFound();
  const courseTyped = course as unknown as Course;

  if (courseTyped.status !== "available") redirect("/#courses");

  const alreadyEnrolled = await hasActiveEnrollment(user.id, courseTyped.id);
  if (alreadyEnrolled) redirect(`/courses/${courseTyped.slug}`);

  return (
    <div className="flex min-h-screen items-start justify-center bg-hero-gradient px-4 pb-16 pt-28">
      <CheckoutClient course={courseTyped} userId={user.id} />
    </div>
  );
}
