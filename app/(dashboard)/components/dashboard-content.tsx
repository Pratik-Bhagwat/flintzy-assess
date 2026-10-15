import { CalendarClock, CircleCheck, Send, ShieldAlert } from "lucide-react";

import { FilterBar } from "./filter-bar";
import { StatPill, type StatPillProps } from "./stat-pill";

const stats: StatPillProps[] = [
  {
    label: "Scheduled",
    icon: CalendarClock,
    tone: "amber",
    count: 8,
    subtext: "Posts waiting to be published at their scheduled time.",
  },
  {
    label: "Published",
    icon: CircleCheck,
    tone: "green",
    count: 24,
    subtext:
      "Posts successfully published. You can show today's count or all-time total.",
  },
  {
    label: "Failed",
    icon: ShieldAlert,
    tone: "red",
    count: 2,
    subtext: "Posts that failed and may need a retry.",
  },
  {
    label: "Total Posts",
    icon: Send,
    tone: "blue",
    count: 34,
    subtext: "All posts across scheduled, published, and failed statuses.",
  },
];

export const DashboardContent = () => (
  <div className="flex w-full flex-col gap-5 px-5 py-6 md:px-8">
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatPill key={stat.label} {...stat} />
      ))}
    </div>
    <FilterBar />
  </div>
);
