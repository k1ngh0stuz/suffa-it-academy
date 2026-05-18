"use client";

import Link from "next/link";
import { Phone, BookOpen } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

export function Footer() {
  const { t } = useLanguage();
  const f = t.footer;
  const n = t.nav;

  return (
    <footer className="border-white/8 bg-surface-DEFAULT border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-brand-cyan" />
              <span className="font-bold text-slate-100">
                Suffa<span className="text-brand-cyan"> IT</span> Academy
              </span>
            </Link>
            <p className="text-sm text-slate-500">{f.tagline}</p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
              {f.nav}
            </h3>
            <ul className="space-y-2 text-sm text-slate-500">
              {[
                { href: "#courses", label: n.courses },
                { href: "#about", label: n.about },
                { href: "#why-us", label: n.whyUs },
                { href: "#location", label: n.contacts },
                { href: "/dashboard", label: f.dashboard },
              ].map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="transition-colors hover:text-brand-cyan">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
              {f.contacts}
            </h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand-cyan" />
                <a href="tel:+998501556700" className="transition-colors hover:text-brand-cyan">
                  +998 50 155 67 00
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/suffaitacademy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-brand-cyan"
                >
                  Telegram: @suffaitacademy
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/suffaitacademy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-brand-cyan"
                >
                  Instagram: @suffaitacademy
                </a>
              </li>
              <li className="whitespace-pre-line text-slate-600">{t.location.addressText}</li>
            </ul>
          </div>
        </div>

        <div className="border-white/8 mt-10 border-t pt-6 text-center text-xs text-slate-600">
          {f.rights}
        </div>
      </div>
    </footer>
  );
}
