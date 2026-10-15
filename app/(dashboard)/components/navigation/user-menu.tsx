import type { ComponentProps } from "react";
import { LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export const currentUser = { name: "Pratik Bhagwat" };

export const UserAvatar = ({
  name,
  className,
}: {
  name: string;
  className?: string;
}) => (
  <div
    className={cn(
      "flex size-9 shrink-0 items-center justify-center rounded-full bg-accent font-headings text-sm font-bold text-accent-foreground",
      className,
    )}
  >
    {name.charAt(0).toUpperCase()}
  </div>
);

type UserMenuContentProps = Pick<
  ComponentProps<typeof DropdownMenuContent>,
  "side" | "align"
>;

export const UserMenuContent = (props: UserMenuContentProps) => (
  <DropdownMenuContent {...props}>
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
);
