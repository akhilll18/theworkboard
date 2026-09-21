// src/pages/CalendarPage.tsx
import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { CalendarToday as CalendarIcon } from '@mui/icons-material';
import { EventCalendar } from '../components/Calendar/EventCalendar';
import { CalendarEvent, CATEGORY } from '../types/calendar';
import {
  startOfWeek,
  startOfDay,
  addDays,
  setHours,
  addMinutes,
} from 'date-fns';

function buildInitialEvents(): CalendarEvent[] {
  const week = startOfWeek(startOfDay(new Date()), { weekStartsOn: 1 });
  const at = (dayOffset: number, hour: number) =>
    setHours(addDays(week, dayOffset), hour);

  return [
    {
      id: 'kickoff',
      title: 'Project kickoff',
      start: at(1, 10),
      end: at(1, 11),
      allDay: false,
      color: CATEGORY.engineering.color,
    },
    {
      id: '1on1',
      title: '1:1 with Mia',
      start: at(2, 14),
      end: at(2, 15),
      allDay: false,
      color: CATEGORY.design.color,
    },
    {
      id: 'review',
      title: 'Design review',
      start: at(4, 11),
      end: at(4, 12),
      allDay: false,
      color: CATEGORY.design.color,
    },
    {
      id: 'standup',
      title: 'Team standup',
      start: at(3, 9),
      end: addMinutes(at(3, 9), 30),
      allDay: false,
      color: CATEGORY.marketing.color,
    },
    {
      id: 'interview',
      title: 'Candidate interview',
      start: at(5, 13),
      end: at(5, 14),
      allDay: false,
      color: CATEGORY.product.color,
    },
    {
      id: 'retro',
      title: 'Sprint retro',
      start: at(6, 16),
      end: at(6, 17),
      allDay: false,
      color: CATEGORY.engineering.color,
    },
  ];
}

export function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('workora_calendar_events');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((evt: any) => ({
          ...evt,
          start: new Date(evt.start),
          end: new Date(evt.end),
        }));
      } catch {
        return buildInitialEvents();
      }
    }
    return buildInitialEvents();
  });

  useEffect(() => {
    localStorage.setItem('workora_calendar_events', JSON.stringify(events));
  }, [events]);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <CalendarIcon sx={{ fontSize: 28, color: '#111827' }} />
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              fontFamily: 'Poppins, sans-serif !important',
              color: '#111827',
              fontSize: { xs: '1.5rem', sm: '1.75rem' },
            }}
          >
            Calendar
          </Typography>
          <Typography
            sx={{
              color: '#6B7280',
              fontFamily: 'Poppins, sans-serif !important',
              fontSize: '0.85rem',
            }}
          >
            Schedule and manage your events
          </Typography>
        </Box>
      </Box>

      <EventCalendar events={events} onEventsChange={setEvents} />
    </Box>
  );
}