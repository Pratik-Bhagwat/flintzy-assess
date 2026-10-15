import { BottomNav } from "./bottom-nav";
import { DashboardSidebar } from "./dashboard-sidebar";

export const DashboardNav = () => (
  <>
    <div className="hidden lg:block">
      <DashboardSidebar />
    </div>
    <BottomNav />
  </>
);
