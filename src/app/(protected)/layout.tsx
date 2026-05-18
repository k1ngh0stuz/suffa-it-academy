import { getSupabaseServerClient } from "@/lib/supabase/server";
import { LanguageProvider } from "@/lib/i18n/context";
import { ProtectedSidebar } from "@/components/layout/protected-sidebar";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profileResult = user
    ? await supabase.from("profiles").select("full_name, role").eq("id", user.id).single()
    : { data: null };
  const profile = profileResult.data as { full_name: string | null; role: string } | null;

  return (
    <LanguageProvider>
      <div className="flex min-h-screen">
        <ProtectedSidebar profile={profile} userEmail={user?.email} />
        <main className="ml-64 flex-1 p-8">{children}</main>
      </div>
    </LanguageProvider>
  );
}
