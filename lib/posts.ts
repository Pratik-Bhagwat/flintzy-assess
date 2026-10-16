import postsData from "@/data/posts.json";

export type Platform = "x" | "instagram" | "tiktok" | "facebook";
export type PostStatus = "scheduled" | "published" | "failed";

export type Post = {
  id: string;
  content: string;
  platforms: Platform[];
  mediaUrl: string | null;
  scheduledAt: string;
  status: PostStatus;
  errorMessage: string | null;
};

export const getPosts = () => postsData as Post[];
