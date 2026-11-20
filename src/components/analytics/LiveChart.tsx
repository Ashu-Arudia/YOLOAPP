"use client";

import { useRef, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface DataPoint {
  frame: number;
  teamA: number;
  teamB: number;
}

interface LiveChartProps {
  teamA: number;
  teamB: number;
  frameIdx: number;
}

const MAX_POINTS = 60;

export default function LiveChart({ teamA, teamB, frameIdx }: LiveChartProps) {
  const dataRef = useRef<DataPoint[]>([]);

  // Push new data point, keeping buffer bounded
  const pushData = useCallback(() => {
    const arr = dataRef.current;
    const last = arr.length > 0 ? arr[arr.length - 1] : null;
    if (!last || last.frame !== frameIdx) {
      arr.push({ frame: frameIdx, teamA, teamB });
      if (arr.length > MAX_POINTS) arr.shift();
    }
  }, [teamA, teamB, frameIdx]);

  pushData();

  return (
    <div className="glass rounded-xl p-5 fade-up">
      <h3 className="text-sm font-medium text-text-secondary mb-4">
        Possession Over Time
      </h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dataRef.current}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(30,45,74,0.5)"
            />
            <XAxis
              dataKey="frame"
              tick={{ fontSize: 10, fill: "#3d5070" }}
              stroke="#1e2d4a"
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: "#3d5070" }}
              stroke="#1e2d4a"
            />
            <Tooltip
              contentStyle={{
                background: "#141c2e",
                border: "1px solid #1e2d4a",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: "#7c91b5" }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, color: "#7c91b5" }}
            />
            <Line
              type="monotone"
              dataKey="teamA"
              name="Team A"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="teamB"
              name="Team B"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
