import { MapPin, Users, Award, Cpu } from "lucide-react";

export function AboutSection() {
  const features = [
    {
      icon: Cpu,
      title: "Практические лаборатории",
      description: "Обучение на реальном оборудовании Cisco, Mikrotik и серверных системах.",
    },
    {
      icon: Users,
      title: "Эксперты-практики",
      description: "Преподаватели — действующие специалисты с многолетним опытом в индустрии.",
    },
    {
      icon: Award,
      title: "Сертификация",
      description: "Подготовка к международным сертификатам CCNA, CEH, CompTIA и другим.",
    },
    {
      icon: MapPin,
      title: "Удобное расположение",
      description:
        "Академия находится в Ибрат Янгикургане, Бувайдинский район, Ферганская область.",
    },
  ];

  return (
    <section id="about" className="section-padding bg-surface-DEFAULT/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Text */}
          <div>
            <div className="mb-3 inline-block rounded-full border border-brand-indigo/30 bg-brand-indigo/10 px-3 py-1 text-sm text-brand-indigo">
              О академии
            </div>
            <h2 className="mb-5 text-4xl font-bold text-slate-100">
              Suffa IT Academy — ваш старт в мире IT
            </h2>
            <p className="mb-5 text-slate-400">
              Мы — образовательный центр, основанный с целью дать качественное IT-образование
              студентам Ферганской области. Наша миссия — сделать профессиональное IT-обучение
              доступным без поездки в крупные города.
            </p>
            <p className="text-slate-400">
              Каждый курс построен по принципу «практика прежде теории»: вы сразу работаете с
              реальными инструментами, конфигурируете оборудование и решаете задачи, с которыми
              сталкиваются специалисты на рынке труда.
            </p>
          </div>

          {/* Feature grid */}
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
