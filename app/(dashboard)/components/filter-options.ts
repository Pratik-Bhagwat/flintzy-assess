export type FilterOption = {
  label: string;
  value: string;
};

export const statusOptions: FilterOption[] = [
  { label: "All", value: "all" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Published", value: "published" },
  { label: "Failed", value: "failed" },
];

export const platformOptions: FilterOption[] = [
  { label: "All", value: "all" },
  { label: "X", value: "x" },
  { label: "Instagram", value: "instagram" },
  { label: "TikTok", value: "tiktok" },
  { label: "Facebook", value: "facebook" },
];
