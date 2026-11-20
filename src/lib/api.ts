// ── Types ──────────────────────────────────────────────────────────
export type MatchStatus = "pending" | "processing" | "completed" | "stopped";

export interface Match {
  id: string;
  name: string;
  video_path: string | null;
  source_type: "file" | "webcam";
  status: MatchStatus;
  created_at: string;
  started_at: string | null;
  ended_at: string | null;
}

export interface AnalyticsSnapshot {
  frame_idx: number;
  fps: number;
  match_id: string;
  player_count: number;
  team_a_count: number;
  team_b_count: number;
  possession?: {
    team_a_pct: number;
    team_b_pct: number;
    holder_id: number | null;
    holder_team: string | null;
  };
  ball_pos: [number, number] | null;
  calibrated: boolean;
}

export interface PlayerTrack {
  track_id: number;
  team: string;
  centroid: [number, number];
  distance_px: number;
  speed_px: number;
  last_seen: number;
}

export interface UploadResponse {
  match_id: string;
  match_name: string;
  video_path: string;
  status: MatchStatus;
}

// ── Base ───────────────────────────────────────────────────────────
const BASE = "/api/v1";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

// ── Matches ────────────────────────────────────────────────────────
export const api = {
  health: () => request<{ status: string; version: string }>("/health"),

  listMatches: () => request<Match[]>("/matches"),

  getMatch: (id: string) => request<Match>(`/matches/${id}`),

  createMatch: (name: string, source_type: string) =>
    request<Match>("/matches", {
      method: "POST",
      body: JSON.stringify({ name, source_type }),
    }),

  startMatch: (id: string) =>
    request<{ match_id: string; status: string }>(`/matches/${id}/start`, {
      method: "POST",
    }),

  stopMatch: (id: string) =>
    request<{ match_id: string; status: string }>(`/matches/${id}/stop`, {
      method: "POST",
    }),

  getAnalytics: (id: string) =>
    request<AnalyticsSnapshot>(`/matches/${id}/analytics`),

  getPlayers: (id: string) => request<PlayerTrack[]>(`/matches/${id}/players`),

  // ── Video Upload ─────────────────────────────────────────────────
  uploadVideo: (file: File, matchName: string, onProgress?: (pct: number) => void) => {
    return new Promise<UploadResponse>((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("match_name", matchName);

      const xhr = new XMLHttpRequest();

      if (onProgress) {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
        });
      }

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.response) as UploadResponse);
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => reject(new Error("Network error during upload")));
      xhr.open("POST", "/api/v1/videos/upload");
      xhr.send(formData);
    });
  },

  /** MJPEG stream URL for a match */
  streamUrl: (id: string) => `/api/v1/matches/${id}/stream`,
};
