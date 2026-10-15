"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { isRouteActive, navItems } from "./nav-items";
import { currentUser, UserAvatar, UserMenuContent } from "./user-menu";

const tabClass =
  "flex h-full w-full flex-col items-center justify-center gap-1 text-xs font-medium transition-colors";

export const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-backdrop-filter:bg-background/80 lg:hidden"
    >
      <ul className="mx-auto flex h-16 max-w-md items-stretch px-2">
        {navItems.map(({ name, icon: Icon, url }) => {
          const active = isRouteActive(pathname, url);

          return (
            <li key={url} className="flex-1">
              <Link
                href={url}
                aria-current={active ? "page" : undefined}
                className={cn(
                  tabClass,
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-14 items-center justify-center rounded-full transition-colors",
                    active && "bg-primary text-accent",
                  )}
                >
                  <Icon className="size-5" />
                </span>
                <span>{name}</span>
              </Link>
            </li>
          );
        })}

        <li className="flex-1">
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                tabClass,
                "cursor-pointer text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="flex h-7 w-14 items-center justify-center">
                <UserAvatar
                  name={currentUser.name}
                  className="size-6 text-xs"
                />
              </span>
              <span>Account</span>
            </DropdownMenuTrigger>
            <UserMenuContent side="top" align="end" />
          </DropdownMenu>
        </li>
      </ul>
    </nav>
  );
};
