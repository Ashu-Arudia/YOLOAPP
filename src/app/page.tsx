"use client";

import { useRouter } from "next/navigation";
import {
  Trophy,
  Play,
  CheckCircle2,
  Clock,
  Upload,
  Video,
} from "lucide-react";
import { useMatches } from "@/hooks/useMatches";
import StatsCard from "@/components/analytics/StatsCard";
import StatusBadge from "@/components/common/StatusBadge";
import { useState } from "react";
import UploadModal from "@/components/match/UploadModal";
import { api } from "@/lib/api";

export default function DashboardPage() {
  const { matches, isLoading } = useMatches();
  const router = useRouter();
  const [showUpload, setShowUpload] = useState(false);

  const activeCount = matches.filter((m) => m.status === "processing").length;
  const completedCount = matches.filter((m) => m.status === "completed").length;

  // Average duration for completed matches (in minutes)
  const avgDuration = (() => {
    const finished = matches.filter(
      (m) => m.status === "completed" && m.started_at && m.ended_at
    );
    if (finished.length === 0) return "—";
    const totalMs = finished.reduce((acc, m) => {
      return (
        acc +
        (new Date(m.ended_at!).getTime() - new Date(m.started_at!).getTime())
      );
    }, 0);
    const avgMin = totalMs / finished.length / 60000;
    return `${avgMin.toFixed(1)}m`;
  })();

  const recentMatches = [...matches]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  const handleStartWebcam = async () => {
    try {
      const match = await api.createMatch("Live Webcam", "webcam");
      router.push(`/matches/${match.id}`);
    } catch {
      // silently fail
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-sm text-text-secondary mt-1">
          Real-time football intelligence overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Total Matches"
          value={matches.length}
          icon={Trophy}
          color="blue"
        />
        <StatsCard
          label="Active Now"
          value={activeCount}
          icon={Play}
          color="green"
        />
        <StatsCard
          label="Completed"
          value={completedCount}
          icon={CheckCircle2}
          color="cyan"
        />
        <StatsCard
          label="Average Duration"
          value={avgDuration}
          icon={Clock}
          color="amber"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => setShowUpload(true)}
          className="glass rounded-xl p-5 flex items-center gap-4 hover:bg-bg-elevated/80 transition-colors text-left group"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent-blue/15 text-accent-blue group-hover:bg-accent-blue/25 transition-colors">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">
              Upload Video
            </p>
            <p className="text-xs text-text-secondary mt-0.5">
              Analyze a recorded match
            </p>
          </div>
        </button>
        <button
          onClick={handleStartWebcam}
          className="glass rounded-xl p-5 flex items-center gap-4 hover:bg-bg-elevated/80 transition-colors text-left group"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent-green/15 text-accent-green group-hover:bg-accent-green/25 transition-colors">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">
              Start Webcam
            </p>
            <p className="text-xs text-text-secondary mt-0.5">
              Live match analysis
            </p>
          </div>
        </button>
      </div>

      {/* Recent Matches */}
      <div className="glass rounded-xl fade-up">
        <div className="px-5 py-4 border-b border-border-dim">
          <h2 className="text-sm font-semibold text-text-primary">
            Recent Matches
          </h2>
        </div>
        {isLoading ? (
          <div className="px-5 py-8 text-center text-text-muted text-sm">
            Loading…
          </div>
        ) : recentMatches.length === 0 ? (
          <div className="px-5 py-8 text-center text-text-muted text-sm">
            No matches yet. Upload a video or start a webcam session.
          </div>
        ) : (
          <div className="divide-y divide-border-dim">
            {recentMatches.map((match) => (
              <button
                key={match.id}
                onClick={() => router.push(`/matches/${match.id}`)}
                className="flex items-center justify-between w-full px-5 py-3.5 hover:bg-bg-elevated/50 transition-colors text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-bg-elevated text-text-muted">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {match.name}
                    </p>
                    <p className="text-xs text-text-muted">
                      {new Date(match.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <StatusBadge status={match.status} />
              </button>
            ))}
          </div>
        )}
      </div>

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onUploaded={(matchId) => {
            setShowUpload(false);
            router.push(`/matches/${matchId}`);
          }}
        />
      )}
    </div>
  );
}
