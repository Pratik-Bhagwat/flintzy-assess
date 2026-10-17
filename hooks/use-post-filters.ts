"use client";

import { useSearchParams } from "next/navigation";

import { parseFilters, type PostFilters } from "@/lib/post-filters";

export const usePostFilters = (): PostFilters => {
  const searchParams = useSearchParams();
  return parseFilters(searchParams);
};

export const setFilterParams = (
  updates: Partial<Record<keyof PostFilters, string>>,
) => {
  const params = new URLSearchParams(window.location.search);

  for (const [key, value] of Object.entries(updates)) {
    if (value && value !== "all") params.set(key, value);
    else params.delete(key);
  }

  const query = params.toString();
  if (query === window.location.search.slice(1)) return;

  window.history.replaceState(
    null,
    "",
    query ? `?${query}` : window.location.pathname,
  );
};
