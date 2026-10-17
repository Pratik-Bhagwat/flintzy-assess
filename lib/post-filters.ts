import { platformOrder } from "@/lib/platforms";
import type { Platform, Post, PostStatus } from "@/lib/posts";

export type PostFilters = {
  q: string;
  status: PostStatus | "all";
  platform: Platform | "all";
};

const statuses: PostStatus[] = ["scheduled", "published", "failed"];

type ParamsLike = { get: (key: string) => string | null };

export const parseFilters = (params: ParamsLike): PostFilters => {
  const status = params.get("status");
  const platform = params.get("platform");

  return {
    q: params.get("q") ?? "",
    status: statuses.find((s) => s === status) ?? "all",
    platform: platformOrder.find((p) => p === platform) ?? "all",
  };
};

export const hasActiveFilters = ({ q, status, platform }: PostFilters) =>
  q.trim() !== "" || status !== "all" || platform !== "all";

export const filterPosts = (
  posts: Post[],
  { q, status, platform }: PostFilters,
) => {
  const needle = q.trim().toLowerCase();

  return posts.filter(
    (post) =>
      (status === "all" || post.status === status) &&
      (platform === "all" || post.platforms.includes(platform)) &&
      (needle === "" || post.content.toLowerCase().includes(needle)),
  );
};
