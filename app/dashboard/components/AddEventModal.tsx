"use client";

import { useState } from "react";
import { HiXMark } from "react-icons/hi2";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventAdded: () => void;
  defaultDate?: Date | null;
}

const CATEGORIES = [
  "Work",
  "Personal",
  "School",
  "Health",
  "Social",
  "Other",
];

export default function AddEventModal({
  isOpen,
  onClose,
  onEventAdded,
  defaultDate,
}: AddEventModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Personal");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("planned");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim() || !endDate) {
      setError("Title and end date are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          category,
          endDate,
          status,
          startDate: startDate,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create event");
        return;
      }

      // Reset form
      setTitle("");
      setCategory("Personal");
      setStartDate("");
      setEndDate("");
      setStatus("planned");
      onEventAdded();
      onClose();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#111] p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-mono text-sm tracking-widest text-gold">
            ADD EVENT
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

          {/* Start Date (readonly, informational) */}
          <div>
            <label className="mb-1.5 block font-mono text-xs tracking-widest text-white/40">
              START DATE
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-gold/50"
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
              min={startDate}
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
            {loading ? "CREATING..." : "[CREATE EVENT]"}
          </button>
        </form>
      </div>
    </div>
  );
}
