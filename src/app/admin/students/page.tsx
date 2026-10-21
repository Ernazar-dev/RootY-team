import type { Metadata } from "next";
import Link from "next/link";
import { listGroups, listStudents } from "@/backend/services/admin";
import { CreateStudentForm } from "@/frontend/admin/forms";
import { PageHeader } from "@/frontend/admin/parts";
import { percent, timeAgo } from "@/frontend/admin/format";
import { ui } from "@/frontend/admin/ui";

export const metadata: Metadata = { title: "O‘quvchilar" };

export default async function StudentsPage({ searchParams }: PageProps<"/admin/students">) {
  const { group } = await searchParams;
  const groupId = Number(group) > 0 ? Number(group) : undefined;
  const [groups, { students, lessonTotal }] = await Promise.all([listGroups(), listStudents(groupId)]);
  const current = groups.find((g) => g.id === groupId);

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-sm transition-colors ${active ? "border-accent bg-accent-soft text-text" : "border-border text-muted hover:border-border-strong hover:text-text"}`;

  return (
    <>
      <PageHeader title="O‘quvchilar" lead="Hisob ochish, guruhga biriktirish va har birining natijasini ko‘rish." />

      <section className={`${ui.card} p-5`}>
        <h2 className="mb-4 font-semibold">Yangi o‘quvchi</h2>
        <CreateStudentForm groups={groups} defaultGroup={groupId} />
      </section>

      <nav aria-label="Guruh bo‘yicha filtr" className="mt-8 flex flex-wrap gap-2">
        <Link href="/admin/students" className={chip(!groupId)}>
          Hammasi
        </Link>
        {groups.map((g) => (
          <Link key={g.id} href={`/admin/students?group=${g.id}`} className={chip(g.id === groupId)}>
            {g.name} <span className="font-mono text-xs text-faint">{g.members}</span>
          </Link>
        ))}
      </nav>

      <section className={`${ui.card} mt-4 overflow-hidden`}>
        <div className={ui.cardHead}>
          <h2 className="font-semibold">{current ? current.name : "Barcha o‘quvchilar"}</h2>
          <span className="font-mono text-sm text-muted">{students.length}</span>
        </div>
        {students.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-muted">Bu yerda hali o‘quvchi yo‘q. Yuqoridagi forma orqali qo‘shing.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[48rem] text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className={ui.th}>O‘quvchi</th>
                  <th className={ui.th}>Guruh</th>
                  <th className={ui.th}>Darslar</th>
                  <th className={`${ui.th} text-right`}>To‘g‘ri javoblar</th>
                  <th className={ui.th}>Oxirgi kirish</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((s) => {
                  const p = percent(s.completed, lessonTotal);
                  return (
                    <tr key={s.id} className="transition-colors hover:bg-surface-2/50">
                      <td className={ui.td}>
                        <Link href={`/admin/students/${s.id}`} className="font-medium hover:text-accent-text">
                          {s.name}
                        </Link>
                        <span className="block font-mono text-xs text-muted">{s.login}</span>
                      </td>
                      <td className={ui.td}>{s.groupName ?? <span className="text-faint">—</span>}</td>
                      <td className={`${ui.td} w-48`}>
                        <div className="flex items-center gap-2">
                          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                            <span className="bg-signal block h-full rounded-full" style={{ width: `${p}%` }} />
                          </span>
                          <span className="font-mono text-xs text-muted">
                            {s.completed}/{lessonTotal}
                          </span>
                        </div>
                      </td>
                      <td className={`${ui.td} text-right font-mono`}>
                        {s.answers ? `${percent(s.correct, s.answers)}%` : <span className="text-faint">—</span>}
                        {s.answers > 0 && <span className="block text-xs text-faint">{s.answers} ta javob</span>}
                      </td>
                      <td className={ui.td}>
                        {s.active ? (
                          <span className="text-muted">{s.lastLoginAt ? timeAgo(s.lastLoginAt) : "hali kirmagan"}</span>
                        ) : (
                          <span className={`${ui.badge} border-danger/30 text-danger`}>o‘chirilgan</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
