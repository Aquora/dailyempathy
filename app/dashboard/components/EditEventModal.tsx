"use client";

import { useEffect, useState } from "react";
import { HiXMark } from "react-icons/hi2";
import type { CalendarEvent } from "./types";

interface EditEventModalProps {
  isOpen: boolean;
  event: CalendarEvent | null;
  onClose: () => void;
  onUpdated: () => void;
}

const CATEGORIES = [
  "Work",
  "Personal",
  "School",
  "Health",
  "Social",
  "Other",
];

export default function EditEventModal({
  isOpen,
  event,
  onClose,
  onUpdated,
}: EditEventModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Personal");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("planned");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (event && isOpen) {
      setTitle(event.title);
      setCategory(event.category || "Personal");
      setStatus(event.status || "planned");
      const end = new Date(event.endDate);
      setEndDate(end.toISOString().split("T")[0]);
      setError("");
    }
  }, [event, isOpen]);

  if (!isOpen || !event) return null;

  const start = new Date(event.startDate);
  const startDateStr = start.toISOString().split("T")[0];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!event) {
      setError("Event not found");
      return;
    }

    if (!title.trim() || !endDate) {
      setError("Title and end date are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          category,
          status,
          endDate,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update event");
        return;
      }

      onUpdated();
      onClose();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#111] p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-mono text-sm tracking-widest text-gold">
            EDIT EVENT
          </h3>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-white/40 transition-colors hover:bg-white/5 hover:text-white"
          >
            <HiXMark className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-center font-mono text-xs text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="mb-1.5 block font-mono text-xs tracking-widest text-white/40">
              TITLE
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-gold/50"
              placeholder="Event title"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-1.5 block font-mono text-xs tracking-widest text-white/40">
              CATEGORY
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-gold/50"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-[#111]">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date (read-only) */}
          <div>
            <label className="mb-1.5 block font-mono text-xs tracking-widest text-white/40">
              START DATE
            </label>
            <input
              type="date"
              value={startDateStr}
              readOnly
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/50 outline-none"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="mb-1.5 block font-mono text-xs tracking-widest text-white/40">
              END DATE
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              min={startDateStr}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-gold/50"
            />
          </div>

          {/* Status */}
          <div>
            <label className="mb-1.5 block font-mono text-xs tracking-widest text-white/40">
              STATUS
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-gold/50"
            >
              <option value="planned" className="bg-[#111]">
                Planned
              </option>
              <option value="started" className="bg-[#111]">
                Started
              </option>
              <option value="finished" className="bg-[#111]">
                Finished
              </option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full border border-gold py-2.5 font-mono text-sm tracking-widest text-gold transition-all hover:bg-gold hover:text-black disabled:opacity-50"
            style={{
              clipPath:
                "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
            }}
          >
            {loading ? "SAVING..." : "[SAVE CHANGES]"}
          </button>
        </form>
      </div>
    </div>
  );
}

