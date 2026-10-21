import { LockKeyhole } from "lucide-react";

export function ComingSoon({ title, label, text }: { title: string; label: string; text: string }) {
  return (
    <div className="mx-auto max-w-site px-4 pt-16 sm:px-6 lg:px-10 sm:pt-24">
      <h1 className="stamp-xl">{title}</h1>
      <div className="relative isolate mt-12 flex flex-col items-center overflow-hidden rounded-card border border-dashed border-border-strong px-6 py-24 text-center">
        <div aria-hidden className="bloom -top-24 left-1/2 -z-10 size-72 -translate-x-1/2 opacity-30" />
        <span className="grid size-14 place-items-center rounded-full border border-border-strong bg-bg">
          <LockKeyhole aria-hidden className="size-5 text-accent" />
        </span>
        <p className="stamp mt-6 text-xs">{label}</p>
        <p className="mt-2 text-sm text-muted">{text}</p>
      </div>
    </div>
  );
}
