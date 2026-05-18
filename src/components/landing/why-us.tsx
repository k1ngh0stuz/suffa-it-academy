import { FlaskConical, Briefcase, Clock, CreditCard } from "lucide-react";

export function WhyUsSection() {
  const reasons = [
    {
      icon: FlaskConical,
      title: "Практические лаборатории",
      description:
        "Каждое занятие — это реальная работа с оборудованием. Вы настраиваете, ломаете и чините — именно так учатся профи.",
    },
    {
      icon: Briefcase,
      title: "Эксперты-практики",
      description:
        "Наши преподаватели работают в отрасли прямо сейчас. Никакой устаревшей теории — только актуальные кейсы.",
    },
    {
      icon: Clock,
      title: "Доступ 24/7",
      description:
        "Видеоуроки и материалы доступны круглосуточно. Учитесь в своём темпе, повторяйте сложные темы сколько угодно.",
    },
    {
      icon: CreditCard,
      title: "4 способа оплаты",
      description:
        "UzumPay, PayMe, Paynet, Click — выбирайте удобный способ. Также принимаем наличные в офисе академии.",
    },
  ];

  return (
    <section id="why-us" className="section-padding bg-surface-DEFAULT/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mb-3 inline-block rounded-full border border-brand-indigo/30 bg-brand-indigo/10 px-3 py-1 text-sm text-brand-indigo">
            Наши преимущества
          </div>
          <h2 className="mb-4 text-4xl font-bold text-slate-100">Почему Suffa IT Academy?</h2>
          <p className="mx-auto max-w-xl text-slate-400">
            Мы не просто даём знания — мы готовим специалистов, которых берут на работу.
          </p>
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
