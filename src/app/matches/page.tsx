"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, Trophy } from "lucide-react";
import { useMatches } from "@/hooks/useMatches";
import StatusBadge from "@/components/common/StatusBadge";
import type { MatchStatus } from "@/lib/api";
import clsx from "clsx";

const statusFilters: (MatchStatus | "all")[] = [
  "all",
  "processing",
  "pending",
  "completed",
  "stopped",
];

export default function MatchesPage() {
  const { matches, isLoading } = useMatches();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<MatchStatus | "all">("all");

  const filtered = matches.filter((m) => {
    if (statusFilter !== "all" && m.status !== statusFilter) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  const sorted = [...filtered].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Matches</h1>
        <p className="text-sm text-text-secondary mt-1">
          All match recordings and live sessions
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search matches…"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-bg-surface border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-blue transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={clsx(
                "px-3 py-2 rounded-lg text-xs font-medium transition-colors capitalize",
                statusFilter === s
                  ? "bg-accent-blue/15 text-accent-blue"
                  : "text-text-secondary hover:bg-bg-elevated"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="glass rounded-xl p-8 text-center text-text-muted text-sm">
          Loading matches…
        </div>
      ) : sorted.length === 0 ? (
        <div className="glass rounded-xl p-8 text-center text-text-muted text-sm">
          {search || statusFilter !== "all"
            ? "No matches found for current filters"
            : "No matches yet. Create one to get started."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sorted.map((match) => (
            <button
              key={match.id}
              onClick={() => router.push(`/matches/${match.id}`)}
              className="glass rounded-xl p-5 text-left hover:bg-bg-elevated/60 transition-colors group fade-up"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-bg-elevated text-text-muted group-hover:text-accent-blue transition-colors">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">
                      {match.name}
                    </p>
                    <p className="text-xs text-text-muted capitalize">
                      {match.source_type}
                    </p>
                  </div>
                </div>
                <StatusBadge status={match.status} />
              </div>
              <div className="flex items-center justify-between text-xs text-text-muted mt-2">
                <span>
                  Created {new Date(match.created_at).toLocaleDateString()}
                </span>
                <span className="font-mono text-[10px] text-text-muted/60">
                  {match.id.slice(0, 8)}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
