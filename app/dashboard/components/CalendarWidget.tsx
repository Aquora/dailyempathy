"use client";

import { useState, useCallback } from "react";
import { HiChevronLeft, HiChevronRight, HiPlus } from "react-icons/hi2";
import type { CalendarEvent } from "./types";

interface CalendarWidgetProps {
  events: CalendarEvent[];
  onDaySelect: (date: Date) => void;
  onAddEvent: () => void;
  selectedDate: Date | null;
  googleConnected: boolean;
  children?: React.ReactNode; // For the Google import dropdown
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function isSameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export default function CalendarWidget({
  events,
  onDaySelect,
  onAddEvent,
  selectedDate,
  children,
}: CalendarWidgetProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const prevMonth = useCallback(() => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }, [currentMonth]);

  const nextMonth = useCallback(() => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }, [currentMonth]);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  // Build calendar grid
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  // Fill remainder of last week
  while (cells.length % 7 !== 0) cells.push(null);

  function getEventsForDay(day: number): CalendarEvent[] {
    const date = new Date(currentYear, currentMonth, day);
    return events.filter((event) => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      return date >= new Date(start.getFullYear(), start.getMonth(), start.getDate()) &&
             date <= new Date(end.getFullYear(), end.getMonth(), end.getDate());
    });
  }

  const statusColor: Record<string, string> = {
    planned: "bg-gold",
    started: "bg-blue-400",
    finished: "bg-green-400",
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/2 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
        <h2 className="font-mono text-sm tracking-widest text-white/70">
          CALENDAR
        </h2>
        <button
          onClick={onAddEvent}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-gold transition-colors hover:border-gold/30 hover:bg-gold/10"
        >
          <HiPlus className="h-4 w-4" />
        </button>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between px-5 py-3">
        <button
          onClick={prevMonth}
          className="flex h-7 w-7 items-center justify-center rounded-md text-white/40 transition-colors hover:bg-white/5 hover:text-white"
        >
          <HiChevronLeft className="h-4 w-4" />
        </button>
        <span className="font-mono text-sm text-white/80">
          {MONTHS[currentMonth]} {currentYear}
        </span>
        <button
          onClick={nextMonth}
          className="flex h-7 w-7 items-center justify-center rounded-md text-white/40 transition-colors hover:bg-white/5 hover:text-white"
        >
          <HiChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 px-3">
        {DAYS.map((day) => (
          <div
            key={day}
            className="py-2 text-center font-mono text-[10px] tracking-widest text-white/30"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 px-3 pb-3">
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} className="h-12" />;
          }

          const cellDate = new Date(currentYear, currentMonth, day);
          const isToday = isSameDay(cellDate, today);
          const isSelected = selectedDate && isSameDay(cellDate, selectedDate);
          const dayEvents = getEventsForDay(day);

          return (
            <button
              key={`day-${day}`}
              onClick={() => onDaySelect(cellDate)}
              className={`relative flex h-12 flex-col items-center justify-start rounded-lg pt-1 text-sm transition-colors ${
                isSelected
                  ? "bg-gold/15 text-gold"
                  : isToday
                    ? "ring-1 ring-gold/40 text-gold"
                    : "text-white/60 hover:bg-white/5"
              }`}
            >
              <span className="text-xs">{day}</span>
              {dayEvents.length > 0 && (
                <div className="mt-0.5 flex gap-0.5">
                  {dayEvents.slice(0, 3).map((evt, idx) => (
                    <span
                      key={idx}
                      className={`h-1 w-1 rounded-full ${statusColor[evt.status] || "bg-white/30"}`}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer with Google import dropdown slot */}
      <div className="flex items-center justify-end border-t border-white/5 px-5 py-3">
        {children}
      </div>
    </div>
  );
}
