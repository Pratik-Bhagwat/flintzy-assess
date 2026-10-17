import { Logs, Send, type LucideIcon } from "lucide-react";

export type NavItem = {
  name: string;
  icon: LucideIcon;
  url: string;
};

export const navItems: NavItem[] = [
  { name: "Queue", icon: Logs, url: "/" },
  // { name: "Published", icon: Send, url: "/published" },
];

export const isRouteActive = (pathname: string, url: string) =>
  url === "/"
    ? pathname === "/"
    : pathname === url || pathname.startsWith(`${url}/`);
