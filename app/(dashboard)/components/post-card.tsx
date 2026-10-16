import Image from "next/image";
import { Quote } from "lucide-react";

import { formatPostTime } from "@/lib/post-groups";
import type { Post, PostStatus } from "@/lib/posts";
import { cn } from "@/lib/utils";

import { PlatformStack } from "./platform-stack";

const statusStyles: Record<PostStatus, { label: string; className: string }> = {
  scheduled: {
    label: "Scheduled",
    className: "bg-info-bg text-info",
  },
  published: {
    label: "Published",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
  failed: {
    label: "Failed",
    className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  },
};

const StatusBadge = ({ status }: { status: PostStatus }) => {
  const { label, className } = statusStyles[status];

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium",
        className,
      )}
    >
      {label}
    </span>
  );
};

export const PostCard = ({
  post,
  timeZone,
}: {
  post: Post;
  timeZone: string;
}) => {
  const hasMedia = Boolean(post.mediaUrl);

  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-sm">
      {hasMedia ? (
        <div className="relative aspect-video shrink-0 bg-muted">
          <Image
            src={post.mediaUrl!}
            alt="Post media"
            fill
            sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
            className="object-cover"
          />
          <div className="absolute top-3 right-3">
            <StatusBadge status={post.status} />
          </div>
        </div>
      ) : (
        <div className="relative flex aspect-video shrink-0 flex-col justify-between gap-3 overflow-hidden bg-muted/60 p-5">
          <div className="flex items-start justify-between gap-3">
            <span className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
              <Quote className="size-4" />
            </span>
            <StatusBadge status={post.status} />
          </div>

          <p className="line-clamp-3 text-base leading-relaxed font-medium text-foreground">
            {post.content}
          </p>

          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Text post
          </span>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 md:p-5">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <PlatformStack platforms={post.platforms} />
        </div>

        {hasMedia ? (
          <p className="line-clamp-4 text-sm leading-relaxed text-foreground">
            {post.content}
          </p>
        ) : (
          <p className="text-sm leading-relaxed text-foreground">
            {post.content}
          </p>
        )}

        {post.status === "failed" && post.errorMessage && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950 dark:text-red-300">
            {post.errorMessage}
          </p>
        )}

        <div className="mt-auto border-t border-border pt-3">
          <span className="text-sm font-semibold text-foreground">
            {formatPostTime(post.scheduledAt, timeZone)}
          </span>
        </div>
      </div>
    </article>
  );
};
