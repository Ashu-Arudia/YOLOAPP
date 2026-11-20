"use client";

interface PossessionBarProps {
  teamA: number;
  teamB: number;
}

export default function PossessionBar({ teamA, teamB }: PossessionBarProps) {
  return (
    <div className="glass rounded-xl p-5 fade-up">
      <h3 className="text-sm font-medium text-text-secondary mb-4">
        Ball Possession
      </h3>

      <div className="flex items-center justify-between text-sm mb-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-team-a" />
          <span className="text-text-primary font-semibold">
            {teamA.toFixed(0)}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-text-primary font-semibold">
            {teamB.toFixed(0)}%
          </span>
          <span className="w-3 h-3 rounded-sm bg-team-b" />
        </div>
      </div>

      <div className="flex h-3 rounded-full overflow-hidden bg-bg-base">
        <div
          className="bg-team-a transition-all duration-700 ease-out rounded-l-full"
          style={{ width: `${teamA}%` }}
        />
        <div
          className="bg-team-b transition-all duration-700 ease-out rounded-r-full"
          style={{ width: `${teamB}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-text-muted mt-2">
        <span>Team A</span>
        <span>Team B</span>
      </div>
    </div>
  );
}
