"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Film, CheckCircle } from "lucide-react";
import { api } from "@/lib/api";
import clsx from "clsx";

interface UploadModalProps {
  onClose: () => void;
  onUploaded: (matchId: string) => void;
}

export default function UploadModal({ onClose, onUploaded }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [matchName, setMatchName] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      setFile(dropped);
      if (!matchName) setMatchName(dropped.name.replace(/\.[^.]+$/, ""));
    }
  }, [matchName]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      if (!matchName) setMatchName(selected.name.replace(/\.[^.]+$/, ""));
    }
  };

  const handleUpload = async () => {
    if (!file || !matchName.trim()) return;
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const res = await api.uploadVideo(file, matchName.trim(), (pct) =>
        setProgress(pct)
      );
      onUploaded(res.match_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setUploading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="glass rounded-2xl w-full max-w-lg p-6 fade-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-text-primary">
            Upload Match Video
          </h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Match Name */}
        <label className="block mb-4">
          <span className="text-sm text-text-secondary mb-1.5 block">
            Match Name
          </span>
          <input
            type="text"
            value={matchName}
            onChange={(e) => setMatchName(e.target.value)}
            placeholder="e.g. Team A vs Team B"
            className="w-full px-4 py-2.5 rounded-lg bg-bg-base border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-blue transition-colors"
          />
        </label>

        {/* Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={clsx(
            "flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-colors",
            dragOver
              ? "border-accent-blue bg-accent-blue/10"
              : file
              ? "border-accent-green/50 bg-accent-green/5"
              : "border-border hover:border-text-muted"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          {file ? (
            <>
              <CheckCircle className="w-8 h-8 text-accent-green" />
              <div className="text-center">
                <p className="text-sm font-medium text-text-primary">
                  {file.name}
                </p>
                <p className="text-xs text-text-muted mt-0.5">
                  {(file.size / (1024 * 1024)).toFixed(1)} MB
                </p>
              </div>
            </>
          ) : (
            <>
              <Film className="w-8 h-8 text-text-muted" />
              <div className="text-center">
                <p className="text-sm text-text-secondary">
                  Drop a video file here or{" "}
                  <span className="text-accent-blue">browse</span>
                </p>
                <p className="text-xs text-text-muted mt-1">
                  MP4, AVI, MOV up to 2GB
                </p>
              </div>
            </>
          )}
        </div>

        {/* Progress */}
        {uploading && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-text-secondary mb-1.5">
              <span>Uploading…</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-bg-base overflow-hidden">
              <div
                className="h-full rounded-full bg-accent-blue transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="mt-3 text-sm text-team-a">{error}</p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-text-secondary hover:bg-bg-elevated transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || !matchName.trim() || uploading}
            className={clsx(
              "flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors",
              !file || !matchName.trim() || uploading
                ? "bg-bg-elevated text-text-muted cursor-not-allowed"
                : "bg-accent-blue text-white hover:bg-accent-blue/90"
            )}
          >
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading…" : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
