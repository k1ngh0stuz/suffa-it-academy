import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-hero-gradient px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <BookOpen className="h-7 w-7 text-brand-cyan" />
        <span className="text-xl font-bold text-slate-100">
          Suffa<span className="text-brand-cyan"> IT</span> Academy
        </span>
      </Link>
      {children}
    </div>
  );
}
