"use client";

import Link from "next/link";
import { BookOpen, LayoutDashboard, CreditCard, LogOut, ArrowLeft } from "lucide-react";
import { signOutAction } from "@/actions/auth";
import { useLanguage } from "@/lib/i18n/context";

interface Props {
  profile: { full_name: string | null; role: string } | null;
  userEmail: string | undefined;
}

export function AdminSidebar({ profile, userEmail }: Props) {
  const { t } = useLanguage();

  const navItems = [
    { href: "/admin", label: t.adminPage.title, icon: LayoutDashboard },
    { href: "/admin/payments", label: t.adminPage.payments, icon: CreditCard },
  ];

  return (
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
              {t.adminPage.backToDashboard}
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
        <div className="mb-2 text-xs text-slate-500">{profile?.full_name ?? userEmail}</div>
        <form action={signOutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-white/5 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            {t.dashboard.signOut}
          </button>
        </form>
      </div>
    </aside>
  );
}
