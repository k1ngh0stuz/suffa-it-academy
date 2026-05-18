"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { translations, type Lang, type Translations } from "./translations";

interface LangContextValue {
  lang: Lang;
  t: Translations;
  toggle: () => void;
}

const LangContext = createContext<LangContextValue>({
  lang: "ru",
  t: translations.ru,
  toggle: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("ru");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved === "uz" || saved === "ru") setLang(saved);
  }, []);

  function toggle() {
    setLang((prev) => {
      const next = prev === "ru" ? "uz" : "ru";
      localStorage.setItem("lang", next);
      return next;
    });
  }

  return (
    <LangContext.Provider value={{ lang, t: translations[lang], toggle }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LangContext);
}
