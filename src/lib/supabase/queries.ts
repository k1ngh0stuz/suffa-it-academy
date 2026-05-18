// Server-side data fetching helpers with graceful degradation
import type { Course, CourseWithModules, Enrollment, Profile } from "@/types";

const SEED_COURSES: Course[] = [
  {
    id: "a1b2c3d4-0001-0001-0001-000000000001",
    slug: "network-engineer",
    title: "Network Engineer",
    description:
      "Полный курс по сетевым технологиям: маршрутизация, коммутация, протоколы TCP/IP, настройка Cisco и Mikrotik.",
    thumbnail: null,
    status: "available",
    price_tiyin: null,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "a1b2c3d4-0002-0002-0002-000000000002",
    slug: "windows-server-2022",
    title: "Windows Server 2022",
    description:
      "Администрирование Windows Server 2022: Active Directory, DNS, DHCP, групповые политики, Hyper-V.",
    thumbnail: null,
    status: "coming_soon",
    price_tiyin: null,
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "a1b2c3d4-0003-0003-0003-000000000003",
    slug: "ethical-hacker",
    title: "Ethical Hacker",
    description:
      "Этичный хакинг и пентест: разведка, сканирование уязвимостей, Metasploit, Burp Suite.",
    thumbnail: null,
    status: "coming_soon",
    price_tiyin: null,
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

function isConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
  );
}

export async function getCourses(): Promise<Course[]> {
  if (!isConfigured()) return SEED_COURSES;

  try {
    const { getSupabaseServerClient } = await import("./server");
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .neq("status", "archived")
      .order("sort_order");

    if (error) throw error;
    return (data as Course[]) ?? SEED_COURSES;
  } catch {
    return SEED_COURSES;
  }
}

export async function getCourseBySlug(slug: string): Promise<CourseWithModules | null> {
  if (!isConfigured()) {
    const seed = SEED_COURSES.find((c) => c.slug === slug);
    return seed ? { ...seed, modules: [] } : null;
  }

  try {
    const { getSupabaseServerClient } = await import("./server");
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("courses")
      .select(
        `
        *,
        modules (
          *,
          lessons ( * )
        )
      `,
      )
      .eq("slug", slug)
      .single();

    if (error) return null;
    return data as unknown as CourseWithModules;
  } catch {
    return null;
  }
}

export async function getUserEnrollments(userId: string): Promise<Enrollment[]> {
  if (!isConfigured()) return [];

  try {
    const { getSupabaseServerClient } = await import("./server");
    const supabase = getSupabaseServerClient();
    const { data } = await supabase
      .from("enrollments")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active");

    return (data as Enrollment[]) ?? [];
  } catch {
    return [];
  }
}

export async function hasActiveEnrollment(userId: string, courseId: string): Promise<boolean> {
  if (!isConfigured()) return false;

  try {
    const { getSupabaseServerClient } = await import("./server");
    const supabase = getSupabaseServerClient();
    const { data } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .eq("status", "active")
      .single();

    return !!data;
  } catch {
    return false;
  }
}

export async function getProfileByEmail(email: string): Promise<Profile | null> {
  if (!isConfigured()) return null;

  try {
    const { getSupabaseServerClient } = await import("./server");
    const supabase = getSupabaseServerClient();
    const { data } = await supabase.from("profiles").select("*").eq("email", email).single();
    return data as Profile | null;
  } catch {
    return null;
  }
}
