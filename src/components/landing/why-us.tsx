"use client";

import { FlaskConical, Briefcase, Clock, CreditCard } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

export function WhyUsSection() {
  const { t } = useLanguage();
  const w = t.whyUs;

  const reasons = [
    { icon: FlaskConical, title: w.r1Title, description: w.r1Desc },
    { icon: Briefcase, title: w.r2Title, description: w.r2Desc },
    { icon: Clock, title: w.r3Title, description: w.r3Desc },
    { icon: CreditCard, title: w.r4Title, description: w.r4Desc },
  ];

  return (
    <section id="why-us" className="section-padding bg-surface-DEFAULT/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mb-3 inline-block rounded-full border border-brand-indigo/30 bg-brand-indigo/10 px-3 py-1 text-sm text-brand-indigo">
            {w.badge}
          </div>
          <h2 className="mb-4 text-4xl font-bold text-slate-100">{w.title}</h2>
          <p className="mx-auto max-w-xl text-slate-400">{w.subtitle}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map(({ icon: Icon, title, description }, i) => (
            <div
              key={title}
              className="border-white/8 group rounded-2xl border bg-surface-raised p-6 transition-all hover:border-brand-indigo/40 hover:shadow-indigo-glow"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-indigo/10 ring-1 ring-brand-indigo/20 transition-all group-hover:bg-brand-indigo/20">
                <Icon className="h-6 w-6 text-brand-indigo" />
              </div>
              <div className="mb-1 text-xs font-semibold text-brand-indigo/70">0{i + 1}</div>
              <h3 className="mb-2 font-semibold text-slate-100">{title}</h3>
              <p className="text-sm leading-relaxed text-slate-500">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
