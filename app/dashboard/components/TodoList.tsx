"use client";

import { useState } from "react";
import { HiPlus, HiXMark } from "react-icons/hi2";
import type { CalendarEvent } from "./types";
import EditEventModal from "./EditEventModal";

interface TodoListProps {
  events: CalendarEvent[];
  onAddTask: () => void;
  onEventsChanged: () => void;
}

const statusLabel: Record<string, string> = {
  planned: "Planned",
  started: "Started",
  finished: "Finished",
};

export default function TodoList({
  events,
  onAddTask,
  onEventsChanged,
}: TodoListProps) {
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const sorted = [...events].sort(
    (a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
  );

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (res.ok) onEventsChanged();
    } catch {
      // ignore
    }
  }

  return (
    <>
      <div className="mt-4 h-[195px] rounded-xl border border-white/10 bg-white/2 backdrop-blur-sm flex flex-col">
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
          <h2 className="font-mono text-sm tracking-widest text-white/70">
            TODO LIST
          </h2>
          <button
            onClick={onAddTask}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-gold transition-colors hover:border-gold/30 hover:bg-gold/10"
          >
            <HiPlus className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto px-5 py-3">
          {sorted.length === 0 ? (
            <p className="py-6 text-center font-mono text-xs text-white/30">
              No tasks yet. Use the + button to create one.
            </p>
          ) : (
            sorted.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-white/2 px-3 py-2 text-sm"
              >
                <button
                  type="button"
                  onClick={() => {
                    setEditingEvent(task);
                    setEditOpen(true);
                  }}
                  className="flex-1 text-left"
                >
                  <p className="text-white/90">{task.title}</p>
                  <p className="mt-0.5 text-[11px] text-white/40">
                    {task.category} · {statusLabel[task.status] || task.status}
                  </p>
                </button>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-[10px] text-white/30">
                    {new Date(task.endDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="flex h-6 w-6 items-center justify-center rounded-md border border-white/10 text-white/40 transition-colors hover:border-red-500/40 hover:text-red-400"
                    aria-label="Delete task"
                  >
                    <HiXMark className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))
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

