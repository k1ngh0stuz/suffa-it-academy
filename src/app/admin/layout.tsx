import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, LayoutDashboard, CreditCard, LogOut, ArrowLeft } from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { signOutAction } from "@/actions/auth";

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

  const navItems = [
    { href: "/admin", label: "Панель", icon: LayoutDashboard },
    { href: "/admin/payments", label: "Платежи", icon: CreditCard },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="border-white/8 fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-surface-raised">
        <div className="border-white/8 flex items-center gap-2 border-b px-4 py-5">
          <BookOpen className="h-6 w-6 text-brand-indigo" />
          <span className="font-bold text-slate-100">
            Admin<span className="text-brand-indigo"> Panel</span>
          </span>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            <li>
              <Link
                href="/dashboard"
                className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-500 transition-colors hover:bg-white/5 hover:text-brand-cyan"
              >
                <ArrowLeft className="h-4 w-4" />
                Выйти из админки
              </Link>
            </li>
            <li>
              <div className="my-1 border-t border-white/5" />
            </li>
            {navItems.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-slate-100"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-white/8 border-t p-4">
          <div className="mb-2 text-xs text-slate-500">{profile.full_name ?? user.email}</div>
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
      <main className="ml-64 flex-1 p-8">{children}</main>
    </div>
  );
}
