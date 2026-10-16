import type { Post } from "@/lib/posts";

export type PostGroup = {
  id: string;
  title: string;
  dateLabel?: string;
  posts: Post[];
  defaultOpen: boolean;
};

const dayKey = (date: Date, timeZone: string) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

const addDays = (key: string, days: number) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
};

const formatDay = (key: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-US", { ...options, timeZone: "UTC" }).format(
    new Date(`${key}T12:00:00Z`),
  );

export const formatPostTime = (iso: string, timeZone: string) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));

export const groupUpcomingPosts = (
  posts: Post[],
  timeZone: string,
  now = new Date(),
): PostGroup[] => {
  const todayKey = dayKey(now, timeZone);
  const tomorrowKey = addDays(todayKey, 1);

  const byDay = new Map<string, Post[]>();

  for (const post of posts) {
    const key = dayKey(new Date(post.scheduledAt), timeZone);

    if (key < todayKey) continue;

    byDay.set(key, [...(byDay.get(key) ?? []), post]);
  }

  return [...byDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, dayPosts]) => {
      const isRelative = key === todayKey || key === tomorrowKey;

      return {
        id: key,
        title:
          key === todayKey
            ? "Today"
            : key === tomorrowKey
              ? "Tomorrow"
              : formatDay(key, {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                }),
        dateLabel: isRelative
          ? formatDay(key, { weekday: "short", month: "short", day: "numeric" })
          : undefined,
        posts: [...dayPosts].sort(
          (a, b) => Date.parse(a.scheduledAt) - Date.parse(b.scheduledAt),
        ),
        defaultOpen: key === todayKey,
      };
    });
};
