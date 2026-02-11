"use client";

import { useCallback, useEffect, useState } from "react";
import CalendarWidget from "./CalendarWidget";
import AddEventModal from "./AddEventModal";
import UpcomingEvents from "./UpcomingEvents";
import TodoList from "./TodoList";
import SpotifyLofiWidget from "./SpotifyLofiWidget";
import type { CalendarEvent } from "./types";
import DayEventsOverlay from "./DayEventsOverlay";

export default function DashboardClient() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDayOverlay, setShowDayOverlay] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch("/api/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch {
      // Silently fail
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  function handleDaySelect(date: Date) {
    setSelectedDate(date);
    setShowDayOverlay(true);
  }

  return (
    <>
      <div className="flex gap-6 p-6">
        {/* Left column -- Calendar + Todo */}
        <div className="w-[60%] shrink-0">
          <CalendarWidget
            events={events}
            onDaySelect={handleDaySelect}
            onAddEvent={() => setShowAddModal(true)}
            selectedDate={selectedDate}
            googleConnected={false}
          />

          {/* Todo list under calendar */}
          <TodoList
            events={events}
            onAddTask={() => {
              // default to today when adding from todo list
              setSelectedDate(new Date());
              setShowAddModal(true);
            }}
            onEventsChanged={fetchEvents}
          />
        </div>

        {/* Right column -- Upcoming Events + Lofi */}
        <div className="flex-1 flex flex-col">
          <UpcomingEvents events={events} selectedDate={selectedDate} />
          <SpotifyLofiWidget />
        </div>
      </div>

      {/* Add Task Modal */}
      <AddEventModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onEventAdded={fetchEvents}
        defaultDate={selectedDate}
      />

      {/* Day events overlay when clicking a date */}
      <DayEventsOverlay
        isOpen={showDayOverlay}
        date={selectedDate}
        events={events}
        onClose={() => setShowDayOverlay(false)}
        onEventsChanged={fetchEvents}
        onAddTask={(date) => {
          setSelectedDate(date);
          setShowDayOverlay(false);
          setShowAddModal(true);
        }}
      />
    </>
  );
}
