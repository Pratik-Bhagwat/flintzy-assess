"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronsDown, ChevronsUp } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { Post } from "@/lib/posts";
import { cn } from "@/lib/utils";

import { PostCard, postCardId } from "./post-card";
import { usePosts } from "@/contexts/post-context";

type PostSectionProps = {
  title: string;
  dateLabel?: string;
  posts: Post[];
  timeZone: string;
  defaultOpen?: boolean;
};

export const PostSection = ({
  title,
  dateLabel,
  posts,
  timeZone,
  defaultOpen = false,
}: PostSectionProps) => {
  const { retries, retryPost, lastAddedId } = usePosts();
  const hasNewPost =
    lastAddedId !== null && posts.some((post) => post.id === lastAddedId);

  const [isOpen, setIsOpen] = useState(defaultOpen || hasNewPost);
  const [seenAddedId, setSeenAddedId] = useState(lastAddedId);
  const ToggleIcon = isOpen ? ChevronsUp : ChevronsDown;

  if (lastAddedId !== seenAddedId) {
    setSeenAddedId(lastAddedId);
    if (hasNewPost) setIsOpen(true);
  }

  useEffect(() => {
    if (!hasNewPost || !isOpen || !lastAddedId) return;
    document
      .getElementById(postCardId(lastAddedId))
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [hasNewPost, isOpen, lastAddedId]);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger className="flex w-full min-w-0 cursor-pointer items-center gap-2.5 rounded-md py-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-card">
          <ChevronDown
            className={cn(
              "size-4 transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </span>

        <span className="min-w-0 truncate font-headings text-base font-bold text-foreground sm:text-lg">
          {title}
        </span>

        {dateLabel && (
          <span className="hidden truncate text-sm text-muted-foreground md:inline">
            {dateLabel}
          </span>
        )}

        <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {posts.length}
        </span>

        <span className="h-px min-w-4 flex-1 bg-border" />

        <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-muted-foreground sm:gap-1.5 sm:text-sm">
          <ToggleIcon className="size-4" />
          <span className="hidden sm:inline">
            {isOpen ? "Collapse" : "Expand"}
          </span>
        </span>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="grid gap-4 pt-3 sm:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              timeZone={timeZone}
              retry={retries[post.id]}
              onRetry={retryPost}
              highlight={post.id === lastAddedId}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
