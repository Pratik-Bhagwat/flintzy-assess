import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const tones = {
  amber:
    "bg-amber-500/10 text-amber-600 dark:bg-amber-400/15 dark:text-amber-400",
  green:
    "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-400",
  red: "bg-red-500/10 text-red-600 dark:bg-red-400/15 dark:text-red-400",
  blue: "bg-blue-500/10 text-blue-600 dark:bg-blue-400/15 dark:text-blue-400",
} as const;

export type StatTone = keyof typeof tones;

export type StatPillProps = {
  icon: LucideIcon;
  count: number;
  label: string;
  subtext: string;
  tone: StatTone;
};

export const StatPill = ({
  icon: Icon,
  count,
  label,
  subtext,
  tone,
}: StatPillProps) => (
  <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-border/70 bg-card p-3.5 transition-colors hover:bg-accent/30 sm:flex-row sm:items-start sm:p-4">
    <div
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-lg sm:size-10",
        tones[tone],
      )}
    >
      <Icon className="size-[18px] sm:size-5" strokeWidth={1.8} />
    </div>

    <div className="flex min-w-0 flex-col gap-1">
      <p className="truncate text-sm font-medium text-muted-foreground">
        {label}
      </p>

      <p className="font-headings text-2xl leading-none font-semibold tracking-tight text-foreground">
        {count.toLocaleString()}
      </p>

      <p className="mt-1 hidden text-xs leading-relaxed text-muted-foreground sm:block">
        {subtext}
      </p>
    </div>
  </div>
);
