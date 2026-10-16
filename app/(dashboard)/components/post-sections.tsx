"use client";

import { useMemo, useSyncExternalStore } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { groupUpcomingPosts } from "@/lib/post-groups";
import type { Post } from "@/lib/posts";

import { PostSection } from "./post-section";

const subscribe = () => () => {};
const getBrowserTimeZone = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone;
const getServerTimeZone = () => null;

const useTimeZone = () =>
  useSyncExternalStore<string | null>(
    subscribe,
    getBrowserTimeZone,
    getServerTimeZone,
  );

const PostSectionsSkeleton = () => (
  <div className="flex flex-col gap-3" aria-busy="true">
    <Skeleton className="h-8 w-full" />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <Skeleton className="h-72 rounded-lg" />
    </div>
  </div>
);

export const PostSections = ({ posts }: { posts: Post[] }) => {
  const timeZone = useTimeZone();

  const groups = useMemo(
    () => (timeZone ? groupUpcomingPosts(posts, timeZone) : []),
    [posts, timeZone],
  );

  if (!timeZone) return <PostSectionsSkeleton />;

  if (groups.length === 0) {
    return <p className="text-sm text-muted-foreground">No upcoming posts.</p>;
  }

  return (
    <>
      {groups.map((group) => (
        <PostSection
          key={group.id}
          title={group.title}
          dateLabel={group.dateLabel}
          posts={group.posts}
          timeZone={timeZone}
          defaultOpen={group.defaultOpen}
        />
      ))}
    </>
  );
};
