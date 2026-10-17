import type { Metadata } from "next";

import { DashboardContent } from "./components/dashboard-content";

export const metadata: Metadata = {
  title: "Queue",
  description: "Upcoming posts, grouped by day.",
};

export default function Dashboard() {
  return (
    <div className="w-full min-w-0 flex-1">
      <DashboardContent />
    </div>
  );
}
