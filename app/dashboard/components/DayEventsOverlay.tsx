"use client";

import { useState } from "react";
import { HiXMark } from "react-icons/hi2";
import type { CalendarEvent } from "./types";
import EditEventModal from "./EditEventModal";

interface DayEventsOverlayProps {
  isOpen: boolean;
  date: Date | null;
  events: CalendarEvent[];
  onClose: () => void;
  onEventsChanged: () => void;
}

function isDateWithinEvent(date: Date, event: CalendarEvent) {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayEnd = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59
  );

  return (
    dayEnd >= new Date(start.getFullYear(), start.getMonth(), start.getDate()) &&
    dayStart <= new Date(end.getFullYear(), end.getMonth(), end.getDate())
  );
}

const statusLabel: Record<string, string> = {
  planned: "Planned",
  started: "Started",
  finished: "Finished",
};

export default function DayEventsOverlay({
  isOpen,
  date,
  events,
  onClose,
  onEventsChanged,
}: DayEventsOverlayProps) {
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  if (!isOpen || !date) return null;

  const dayEvents = events.filter((evt) => isDateWithinEvent(date, evt));

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (res.ok) {
        onEventsChanged();
      }
    } catch {
      // ignore
    }
  }

  function handleRowClick(event: CalendarEvent) {
    setEditingEvent(event);
    setEditOpen(true);
  }

  const heading = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <div className="fixed inset-0 z-90 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="w-full max-w-lg rounded-xl border border-white/10 bg-[#111] p-6 shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="font-mono text-xs tracking-widest text-gold">
                DAY OVERVIEW
              </p>
              <p className="mt-1 font-serif text-lg text-white/90">{heading}</p>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-md text-white/40 transition-colors hover:bg-white/5 hover:text-white"
            >
              <HiXMark className="h-4 w-4" />
            </button>
          </div>

          {dayEvents.length === 0 ? (
            <div className="py-10 text-center">
              <p className="font-mono text-xs text-white/30">
                No tasks scheduled for this day.
              </p>
              <p className="mt-1 text-xs text-white/20">
                Use the + button on the calendar to add one.
              </p>
            </div>
          ) : (
            <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start justify-between rounded-lg border border-white/5 bg-white/2 p-3 transition-colors hover:border-white/10 hover:bg-white/5"
                >
                  <button
                    type="button"
                    onClick={() => handleRowClick(event)}
                    className="flex-1 text-left"
                  >
                    <p className="text-sm font-medium text-white/90">
                      {event.title}
                    </p>
                    <p className="mt-0.5 text-xs text-white/40">
                      {event.category} · {statusLabel[event.status] || event.status}
                    </p>
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="ml-3 flex h-7 w-7 items-center justify-center rounded-md border border-white/10 text-white/40 transition-colors hover:border-red-500/40 hover:text-red-400"
                    aria-label="Delete event"
                  >
                    <HiXMark className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <EditEventModal
        isOpen={editOpen}
        event={editingEvent}
        onClose={() => setEditOpen(false)}
        onUpdated={onEventsChanged}
      />
    </>
  );
}

