import { formatDate } from "@/lib/utils";
import type { ManualGrant, Profile } from "@/types";

interface GrantRow extends ManualGrant {
  admin: Pick<Profile, "email" | "full_name">;
  student: Pick<Profile, "email" | "full_name">;
  course: { title: string };
}

export function ManualGrantLog({ grants }: { grants: GrantRow[] }) {
  if (grants.length === 0) {
    return <p className="text-sm text-slate-500">Ручных выдач нет</p>;
  }

  return (
    <div className="border-white/8 overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-white/8 border-b text-left text-xs text-slate-500">
            <th className="px-4 py-3">Администратор</th>
            <th className="px-4 py-3">Ученик</th>
            <th className="px-4 py-3">Курс</th>
            <th className="px-4 py-3">Комментарий</th>
            <th className="px-4 py-3">Дата</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {grants.map((g) => (
            <tr key={g.id} className="hover:bg-white/2">
              <td className="px-4 py-3 text-xs text-slate-400">{g.admin.email}</td>
              <td className="px-4 py-3 text-slate-300">{g.student.full_name ?? g.student.email}</td>
              <td className="px-4 py-3 text-slate-300">{g.course.title}</td>
              <td className="px-4 py-3 text-xs text-slate-500">{g.note ?? "—"}</td>
              <td className="px-4 py-3 text-xs text-slate-500">{formatDate(g.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
