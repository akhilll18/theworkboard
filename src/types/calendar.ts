// src/types/calendar.ts
export type CalendarView = 'month' | 'week' | 'day';

export interface EventMember {
  id: string;
  name: string;
  avatar: string;
  initials: string;
  position?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  color: string;
  members?: EventMember[];
}

export interface EventDraft {
  id: string | null;
  title: string;
  date: Date;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  allDay: boolean;
  color: string;
  members: EventMember[];
}

export const EVENT_COLORS = [
  { value: '#3B82F6', label: 'Blue' },
  { value: '#8B5CF6', label: 'Violet' },
  { value: '#10B981', label: 'Emerald' },
  { value: '#F59E0B', label: 'Amber' },
  { value: '#F43F5E', label: 'Rose' },
];

export const CATEGORY = {
  design: { label: 'Design', color: '#8B5CF6', icon: '🎨' },
  engineering: { label: 'Engineering', color: '#3B82F6', icon: '💻' },
  marketing: { label: 'Marketing', color: '#F59E0B', icon: '📢' },
  product: { label: 'Product', color: '#10B981', icon: '🧭' },
} as const;

export type Category = keyof typeof CATEGORY;

export const START_HOURS = Array.from({ length: 15 }, (_, i) => i + 7); // 7 AM - 9 PM
export const MINUTES = [0, 15, 30, 45];