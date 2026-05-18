"use client";

import { useTransition } from "react";
import { revokeEnrollmentAction } from "@/actions/admin";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Enrollment, Profile } from "@/types";

interface EnrollmentRow extends Enrollment {
  profile: Pick<Profile, "email" | "full_name">;
  course: { title: string; slug: string };
}

interface Props {
  enrollments: EnrollmentRow[];
}

export function EnrollmentList({ enrollments }: Props) {
  const [pending, startTransition] = useTransition();

  function revoke(id: string) {
    startTransition(async () => {
      await revokeEnrollmentAction(id);
    });
  }

  if (enrollments.length === 0) {
    return <p className="text-sm text-slate-500">Записей нет</p>;
  }

  return (
    <div className="border-white/8 overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-white/8 border-b text-left text-xs text-slate-500">
            <th className="px-4 py-3">Ученик</th>
            <th className="px-4 py-3">Курс</th>
            <th className="px-4 py-3">Статус</th>
            <th className="px-4 py-3">Дата</th>
            <th className="px-4 py-3">Тип</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {enrollments.map((e) => (
            <tr key={e.id} className="hover:bg-white/2">
              <td className="px-4 py-3 text-slate-300">
                {e.profile.full_name ?? e.profile.email}
                <div className="text-xs text-slate-600">{e.profile.email}</div>
              </td>
              <td className="px-4 py-3 text-slate-300">{e.course.title}</td>
              <td className="px-4 py-3">
                <Badge
                  variant={
                    e.status === "active" ? "green" : e.status === "revoked" ? "red" : "gray"
                  }
                >
                  {e.status === "active" ? "Активен" : e.status === "revoked" ? "Отозван" : "Истёк"}
                </Badge>
              </td>
              <td className="px-4 py-3 text-xs text-slate-500">{formatDate(e.created_at)}</td>
              <td className="px-4 py-3">
                {e.granted_by ? (
                  <Badge variant="indigo">Вручную</Badge>
                ) : (
                  <Badge variant="cyan">Оплата</Badge>
                )}
              </td>
              <td className="px-4 py-3">
                {e.status === "active" && (
                  <button
                    onClick={() => revoke(e.id)}
                    disabled={pending}
                    className="rounded px-2 py-1 text-xs text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                  >
                    Отозвать
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
