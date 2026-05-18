import type { MetadataRoute } from "next";
import { getCourses } from "@/lib/supabase/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://suffaitacademy.uz";
  const courses = await getCourses();

  const courseUrls = courses
    .filter((c) => c.status === "available")
    .map((c) => ({
      url: `${base}/courses/${c.slug}`,
      lastModified: new Date(c.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/login`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/register`, changeFrequency: "monthly", priority: 0.3 },
    ...courseUrls,
  ];
}
