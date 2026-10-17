import type { Post } from "@/lib/posts";

const SUCCESS_RATE = 0.8;
const LATENCY_MS = 1200;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const publishPost = async (post: Post): Promise<Post> => {
  await delay(LATENCY_MS);

  if (Math.random() >= SUCCESS_RATE) {
    throw new Error("Retry failed. Please try again.");
  }

  return { ...post, status: "published", errorMessage: null };
};
