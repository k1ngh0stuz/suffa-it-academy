"use client";

import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";

export function HeroSection() {
  const { t } = useLanguage();
  const h = t.hero;

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-hero-gradient px-4 pt-20">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-brand-cyan/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-brand-indigo/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-cyan/20 bg-brand-cyan/5 px-4 py-1.5 text-sm text-brand-cyan">
          <Zap className="h-3.5 w-3.5" />
          {h.badge}
        </div>

        <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
          <span className="text-slate-100">{h.title1}</span>{" "}
          <span className="gradient-text">{h.title2}</span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-400 sm:text-xl">{h.subtitle}</p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" asChild>
            <a href="#courses">
              {h.btnCourses}
              <ArrowRight className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <a href="#about">{h.btnAbout}</a>
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { value: "3+", label: h.statCourses },
            { value: "100+", label: h.statStudents },
            { value: "24/7", label: h.statAccess },
            { value: "4", label: h.statPayments },
          ].map((stat) => (
            <div
              key={stat.label}
              className="border-white/8 rounded-xl border bg-surface-raised/50 p-4"
            >
              <div className="text-2xl font-bold text-brand-cyan">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="flex h-8 w-5 items-start justify-center rounded-full border-2 border-white/20 pt-1">
          <div className="h-2 w-1 rounded-full bg-brand-cyan" />
        </div>
      </div>
    </section>
  );
}
