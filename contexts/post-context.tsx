"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { Post } from "@/lib/posts";
import { publishPost } from "@/lib/publish-post";

export type RetryState = { pending: boolean; error?: string };

type PostsContextValue = {
  posts: Post[];
  retries: Record<string, RetryState>;
  retryPost: (post: Post) => Promise<void>;
};

const PostsContext = createContext<PostsContextValue | null>(null);

export const PostsProvider = ({
  initialPosts,
  children,
}: {
  initialPosts: Post[];
  children: ReactNode;
}) => {
  const [posts, setPosts] = useState(initialPosts);
  const [retries, setRetries] = useState<Record<string, RetryState>>({});
  const inFlight = useRef(new Set<string>());

  const retryPost = useCallback(async (original: Post) => {
    const { id } = original;

    if (inFlight.current.has(id)) return;

    inFlight.current.add(id);

    const replacePost = (next: Post) =>
      setPosts((prev) => prev.map((p) => (p.id === id ? next : p)));

    const setRetry = (state: RetryState | null) =>
      setRetries((prev) => {
        const next = { ...prev };
        if (state) next[id] = state;
        else delete next[id];
        return next;
      });

    replacePost({ ...original, status: "published", errorMessage: null });

    setRetry({ pending: true });

    try {
      replacePost(await publishPost(original));
      setRetry(null);
    } catch (error) {
      replacePost(original);
      setRetry({
        pending: false,
        error:
          error instanceof Error
            ? error.message
            : "Retry failed. Please try again.",
      });
    } finally {
      inFlight.current.delete(id);
    }
  }, []);

  const value = useMemo(
    () => ({ posts, retries, retryPost }),
    [posts, retries, retryPost],
  );

  return (
    <PostsContext.Provider value={value}>{children}</PostsContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostsContext);

  if (!context) throw new Error("usePosts must be used within <PostsProvider>");
  return context;
};
