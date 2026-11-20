"use client";

import type { PlayerTrack } from "@/lib/api";
import clsx from "clsx";

interface PlayerTableProps {
  players: PlayerTrack[];
}

export default function PlayerTable({ players }: PlayerTableProps) {
  return (
    <div className="glass rounded-xl overflow-hidden fade-up">
      <div className="px-5 py-4 border-b border-border-dim">
        <h3 className="text-sm font-medium text-text-secondary">
          Tracked Players ({players.length})
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-dim text-text-muted text-xs uppercase tracking-wider">
              <th className="px-5 py-3 text-left font-medium">ID</th>
              <th className="px-5 py-3 text-left font-medium">Team</th>
              <th className="px-5 py-3 text-right font-medium">Distance (px)</th>
              <th className="px-5 py-3 text-right font-medium">Speed (px/s)</th>
              <th className="px-5 py-3 text-right font-medium">Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {players.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-8 text-center text-text-muted"
                >
                  No players tracked yet
                </td>
              </tr>
            )}
            {players.map((p) => (
              <tr
                key={p.track_id}
                className="border-b border-border-dim/50 hover:bg-bg-elevated/50 transition-colors"
              >
                <td className="px-5 py-3 text-text-primary font-mono">
                  #{p.track_id}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={clsx(
                      "inline-flex items-center gap-1.5 text-xs font-medium",
                      p.team === "team_a"
                        ? "text-team-a"
                        : p.team === "team_b"
                        ? "text-team-b"
                        : "text-text-secondary"
                    )}
                  >
                    <span
                      className={clsx(
                        "w-2 h-2 rounded-full",
                        p.team === "team_a"
                          ? "bg-team-a"
                          : p.team === "team_b"
                          ? "bg-team-b"
                          : "bg-text-muted"
                      )}
                    />
                    {p.team === "team_a"
                      ? "Team A"
                      : p.team === "team_b"
                      ? "Team B"
                      : p.team}
                  </span>
                </td>
                <td className="px-5 py-3 text-right text-text-secondary font-mono">
                  {p.distance_px.toFixed(0)}
                </td>
                <td className="px-5 py-3 text-right text-text-secondary font-mono">
                  {p.speed_px.toFixed(1)}
                </td>
                <td className="px-5 py-3 text-right text-text-muted font-mono text-xs">
                  #{p.last_seen}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
