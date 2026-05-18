import type { Metadata } from "next";
import "./globals.css";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://suffaitacademy.uz";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Suffa IT Academy — IT курсы в Ферганской области",
    template: "%s | Suffa IT Academy",
  },
  description:
    "Профессиональные IT курсы в Ибрат Янгикургане: Network Engineer, Windows Server 2022, Ethical Hacker. Практическое обучение, опытные эксперты, 4 способа оплаты.",
  keywords: [
    "IT курсы",
    "Ферганская область",
    "Network Engineer",
    "Ethical Hacker",
    "Windows Server",
    "Suffa IT Academy",
  ],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: APP_URL,
    siteName: "Suffa IT Academy",
    title: "Suffa IT Academy — IT курсы в Ферганской области",
    description: "Профессиональные IT курсы с практическими лабораторными работами.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
