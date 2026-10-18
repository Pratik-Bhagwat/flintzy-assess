import { isFutureDay } from "@/lib/post-groups";
import type { Post, PostStatus } from "@/lib/posts";

export type RetryStatus = Extract<PostStatus, "scheduled" | "published">;

const SUCCESS_RATE = 0.8;
const LATENCY_MS = 1200;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getRetryStatus = (post: Post, timeZone: string): RetryStatus =>
  isFutureDay(post.scheduledAt, timeZone) ? "scheduled" : "published";

export const retryRequest = async (
  post: Post,
  nextStatus: RetryStatus,
): Promise<Post> => {
  await delay(LATENCY_MS);

  if (Math.random() >= SUCCESS_RATE) {
    throw new Error("Retry failed. Please try again.");
  }

  return { ...post, status: nextStatus, errorMessage: null };
};
