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

const itemClass =
  "flex h-12 flex-1 items-center justify-center overflow-hidden rounded-full px-3 text-sm font-medium whitespace-nowrap outline-none transition-[background-color,color,transform] duration-300 ease-out focus-visible:ring-2 focus-visible:ring-ring/50 active:scale-95";

const idleClass = "text-muted-foreground hover:bg-muted hover:text-foreground";

export const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
    >
      <ul className="pointer-events-auto mx-auto flex max-w-sm items-center gap-1 rounded-full border border-border/60 bg-card/85 p-1.5 shadow-lg shadow-black/10 backdrop-blur-xl">
        {navItems.map(({ name, icon: Icon, url }) => {
          const active = isRouteActive(pathname, url);

          return (
            <li
              key={url}
              className={cn(
                "flex min-w-0 basis-0 transition-[flex-grow] duration-300 ease-out",
                active ? "grow-2" : "grow",
              )}
            >
              <Link
                href={url}
                aria-current={active ? "page" : undefined}
                className={cn(
                  itemClass,
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : idleClass,
                )}
              >
                <Icon className="size-5 shrink-0" />
                <span
                  className={cn(
                    "overflow-hidden transition-[max-width,margin,opacity] duration-300 ease-out",
                    active
                      ? "ml-2 max-w-24 opacity-100"
                      : "ml-0 max-w-0 opacity-0",
                  )}
                >
                  {name}
                </span>
              </Link>
            </li>
          );
        })}

        <li className="flex min-w-0 grow basis-0">
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                itemClass,
                idleClass,
                "cursor-pointer aria-expanded:bg-muted",
              )}
            >
              <UserAvatar name={currentUser.name} className="size-7 text-xs" />
              <span className="sr-only">Account</span>
            </DropdownMenuTrigger>
            <UserMenuContent side="top" align="end" />
          </DropdownMenu>
        </li>
      </ul>
    </nav>
  );
};
