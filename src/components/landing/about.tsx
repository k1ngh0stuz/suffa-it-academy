"use client";

import { MapPin, Users, Award, Cpu } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

export function AboutSection() {
  const { t } = useLanguage();
  const a = t.about;

  const features = [
    { icon: Cpu, title: a.f1Title, description: a.f1Desc },
    { icon: Users, title: a.f2Title, description: a.f2Desc },
    { icon: Award, title: a.f3Title, description: a.f3Desc },
    { icon: MapPin, title: a.f4Title, description: a.f4Desc },
  ];

  return (
    <section id="about" className="section-padding bg-surface-DEFAULT/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="mb-3 inline-block rounded-full border border-brand-indigo/30 bg-brand-indigo/10 px-3 py-1 text-sm text-brand-indigo">
              {a.badge}
            </div>
            <h2 className="mb-5 text-4xl font-bold text-slate-100">{a.title}</h2>
            <p className="mb-5 text-slate-400">{a.p1}</p>
            <p className="text-slate-400">{a.p2}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="border-white/8 rounded-xl border bg-surface-raised p-5 transition-all hover:border-brand-cyan/30 hover:shadow-cyan-glow"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-cyan/10">
                  <Icon className="h-5 w-5 text-brand-cyan" />
                </div>
                <h3 className="mb-1.5 text-sm font-semibold text-slate-100">{title}</h3>
                <p className="text-xs leading-relaxed text-slate-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
