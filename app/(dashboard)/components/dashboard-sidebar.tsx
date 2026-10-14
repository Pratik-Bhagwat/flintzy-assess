import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LogOutIcon,
  Logs,
  Send,
  SettingsIcon,
  UserIcon,
  Zap,
} from "lucide-react";
import Link from "next/link";

const sidebarItems = [
  {
    name: "Queue",
    icon: Logs,
    url: "/",
    isActive: true,
  },
  {
    name: "Published",
    icon: Send,
    url: "/published",
    isActive: false,
  },
];

export const DasboardSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-5 pt-6 pb-5 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center">
            <Zap className="text-accent" />
          </div>
          <div>
            <div className="font-headings font-bold text-base leading-none text-foreground">
              <span>Postify</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              automate your posts
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-2 gap-1">
          {sidebarItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                render={<Link href={item.url} />}
                isActive={item.isActive}
                className="px-3"
              >
                <item.icon />
                <span>{item.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-border p-4">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="flex w-full items-center cursor-pointer gap-3 text-left"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent font-headings text-sm font-bold text-accent-foreground">
                  P
                </div>

                <div className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">
                    Pratik Bhagwat
                  </span>
                </div>
              </button>
            }
          />

          <DropdownMenuContent align="end" side="right">
            <DropdownMenuItem>
              <UserIcon />
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem>
              <SettingsIcon />
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem variant="destructive">
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
