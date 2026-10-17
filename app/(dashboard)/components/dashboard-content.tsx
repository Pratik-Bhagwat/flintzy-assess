import { Suspense } from "react";
import { CalendarClock, CircleCheck, Send, ShieldAlert } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { getPosts, type Post, type PostStatus } from "@/lib/posts";

import { FilterBar } from "./filter-bar";
import { PostSections, PostSectionsSkeleton } from "./post-sections";
import { StatPill, type StatPillProps } from "./stat-pill";
import { Wrapper } from "@/components/wrapper";

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

export const DashboardContent = () => {
  const posts = getPosts();

  return (
    <Wrapper className="p-0">
      <div className="flex w-full flex-col gap-5 px-5 py-6 md:px-8">
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {getStats(posts).map((stat) => (
            <StatPill key={stat.label} {...stat} />
          ))}
        </div>

        <Suspense fallback={<Skeleton className="h-11 w-full" />}>
          <FilterBar />
        </Suspense>

        <Suspense fallback={<PostSectionsSkeleton />}>
          <PostSections posts={posts} />
        </Suspense>
      </div>
    </Wrapper>
  );
};
