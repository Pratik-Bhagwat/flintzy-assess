import type { Platform } from "@/lib/posts";

export type PlatformConfig = {
  label: string;
  icon: string;
  charLimit: number;
};

export const platformConfig: Record<Platform, PlatformConfig> = {
  x: { label: "X", icon: "/LogosX.svg", charLimit: 280 },
  facebook: { label: "Facebook", icon: "/LogosFacebook.svg", charLimit: 5000 },
  tiktok: { label: "TikTok", icon: "/LogosTiktokIcon.svg", charLimit: 2200 },
  instagram: {
    label: "Instagram",
    icon: "/LogosInstagramIcon.svg",
    charLimit: 2200,
  },
};

export const platformOrder: Platform[] = [
  "x",
  "facebook",
  "tiktok",
  "instagram",
];
