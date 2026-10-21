import type { Metadata } from "next";
import Link from "next/link";
import { listGroups } from "@/backend/services/admin";
import { CreateGroupForm, GroupDelete, GroupRename } from "@/frontend/admin/forms";
import { PageHeader } from "@/frontend/admin/parts";
import { formatDate } from "@/frontend/admin/format";
import { ui } from "@/frontend/admin/ui";

export const metadata: Metadata = { title: "Guruhlar" };

export default async function GroupsPage() {
  const groups = await listGroups();
  return (
    <>
      <PageHeader title="Guruhlar" lead="Sinf yoki oqim bo‘yicha guruhlar. Guruh o‘chirilsa, o‘quvchilari saqlanadi — faqat guruhsiz qoladi." />

      <section className={`${ui.card} p-5`}>
        <CreateGroupForm />
      </section>

      <section className={`${ui.card} mt-6 overflow-hidden`}>
        {groups.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-muted">Hali guruh yo‘q.</p>
        ) : (
          <ul className="divide-y divide-border">
            {groups.map((g) => (
              <li key={g.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                <div>
                  <GroupRename id={g.id} name={g.name} />
                  <p className="mt-0.5 text-xs text-muted">yaratilgan {formatDate(g.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Link href={`/admin/students?group=${g.id}`} className={`${ui.btn} ${ui.ghost} h-9`}>
                    {g.members} o‘quvchi
                  </Link>
                  <GroupDelete id={g.id} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
