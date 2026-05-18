import { Phone, Send, MapPin } from "lucide-react";

// Simple Instagram SVG (lucide-react v1.x removed it)
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function LocationSection() {
  return (
    <section id="location" className="section-padding">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mb-3 inline-block rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-3 py-1 text-sm text-brand-cyan">
            Как нас найти
          </div>
          <h2 className="mb-4 text-4xl font-bold text-slate-100">Локация и контакты</h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Map — 3 columns */}
          <div className="border-white/8 overflow-hidden rounded-2xl border lg:col-span-3">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2999.0!2d71.7!3d40.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDE4JzAwLjAiTiA3McKwNDInMDAuMCJF!5e0!3m2!1sru!2suz!4v1700000000000!5m2!1sru!2suz&q=Ibrat+Yangiqurgon+Buvayda+Fergana+Uzbekistan"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Suffa IT Academy на карте"
              className="grayscale"
            />
          </div>

          {/* Contact block — 2 columns */}
          <div className="flex flex-col justify-center gap-6 lg:col-span-2">
            <div>
              <h3 className="mb-4 text-xl font-bold text-slate-100">Свяжитесь с нами</h3>
              <p className="mb-6 text-sm text-slate-400">
                Хотите записаться на курс или узнать цену? Напишите нам в Telegram или позвоните —
                ответим в течение нескольких минут.
              </p>
            </div>

            <div className="space-y-4">
              <a
                href="tel:+998501556700"
                className="border-white/8 group flex items-center gap-4 rounded-xl border bg-surface-raised p-4 transition-all hover:border-brand-cyan/40 hover:shadow-cyan-glow"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-cyan/10">
                  <Phone className="h-5 w-5 text-brand-cyan" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Телефон</div>
                  <div className="font-semibold text-slate-100 transition-colors group-hover:text-brand-cyan">
                    +998 50 155 67 00
                  </div>
                </div>
              </a>

              <a
                href="https://t.me/suffaitacademy"
                target="_blank"
                rel="noopener noreferrer"
                className="border-white/8 group flex items-center gap-4 rounded-xl border bg-surface-raised p-4 transition-all hover:border-brand-cyan/40 hover:shadow-cyan-glow"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#229ED9]/10">
                  <Send className="h-5 w-5 text-[#229ED9]" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Telegram</div>
                  <div className="font-semibold text-slate-100 transition-colors group-hover:text-[#229ED9]">
                    @suffaitacademy
                  </div>
                </div>
              </a>

              <a
                href="https://instagram.com/suffaitacademy"
                target="_blank"
                rel="noopener noreferrer"
                className="border-white/8 group flex items-center gap-4 rounded-xl border bg-surface-raised p-4 transition-all hover:border-pink-500/40"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-500/10">
                  <InstagramIcon className="h-5 w-5 text-pink-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Instagram</div>
                  <div className="font-semibold text-slate-100 transition-colors group-hover:text-pink-400">
                    @suffaitacademy
                  </div>
                </div>
              </a>

              <div className="border-white/8 flex items-start gap-4 rounded-xl border bg-surface-raised p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-indigo/10">
                  <MapPin className="h-5 w-5 text-brand-indigo" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Адрес</div>
                  <div className="text-sm text-slate-300">
                    Ибрат Янгикурган, Бувайдинский район,
                    <br />
                    Ферганская область, Узбекистан
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
