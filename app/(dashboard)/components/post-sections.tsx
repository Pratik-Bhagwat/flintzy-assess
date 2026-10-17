"use client";

import { useMemo, useSyncExternalStore } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { filterPosts, hasActiveFilters } from "@/lib/post-filters";
import { groupUpcomingPosts } from "@/lib/post-groups";
import type { Post } from "@/lib/posts";

import { PostSection } from "./post-section";
import { usePostFilters } from "@/hooks/use-post-filters";
import { CalendarClock, Search } from "lucide-react";
import { PostCardSkeleton } from "./post-card";

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

export const PostSectionsSkeleton = () => (
  <div className="flex flex-col gap-3" aria-busy="true">
    <Skeleton className="h-8 w-full" />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <PostCardSkeleton key={index} />
      ))}
    </div>
  </div>
);

const EmptyPostSkeleton = ({ isFiltered }: { isFiltered: boolean }) => {
  return (
    <div className="flex md:min-h-[450px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-border bg-background shadow-sm">
        {isFiltered ? (
          <Search className="size-6 text-muted-foreground" />
        ) : (
          <CalendarClock className="size-6 text-muted-foreground" />
        )}
      </div>

      <h3 className="text-base font-semibold tracking-tight text-foreground">
        {isFiltered ? "No matching posts" : "Nothing scheduled yet"}
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        {isFiltered
          ? "We couldn't find any posts matching your filters. Try adjusting your search or filters."
          : "Your schedule is looking clear. Create a post and schedule it to see it appear here."}
      </p>
    </div>
  );
};

export const PostSections = ({ posts }: { posts: Post[] }) => {
  const timeZone = useTimeZone();
  const { q, status, platform } = usePostFilters();
  const isFiltered = hasActiveFilters({ q, status, platform });

  const groups = useMemo(
    () =>
      timeZone
        ? groupUpcomingPosts(
            filterPosts(posts, { q, status, platform }),
            timeZone,
          )
        : [],
    [posts, q, status, platform, timeZone],
  );

  if (!timeZone) return <PostSectionsSkeleton />;

  if (groups.length === 0) {
    return <EmptyPostSkeleton isFiltered={isFiltered} />;
  }

  return (
    <>
      {groups.map((group) => (
        <PostSection
          key={`${group.id}-${isFiltered}`}
          title={group.title}
          dateLabel={group.dateLabel}
          posts={group.posts}
          timeZone={timeZone}
          defaultOpen={group.defaultOpen || isFiltered}
        />
      ))}
    </>
  );
};
