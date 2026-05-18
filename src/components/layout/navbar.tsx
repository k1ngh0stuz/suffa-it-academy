"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, BookOpen, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#courses", label: "Курсы" },
    { href: "#about", label: "О нас" },
    { href: "#why-us", label: "Почему мы" },
    { href: "#location", label: "Контакты" },
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
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">
              <LogIn className="h-4 w-4" />
              Войти
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/register">Записаться</Link>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="rounded-md p-2 text-slate-400 hover:text-brand-cyan md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
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
            <Button variant="secondary" size="sm" asChild>
              <Link href="/login">Войти</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">Записаться</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
