export interface CalendarEvent {
  id: string;
  title: string;
  category: string;
  status: string;
  startDate: string;
  endDate: string;
  source: string;
  googleId: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
