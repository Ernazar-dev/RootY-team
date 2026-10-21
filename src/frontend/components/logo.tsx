import Image from "next/image";
import mark from "../../../public/brand/ry-logo.png";

// The RY shield plus the wordmark. The mark is the background-free cut of
// lannding-design/RY-logo.jpg. `compact` drops the tagline for narrow
// places (the admin sidebar).
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <Image src={mark} alt="" width={38} height={44} preload className="h-11 w-auto shrink-0" />
      <span className="leading-none">
        <span className="block text-[1.0625rem] font-bold tracking-tight">
          RootY <span className="text-signal">Team</span>
        </span>
        {!compact && (
          <span className="mt-1 block font-mono text-[0.5625rem] tracking-[0.18em] whitespace-nowrap text-muted uppercase">
            Learn · Practice · Defend
          </span>
        )}
      </span>
    </span>
  );
}
