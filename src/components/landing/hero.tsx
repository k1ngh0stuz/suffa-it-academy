import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-hero-gradient px-4 pt-20">
      {/* Animated grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow orbs */}
      <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-brand-cyan/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-brand-indigo/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-cyan/20 bg-brand-cyan/5 px-4 py-1.5 text-sm text-brand-cyan">
          <Zap className="h-3.5 w-3.5" />
          Профессиональное IT-образование
        </div>

        <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
          <span className="text-slate-100">Suffa</span>{" "}
          <span className="gradient-text">IT Academy</span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-400 sm:text-xl">
          Практические IT-курсы от экспертов-практиков. Получите востребованную профессию с доступом
          к лабораторному оборудованию и поддержкой 24/7.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" asChild>
            <a href="#courses">
              Смотреть курсы
              <ArrowRight className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <a href="#about">О нас</a>
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { value: "3+", label: "Курса" },
            { value: "100+", label: "Студентов" },
            { value: "24/7", label: "Доступ" },
            { value: "4", label: "Способа оплаты" },
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

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="flex h-8 w-5 items-start justify-center rounded-full border-2 border-white/20 pt-1">
          <div className="h-2 w-1 rounded-full bg-brand-cyan" />
        </div>
      </div>
    </section>
  );
}
