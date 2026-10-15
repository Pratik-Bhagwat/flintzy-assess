"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  DropdownMenu,
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

import { Brand } from "./brand";
import { isRouteActive, navItems } from "./nav-items";
import { currentUser, UserAvatar, UserMenuContent } from "./user-menu";

export const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <Brand />
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="gap-1 px-2">
          {navItems.map(({ name, icon: Icon, url }) => (
            <SidebarMenuItem key={url}>
              <SidebarMenuButton
                render={<Link href={url} />}
                isActive={isRouteActive(pathname, url)}
                className="px-3"
              >
                <Icon />
                <span>{name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full cursor-pointer items-center gap-3 text-left">
            <UserAvatar name={currentUser.name} />
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
              {currentUser.name}
            </span>
          </DropdownMenuTrigger>
          <UserMenuContent side="right" align="end" />
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
