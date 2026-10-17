import Image from "next/image";

import { platformConfig } from "@/lib/platforms";
import type { Platform } from "@/lib/posts";

export const PlatformStack = ({ platforms }: { platforms: Platform[] }) => (
  <ul className="flex -space-x-1.5" aria-label="Platforms">
    {platforms.map((platform) => {
      const { label, icon } = platformConfig[platform];

      return (
        <li
          key={platform}
          title={label}
          className="flex size-7 items-center justify-center rounded-full border border-border bg-white ring-2 ring-card"
        >
          <Image
            src={icon}
            alt={label}
            width={14}
            height={14}
            className="size-3.5"
          />
        </li>
      );
    })}
  </ul>
);
