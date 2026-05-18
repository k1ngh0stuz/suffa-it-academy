import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { LanguageProvider } from "@/lib/i18n/context";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const profileResult = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();
  const profile = profileResult.data as { role: string; full_name: string | null } | null;

  if (profile?.role !== "admin") redirect("/dashboard");

  return (
    <LanguageProvider>
      <div className="flex min-h-screen">
        <AdminSidebar profile={profile} userEmail={user?.email} />
        <main className="ml-64 flex-1 p-8">{children}</main>
      </div>
    </LanguageProvider>
  );
}
