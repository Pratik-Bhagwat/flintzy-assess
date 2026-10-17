import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { getPosts } from "@/lib/posts";

import { FilterBar } from "./filter-bar";
import { PostSections, PostSectionsSkeleton } from "./post-sections";
import { PostStats } from "./post-stats";
import { PostsProvider } from "@/contexts/post-context";

export const DashboardContent = () => (
  <PostsProvider initialPosts={getPosts()}>
    <div className="flex w-full flex-col gap-5 px-5 py-6 md:px-8">
      <PostStats />

      <Suspense fallback={<Skeleton className="h-11 w-full" />}>
        <FilterBar />
      </Suspense>

      <Suspense fallback={<PostSectionsSkeleton />}>
        <PostSections />
      </Suspense>
    </div>
  </PostsProvider>
);
