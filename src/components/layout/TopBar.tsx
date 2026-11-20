"use client";

import { usePathname, useRouter } from "next/navigation";
import { Plus, Wifi, WifiOff } from "lucide-react";
import { useState } from "react";
import UploadModal from "@/components/match/UploadModal";

function useBreadcrumb() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return ["Dashboard"];
  return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1));
}

export default function TopBar() {
  const breadcrumb = useBreadcrumb();
  const router = useRouter();
  const [showUpload, setShowUpload] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between px-6 py-3 bg-bg-surface border-b border-border min-h-[56px]">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          {breadcrumb.map((part, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-text-muted">/</span>}
              <span
                className={
                  i === breadcrumb.length - 1
                    ? "text-text-primary font-medium"
                    : "text-text-secondary"
                }
              >
                {part}
              </span>
            </span>
          ))}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Connection indicator */}
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <span className="relative flex h-2.5 w-2.5">
              <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-green" />
            </span>
            <span>Live</span>
          </div>

          {/* New Match button */}
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-blue text-white text-sm font-medium hover:bg-accent-blue/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Match
          </button>
        </div>
      </header>

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onUploaded={(matchId) => {
            setShowUpload(false);
            router.push(`/matches/${matchId}`);
          }}
        />
      )}
    </>
  );
}
