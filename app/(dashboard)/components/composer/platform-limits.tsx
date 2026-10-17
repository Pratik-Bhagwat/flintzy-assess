import Image from "next/image";

import { platformConfig } from "@/lib/platforms";
import type { Platform } from "@/lib/posts";
import { cn } from "@/lib/utils";

const LimitRow = ({
  platform,
  count,
}: {
  platform: Platform;
  count: number;
}) => {
  const { label, icon, charLimit } = platformConfig[platform];
  const ratio = count / charLimit;
  const isOver = count > charLimit;

  return (
    <li className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="flex items-center gap-1.5 font-medium text-foreground">
          <Image src={icon} alt="" width={12} height={12} className="size-3" />
          {label}
        </span>
        <span
          className={cn(
            "font-mono tabular-nums text-muted-foreground",
            isOver && "font-semibold text-destructive",
          )}
        >
          {count.toLocaleString()} / {charLimit.toLocaleString()}
          {isOver && ` (${(count - charLimit).toLocaleString()} over)`}
        </span>
      </div>

      <div
        role="progressbar"
        aria-label={`${label} characters used`}
        aria-valuemin={0}
        aria-valuemax={charLimit}
        aria-valuenow={Math.min(count, charLimit)}
        aria-valuetext={`${count} of ${charLimit} characters`}
        className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-200",
            isOver
              ? "bg-destructive"
              : ratio >= 0.9
                ? "bg-amber-500"
                : "bg-primary",
          )}
          style={{ width: `${Math.min(ratio, 1) * 100}%` }}
        />
      </div>
    </li>
  );
};

export const PlatformLimits = ({
  platforms,
  count,
}: {
  platforms: Platform[];
  count: number;
}) => {
  if (platforms.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        Select a platform to see its character limit.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3" aria-label="Character limits">
      {platforms.map((platform) => (
        <LimitRow key={platform} platform={platform} count={count} />
      ))}
    </ul>
  );
};
