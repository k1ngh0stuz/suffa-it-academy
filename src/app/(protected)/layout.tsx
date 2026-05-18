import Link from "next/link";
import { BookOpen, LayoutDashboard, User, LogOut, ArrowLeft } from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { signOutAction } from "@/actions/auth";

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
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="border-white/8 fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-surface-raised">
        <Link
          href="/"
          className="border-white/8 group flex items-center gap-2 border-b px-4 py-5 transition-opacity hover:opacity-80"
        >
          <BookOpen className="h-6 w-6 text-brand-cyan" />
          <span className="font-bold text-slate-100">
            Suffa<span className="text-brand-cyan"> IT</span>
          </span>
          <ArrowLeft className="ml-auto h-3.5 w-3.5 text-slate-600 opacity-0 transition-opacity group-hover:opacity-100" />
        </Link>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            <li>
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-slate-100"
              >
                <LayoutDashboard className="h-4 w-4" />
                Мои курсы
              </Link>
            </li>
            <li>
              <Link
                href="/profile"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-slate-100"
              >
                <User className="h-4 w-4" />
                Профиль
              </Link>
            </li>
            {profile?.role === "admin" && (
              <li>
                <Link
                  href="/admin"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-brand-indigo hover:bg-brand-indigo/5"
                >
                  Администрирование
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <div className="border-white/8 border-t p-4">
          <div className="mb-3 text-xs text-slate-500">{profile?.full_name ?? user?.email}</div>
          <form action={signOutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-white/5 hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
              Выйти
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 flex-1 p-8">{children}</main>
    </div>
  );
}
