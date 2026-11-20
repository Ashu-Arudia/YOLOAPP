"use client";

import useSWR from "swr";
import { api, type Match } from "@/lib/api";

export function useMatches(refreshInterval = 5000) {
  const { data, error, isLoading, mutate } = useSWR<Match[]>(
    "matches",
    () => api.listMatches(),
    { refreshInterval }
  );

  return {
    matches: data ?? [],
    isLoading,
    error,
    refresh: mutate,
  };
}

export function useMatch(id: string | null, refreshInterval = 3000) {
  const { data, error, isLoading, mutate } = useSWR<Match>(
    id ? `match-${id}` : null,
    () => api.getMatch(id!),
    { refreshInterval }
  );

  return {
    match: data ?? null,
    isLoading,
    error,
    refresh: mutate,
  };
}
