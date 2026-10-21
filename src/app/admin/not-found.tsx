import Link from "next/link";
import { ui } from "@/frontend/admin/ui";

export default function AdminNotFound() {
  return (
    <div className="py-24 text-center">
      <p className="font-mono text-6xl font-light text-faint">404</p>
      <h1 className="mt-4 text-xl font-semibold">Topilmadi</h1>
      <p className="mt-2 text-sm text-muted">Bunday sahifa yo‘q yoki unga kirish huquqingiz yo‘q.</p>
      <Link href="/admin" className={`${ui.btn} ${ui.ghost} mt-8`}>
        Admin bosh sahifa
      </Link>
    </div>
  );
}
