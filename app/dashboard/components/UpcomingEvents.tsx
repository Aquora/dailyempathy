"use client";

import type { CalendarEvent } from "./types";

interface UpcomingEventsProps {
  events: CalendarEvent[];
  selectedDate: Date | null;
}

const statusBadge: Record<string, { bg: string; text: string; label: string }> = {
  planned: { bg: "bg-gold/15", text: "text-gold", label: "Planned" },
  started: { bg: "bg-blue-400/15", text: "text-blue-400", label: "Started" },
  finished: { bg: "bg-green-400/15", text: "text-green-400", label: "Finished" },
};

const categoryColors: Record<string, string> = {
  Work: "bg-purple-400/20 text-purple-300",
  Personal: "bg-blue-400/20 text-blue-300",
  School: "bg-orange-400/20 text-orange-300",
  Health: "bg-green-400/20 text-green-300",
  Social: "bg-pink-400/20 text-pink-300",
  Other: "bg-white/10 text-white/50",
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function UpcomingEvents({
  events,
  selectedDate,
}: UpcomingEventsProps) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  let filteredEvents: CalendarEvent[];
  let heading: string;

  if (selectedDate) {
    // Show events for the selected day
    filteredEvents = events.filter((evt) => {
      const start = new Date(evt.startDate);
      const end = new Date(evt.endDate);
      const sel = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );
      return (
        sel >= new Date(start.getFullYear(), start.getMonth(), start.getDate()) &&
        sel <= new Date(end.getFullYear(), end.getMonth(), end.getDate())
      );
    });
    heading = selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  } else {
    // Show upcoming events from today
    filteredEvents = events
      .filter((evt) => new Date(evt.endDate) >= now)
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
    heading = "Upcoming";
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/2 backdrop-blur-sm">
      <div className="border-b border-white/5 px-5 py-4">
        <h2 className="font-mono text-sm tracking-widest text-white/70">
          {heading.toUpperCase()}
        </h2>
      </div>

      <div className="max-h-[calc(100vh-12rem)] overflow-y-auto p-4">
        {filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="font-mono text-xs text-white/30">
              {selectedDate ? "No events on this day" : "No upcoming events"}
            </p>
            <p className="mt-1 text-xs text-white/20">
              Click the + icon to add one
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEvents.map((event) => {
              const badge = statusBadge[event.status] || statusBadge.planned;
              const catColor =
                categoryColors[event.category] || categoryColors.Other;

              return (
                <div
                  key={event.id}
                  className="rounded-lg border border-white/5 bg-white/2 p-4 transition-colors hover:border-white/10"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <h4 className="text-sm font-medium text-white/90">
                      {event.title}
                    </h4>
                    <span
                      className={`rounded-full px-2 py-0.5 font-mono text-[10px] ${badge.bg} ${badge.text}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 font-mono text-[10px] ${catColor}`}
                    >
                      {event.category}
                    </span>
                    <span className="font-mono text-[10px] text-white/30">
                      {formatDate(event.startDate)} — {formatDate(event.endDate)}
                    </span>
                  </div>
                  {event.source === "google" && (
                    <span className="mt-1 inline-block font-mono text-[10px] text-white/20">
                      via Google Calendar
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
