"use client";

import { CalendarClock, CircleCheck, Send, ShieldAlert } from "lucide-react";

import type { Post, PostStatus } from "@/lib/posts";

import { StatPill, type StatPillProps } from "./stat-pill";
import { usePosts } from "@/contexts/post-context";

const getStats = (posts: Post[]): StatPillProps[] => {
  const count = (status: PostStatus) =>
    posts.filter((post) => post.status === status).length;

  return [
    {
      label: "Scheduled",
      icon: CalendarClock,
      tone: "amber",
      count: count("scheduled"),
      subtext: "Posts waiting to be published at their scheduled time.",
    },
    {
      label: "Published",
      icon: CircleCheck,
      tone: "green",
      count: count("published"),
      subtext:
        "Posts successfully published. You can show today's count or all-time total.",
    },
    {
      label: "Failed",
      icon: ShieldAlert,
      tone: "red",
      count: count("failed"),
      subtext: "Posts that failed and may need a retry.",
    },
    {
      label: "Total Posts",
      icon: Send,
      tone: "blue",
      count: posts.length,
      subtext: "All posts across scheduled, published, and failed statuses.",
    },
  ];
};

export const PostStats = () => {
  const { posts } = usePosts();

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {getStats(posts).map((stat) => (
        <StatPill key={stat.label} {...stat} />
      ))}
    </div>
  );
};
