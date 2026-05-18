"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, BookOpen, LogIn, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const { lang, t, toggle } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const links = [
    { href: "#courses", label: t.nav.courses },
    { href: "#about", label: t.nav.about },
    { href: "#why-us", label: t.nav.whyUs },
    { href: "#location", label: t.nav.contacts },
  ];

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "glass border-white/8 border-b shadow-lg" : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <BookOpen className="h-7 w-7 text-brand-cyan" />
          <span className="text-lg font-bold text-slate-100">
            Suffa<span className="text-brand-cyan"> IT</span> Academy
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm text-slate-400 transition-colors hover:text-brand-cyan"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          {/* Language toggle */}
          <button
            onClick={toggle}
            className="flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs font-semibold text-slate-400 transition-all hover:border-brand-cyan/40 hover:text-brand-cyan"
            aria-label="Switch language"
          >
            <span className={lang === "ru" ? "text-brand-cyan" : "text-slate-500"}>RU</span>
            <span className="text-slate-600">/</span>
            <span className={lang === "uz" ? "text-brand-cyan" : "text-slate-500"}>UZ</span>
          </button>

          {user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <User className="h-4 w-4" />
                  {user.email?.split("@")[0]}
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-slate-400 hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">
                  <LogIn className="h-4 w-4" />
                  {t.nav.login}
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">{t.nav.register}</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Language toggle mobile */}
          <button
            onClick={toggle}
            className="flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-xs font-semibold text-slate-400"
          >
            <span className={lang === "ru" ? "text-brand-cyan" : "text-slate-500"}>RU</span>
            <span className="text-slate-600">/</span>
            <span className={lang === "uz" ? "text-brand-cyan" : "text-slate-500"}>UZ</span>
          </button>
          <button
            className="rounded-md p-2 text-slate-400 hover:text-brand-cyan"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="glass border-white/8 border-b px-4 pb-6 md:hidden">
          <ul className="mb-4 flex flex-col gap-4 pt-2">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-sm text-slate-400 hover:text-brand-cyan"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2">
            {user ? (
              <>
                <Button variant="secondary" size="sm" asChild>
                  <Link href="/dashboard" onClick={() => setOpen(false)}>
                    <User className="h-4 w-4" />
                    {user.email?.split("@")[0]}
                  </Link>
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setOpen(false);
                    void handleSignOut();
                  }}
                  className="text-red-400"
                >
                  <LogOut className="h-4 w-4" />
                  {lang === "ru" ? "Выйти" : "Chiqish"}
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" size="sm" asChild>
                  <Link href="/login">{t.nav.login}</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">{t.nav.register}</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
