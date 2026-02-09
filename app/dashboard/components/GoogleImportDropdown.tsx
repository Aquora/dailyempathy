"use client";

import { useEffect, useRef, useState } from "react";
import { HiArrowPath, HiCloud, HiXMark } from "react-icons/hi2";

interface GoogleImportDropdownProps {
  googleConnected: boolean;
  onSyncComplete: () => void;
}

export default function GoogleImportDropdown({
  googleConnected,
  onSyncComplete,
}: GoogleImportDropdownProps) {
  const [open, setOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSync() {
    setSyncing(true);
    try {
      const res = await fetch("/api/calendar/google/import", { method: "POST" });
      if (res.ok) {
        onSyncComplete();
      }
    } catch {
      // Silently fail
    } finally {
      setSyncing(false);
      setOpen(false);
    }
  }

  async function handleDisconnect() {
    try {
      await fetch("/api/calendar/google/disconnect", { method: "POST" });
      window.location.reload();
    } catch {
      // Silently fail
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 font-mono text-[10px] tracking-widest text-white/40 transition-colors hover:border-white/20 hover:text-white/60"
      >
        <HiCloud className="h-3 w-3" />
        GOOGLE
      </button>

      {open && (
        <div className="absolute bottom-full right-0 mb-2 w-52 rounded-xl border border-white/10 bg-[#111] p-3 shadow-2xl">
          {!googleConnected ? (
            <a
              href="/api/calendar/google/auth"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left font-mono text-xs tracking-widest text-white/50 transition-colors hover:bg-white/5 hover:text-gold"
            >
              <HiCloud className="h-3.5 w-3.5" />
              CONNECT
            </a>
          ) : (
            <>
              <button
                onClick={handleSync}
                disabled={syncing}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left font-mono text-xs tracking-widest text-white/50 transition-colors hover:bg-white/5 hover:text-gold disabled:opacity-50"
              >
                <HiArrowPath
                  className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`}
                />
                {syncing ? "SYNCING..." : "SYNC NOW"}
              </button>
              <button
                onClick={handleDisconnect}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left font-mono text-xs tracking-widest text-white/50 transition-colors hover:bg-white/5 hover:text-red-400"
              >
                <HiXMark className="h-3.5 w-3.5" />
                DISCONNECT
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
