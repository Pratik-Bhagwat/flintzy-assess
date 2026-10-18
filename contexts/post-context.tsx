"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { NewPost, Post } from "@/lib/posts";
import { getRetryStatus, retryRequest } from "@/lib/retry-post";

export type RetryState = { pending: boolean; error?: string };

type PostsContextValue = {
  posts: Post[];
  retries: Record<string, RetryState>;
  retryPost: (post: Post) => Promise<void>;
  addPost: (input: NewPost) => Post;
  lastAddedId: string | null;
};

const HIGHLIGHT_MS = 4000;

const createPostId = () => `post-${crypto.randomUUID()}`;

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
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const inFlight = useRef(new Set<string>());
  const highlightTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(highlightTimer.current), []);

  const addPost = useCallback((input: NewPost): Post => {
    const post: Post = {
      ...input,
      id: createPostId(),
      status: "scheduled",
      errorMessage: null,
    };

    setPosts((prev) => [...prev, post]);

    setLastAddedId(post.id);

    clearTimeout(highlightTimer.current);

    highlightTimer.current = setTimeout(
      () => setLastAddedId(null),
      HIGHLIGHT_MS,
    );

    return post;
  }, []);

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

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const nextStatus = getRetryStatus(original, timeZone);

    replacePost({ ...original, status: nextStatus, errorMessage: null });
    setRetry({ pending: true });

    try {
      replacePost(await retryRequest(original, nextStatus));
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
    () => ({ posts, retries, retryPost, addPost, lastAddedId }),
    [posts, retries, retryPost, addPost, lastAddedId],
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
