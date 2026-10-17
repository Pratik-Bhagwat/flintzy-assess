import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardNav } from "./components/navigation/dashboard-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardNav />
      <SidebarInset className="pb-[calc(6rem+env(safe-area-inset-bottom))] lg:pb-0">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
