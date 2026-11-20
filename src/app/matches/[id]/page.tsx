"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Play,
  Square,
  Users,
  Crosshair,
  Gauge,
  MonitorPlay,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { api, type PlayerTrack } from "@/lib/api";
import { useMatch } from "@/hooks/useMatches";
import { useAnalytics } from "@/hooks/useAnalytics";
import StatusBadge from "@/components/common/StatusBadge";
import StatsCard from "@/components/analytics/StatsCard";
import PossessionBar from "@/components/analytics/PossessionBar";
import PlayerTable from "@/components/analytics/PlayerTable";
import LiveChart from "@/components/analytics/LiveChart";
import clsx from "clsx";

export default function MatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { match, isLoading: matchLoading, refresh } = useMatch(id);
  const { data: analytics, status: wsStatus } = useAnalytics(
    match?.status === "processing" ? id : null
  );
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch players
  const { data: players } = useSWR<PlayerTrack[]>(
    match?.status === "processing" ? `players-${id}` : null,
    () => api.getPlayers(id),
    { refreshInterval: 3000 }
  );

  const handleStart = async () => {
    setActionLoading(true);
    try {
      await api.startMatch(id);
      await refresh();
    } finally {
      setActionLoading(false);
    }
  };

  const handleStop = async () => {
    setActionLoading(true);
    try {
      await api.stopMatch(id);
      await refresh();
    } finally {
      setActionLoading(false);
    }
  };

  if (matchLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-text-muted text-sm">
        Loading match…
      </div>
    );
  }

  if (!match) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-text-muted text-sm">Match not found</p>
        <Link
          href="/matches"
          className="text-accent-blue text-sm hover:underline"
        >
          ← Back to Matches
        </Link>
      </div>
    );
  }

  const isProcessing = match.status === "processing";
  const teamA = analytics?.possession?.team_a_pct ?? 50;
  const teamB = analytics?.possession?.team_b_pct ?? 50;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/matches"
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-bg-surface border border-border hover:bg-bg-elevated transition-colors text-text-secondary"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-text-primary">
              {match.name}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <StatusBadge status={match.status} />
              <span className="text-xs text-text-muted font-mono">
                {match.id.slice(0, 8)}
              </span>
              {isProcessing && (
                <span className="flex items-center gap-1.5 text-xs text-accent-green">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-green pulse-dot" />
                  WS {wsStatus}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {match.status === "pending" && (
            <button
              onClick={handleStart}
              disabled={actionLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-green text-white text-sm font-medium hover:bg-accent-green/90 transition-colors disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              Start Processing
            </button>
          )}
          {isProcessing && (
            <button
              onClick={handleStop}
              disabled={actionLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-team-a text-white text-sm font-medium hover:bg-team-a/90 transition-colors disabled:opacity-50"
            >
              <Square className="w-4 h-4" />
              Stop
            </button>
          )}
        </div>
      </div>

      {/* Video + Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Stream */}
        <div className="lg:col-span-2">
          <div className="glass rounded-xl overflow-hidden fade-up">
            <div className="px-5 py-3 border-b border-border-dim flex items-center gap-2">
              <MonitorPlay className="w-4 h-4 text-text-muted" />
              <span className="text-sm font-medium text-text-secondary">
                Video Stream
              </span>
              {isProcessing && (
                <span className="ml-auto flex items-center gap-1.5 text-xs text-accent-green">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-green pulse-dot" />
                  Live
                </span>
              )}
            </div>
            <div className="relative bg-bg-base aspect-video flex items-center justify-center">
              {isProcessing ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={api.streamUrl(id)}
                  alt="Match stream"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-text-muted">
                  <MonitorPlay className="w-12 h-12 opacity-30" />
                  <p className="text-sm">
                    {match.status === "pending"
                      ? "Start processing to view stream"
                      : "Stream ended"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Stats Sidebar */}
        <div className="space-y-4">
          <StatsCard
            label="Players Tracked"
            value={analytics?.player_count ?? 0}
            icon={Users}
            color="blue"
          />
          <StatsCard
            label="FPS"
            value={analytics?.fps?.toFixed(1) ?? "0.0"}
            icon={Gauge}
            color="green"
          />
          <StatsCard
            label="Ball Position"
            value={
              analytics?.ball_pos
                ? `${analytics.ball_pos[0].toFixed(0)}, ${analytics.ball_pos[1].toFixed(0)}`
                : "N/A"
            }
            icon={Crosshair}
            color="amber"
          />

          <PossessionBar teamA={teamA} teamB={teamB} />
        </div>
      </div>

      {/* Charts & Players */}
      {isProcessing && analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LiveChart
            teamA={teamA}
            teamB={teamB}
            frameIdx={analytics.frame_idx}
          />
          <PlayerTable players={players ?? []} />
        </div>
      )}

      {/* Player table when not processing but has data */}
      {!isProcessing && players && players.length > 0 && (
        <PlayerTable players={players} />
      )}
    </div>
  );
}
