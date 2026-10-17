import { platformConfig } from "@/lib/platforms";
import type { Platform } from "@/lib/posts";

export const countChars = (text: string) => Array.from(text).length;

export const getOverLimitPlatforms = (platforms: Platform[], count: number) =>
  platforms.filter((platform) => count > platformConfig[platform].charLimit);

const pad = (n: number) => String(n).padStart(2, "0");

export const toDateInputValue = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const toTimeInputValue = (date: Date) =>
  `${pad(date.getHours())}:${pad(date.getMinutes())}`;

export type ScheduleErrors = { date?: string; time?: string };

export const getScheduleErrors = (
  date: string,
  time: string,
  now: Date,
): ScheduleErrors => {
  const errors: ScheduleErrors = {};

  if (date && date < toDateInputValue(now)) {
    errors.date = "Choose today or a future date.";
  } else if (date && time) {
    const scheduledAt = new Date(`${date}T${time}`);

    if (scheduledAt.getTime() <= now.getTime()) {
      errors.time = "Choose a time in the future.";
    }
  }

  return errors;
};
