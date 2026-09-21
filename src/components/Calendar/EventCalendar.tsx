// src/components/Calendar/EventCalendar.tsx
import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
  ButtonGroup,
  Tooltip,
  Popover,
  Divider,
  Avatar,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isBefore,
  isAfter,
  startOfDay,
  setHours,
  setMinutes,
  differenceInCalendarDays,
} from 'date-fns';
import { CalendarEvent, EventDraft, EVENT_COLORS } from '../../types/calendar';
import { EventEditorDialog } from './EventEditorDialog';
import { useToast } from '../../context/ToastContext';

interface EventCalendarProps {
  events: CalendarEvent[];
  onEventsChange: (events: CalendarEvent[]) => void;
}

export function EventCalendar({ events, onEventsChange }: EventCalendarProps) {
  const { showToast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draft, setDraft] = useState<EventDraft | null>(null);

  // Popover state for "view all events on this date"
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);
  const [popoverDate, setPopoverDate] = useState<Date | null>(null);

  const today = startOfDay(new Date());

  const isPastDay = (date: Date) => isBefore(startOfDay(date), today);
  const isToday = (date: Date) => isSameDay(date, today);

  // Get calendar grid days
  const getCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days: Date[] = [];
    let day = calendarStart;
    while (day <= calendarEnd) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  };

  // Get events for a specific day (single-day match)
  const getEventsForDay = (date: Date) => {
    return events.filter((event) => {
      const eventStart = startOfDay(event.start);
      const eventEnd = startOfDay(event.end);
      const dayStart = startOfDay(date);
      return dayStart >= eventStart && dayStart <= eventEnd;
    });
  };

  // Get multi-day event spans for a row (week)
  const getWeekSpans = (weekStart: Date) => {
    const weekEnd = addDays(weekStart, 6);
    const spans: { event: CalendarEvent; startCol: number; colSpan: number; isStart: boolean; isEnd: boolean }[] = [];

    events.forEach((event) => {
      const eStart = startOfDay(event.start);
      const eEnd = startOfDay(event.end);

      // Only show as span if event is multi-day
      const daySpan = differenceInCalendarDays(eEnd, eStart);
      if (daySpan < 1) return;

      // Check if event overlaps this week
      if (isAfter(eStart, weekEnd) || isBefore(eEnd, weekStart)) return;

      const spanStart = isBefore(eStart, weekStart) ? weekStart : eStart;
      const spanEnd = isAfter(eEnd, weekEnd) ? weekEnd : eEnd;

      const startCol = differenceInCalendarDays(spanStart, weekStart);
      const colSpan = differenceInCalendarDays(spanEnd, spanStart) + 1;

      spans.push({
        event,
        startCol,
        colSpan,
        isStart: isSameDay(spanStart, eStart),
        isEnd: isSameDay(spanEnd, eEnd),
      });
    });

    return spans;
  };

  // Check if a single-day event should render in the "day cell" area or in the span lane
  const isMultiDay = (event: CalendarEvent) => {
    const eStart = startOfDay(event.start);
    const eEnd = startOfDay(event.end);
    return differenceInCalendarDays(eEnd, eStart) >= 1;
  };

  // Handle cell click — create new event
  const handleCellClick = (date: Date, e: React.MouseEvent<HTMLElement>) => {
    if (isPastDay(date)) return;

    // Show popover if there are events, otherwise open create dialog
    const dayEvents = getEventsForDay(date);
    if (dayEvents.length > 0) {
      setPopoverAnchor(e.currentTarget);
      setPopoverDate(date);
      return;
    }

    const newDraft: EventDraft = {
      id: null,
      title: '',
      date: startOfDay(date),
      startHour: 9,
      startMinute: 0,
      endHour: 10,
      endMinute: 0,
      allDay: false,
      color: EVENT_COLORS[0].value,
      members: [],
    };
    setDraft(newDraft);
    setDialogOpen(true);
  };

  // Handle event click — edit
  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();

    const startH = event.start.getHours();
    const startM = event.start.getMinutes();
    const endH = event.end.getHours();
    const endM = event.end.getMinutes();

    const newDraft: EventDraft = {
      id: event.id,
      title: event.title,
      date: startOfDay(event.start),
      startHour: startH,
      startMinute: startM,
      endHour: endH,
      endMinute: endM,
      allDay: event.allDay,
      color: event.color,
      members: event.members || [],
    };
    setDraft(newDraft);
    setDialogOpen(true);
    setPopoverAnchor(null);
    setPopoverDate(null);
  };

  // Save event
  const handleSave = () => {
    if (!draft || !draft.title.trim()) return;

    const start = draft.allDay
      ? draft.date
      : setMinutes(setHours(draft.date, draft.startHour), draft.startMinute);
    const end = draft.allDay
      ? addDays(draft.date, 1)
      : setMinutes(setHours(draft.date, draft.endHour), draft.endMinute);

    if (draft.id === null) {
      const newEvent: CalendarEvent = {
        id: `event-${Date.now()}`,
        title: draft.title.trim(),
        start,
        end,
        allDay: draft.allDay,
        color: draft.color,
        members: draft.members,
      };
      onEventsChange([...events, newEvent]);

      showToast(
        'Event has been created',
        `"${draft.title.trim()}" · ${format(start, 'EEEE, MMMM do')} at ${format(start, 'h:mm a')}`,
        'success'
      );
    } else {
      const updated = events.map((evt) =>
        evt.id === draft.id
          ? {
              ...evt,
              title: draft.title.trim(),
              start,
              end,
              allDay: draft.allDay,
              color: draft.color,
              members: draft.members,
            }
          : evt
      );
      onEventsChange(updated);

      showToast(
        'Event has been updated',
        `"${draft.title.trim()}" · ${format(start, 'EEEE, MMMM do')} at ${format(start, 'h:mm a')}`,
        'success'
      );
    }

    setDialogOpen(false);
    setDraft(null);
  };

  // Delete event
  const handleDelete = () => {
    if (!draft?.id) return;
    const deletedEvent = events.find((e) => e.id === draft.id);
    const updated = events.filter((evt) => evt.id !== draft.id);
    onEventsChange(updated);

    showToast(
      'Event has been deleted',
      deletedEvent ? `"${deletedEvent.title}" was removed` : undefined,
      'info'
    );

    setDialogOpen(false);
    setDraft(null);
  };

  // Navigation
  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  const calendarDays = getCalendarDays();
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const totalRows = Math.ceil(calendarDays.length / 7);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            sx={{
              fontFamily: 'Poppins, sans-serif !important',
              fontSize: '1.1rem',
              fontWeight: 600,
              color: '#111827',
              minWidth: 160,
            }}
          >
            {format(currentMonth, 'MMMM yyyy')}
          </Typography>
          <ButtonGroup size="small" variant="outlined">
            <IconButton onClick={goToPreviousMonth} size="small" sx={{ borderRadius: 0, px: 1 }}>
              <ChevronLeftIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <Button
              onClick={goToToday}
              size="small"
              sx={{
                fontFamily: 'Poppins, sans-serif !important',
                textTransform: 'none',
                fontSize: '0.7rem',
                px: 1.5,
                borderColor: '#E5E7EB',
                color: '#374151',
              }}
            >
              Today
            </Button>
            <IconButton onClick={goToNextMonth} size="small" sx={{ borderRadius: 0, px: 1 }}>
              <ChevronRightIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </ButtonGroup>
        </Box>

        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon sx={{ fontSize: 16 }} />}
          onClick={(e) => handleCellClick(new Date(), e)}
          sx={{
            fontFamily: 'Poppins, sans-serif !important',
            textTransform: 'none',
            fontSize: '0.75rem',
            borderRadius: 1.5,
            bgcolor: '#111827',
            '&:hover': { bgcolor: '#374151' },
          }}
        >
          Add Event
        </Button>
      </Box>

      {/* Calendar Grid */}
      <Paper
        elevation={0}
        sx={{
          border: '1px solid #E5E7EB',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        {/* Week Day Headers */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            bgcolor: '#F9FAFB',
            borderBottom: '1px solid #E5E7EB',
          }}
        >
          {weekDays.map((day) => (
            <Box
              key={day}
              sx={{
                p: 1,
                textAlign: 'center',
                borderRight: '1px solid #E5E7EB',
                '&:last-child': { borderRight: 'none' },
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'Poppins, sans-serif !important',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {day}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Weeks */}
        {Array.from({ length: totalRows }).map((_, weekIdx) => {
          const weekStart = calendarDays[weekIdx * 7];
          const weekDaysRow = calendarDays.slice(weekIdx * 7, weekIdx * 7 + 7);
          const spans = getWeekSpans(weekStart);

          return (
            <Box
              key={weekIdx}
              sx={{
                position: 'relative',
                borderBottom: weekIdx === totalRows - 1 ? 'none' : '1px solid #E5E7EB',
              }}
            >
              {/* Day cells grid */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                }}
              >
                {weekDaysRow.map((day, dayIdx) => {
                  const isPast = isPastDay(day);
                  const isTodayDate = isToday(day);
                  const isCurrentMonth = isSameMonth(day, currentMonth);

                  // Single-day events (not multi-day)
                  const singleDayEvents = getEventsForDay(day).filter(
                    (evt) => !isMultiDay(evt)
                  );

                  return (
                    <Box
                      key={dayIdx}
                      onClick={(e) => handleCellClick(day, e)}
                      sx={{
                        minHeight: 110,
                        p: 0.75,
                        borderRight: (dayIdx + 1) % 7 === 0 ? 'none' : '1px solid #E5E7EB',
                        cursor: isPast ? 'not-allowed' : 'pointer',
                        bgcolor: isPast
                          ? '#FAFAFA'
                          : isTodayDate
                          ? '#FFFBEB'
                          : '#FFFFFF',
                        opacity: isCurrentMonth ? 1 : 0.4,
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          bgcolor: isPast
                            ? '#FAFAFA'
                            : isTodayDate
                            ? '#FEF3C7'
                            : '#F9FAFB',
                        },
                      }}
                    >
                      {/* Day Number */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: 'Poppins, sans-serif !important',
                            fontSize: '0.75rem',
                            fontWeight: isTodayDate ? 700 : 500,
                            color: isPast ? '#9CA3AF' : isTodayDate ? '#111827' : '#374151',
                          }}
                        >
                          {format(day, 'd')}
                        </Typography>
                        {isTodayDate && (
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor: '#DC2626',
                            }}
                          />
                        )}
                      </Box>

                      {/* Single-day events — fixed height, ellipsis */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                        {singleDayEvents.slice(0, 3).map((event) => (
                          <Tooltip
                            key={event.id}
                            title={event.title}
                            arrow
                            placement="top"
                          >
                            <Box
                              onClick={(e) => handleEventClick(event, e)}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                px: 0.5,
                                py: 0.25,
                                borderRadius: 0.5,
                                bgcolor: event.color,
                                cursor: 'pointer',
                                maxWidth: '100%',
                                overflow: 'hidden',
                                transition: 'opacity 0.15s ease',
                                '&:hover': { opacity: 0.85 },
                              }}
                            >
                              <Typography
                                sx={{
                                  fontFamily: 'Poppins, sans-serif !important',
                                  fontSize: '0.6rem',
                                  color: '#FFFFFF',
                                  fontWeight: 500,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  flex: 1,
                                  minWidth: 0,
                                }}
                              >
                                {event.title}
                              </Typography>
                            </Box>
                          </Tooltip>
                        ))}
                        {singleDayEvents.length > 3 && (
                          <Typography
                            sx={{
                              fontFamily: 'Poppins, sans-serif !important',
                              fontSize: '0.55rem',
                              color: '#6B7280',
                              fontWeight: 500,
                              pl: 0.5,
                            }}
                          >
                            +{singleDayEvents.length - 3} more
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </Box>

              {/* Multi-day span bars — overlay at the top of the week */}
              {spans.length > 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 34,
                    left: 0,
                    right: 0,
                    px: 0.5,
                    pointerEvents: 'none',
                  }}
                >
                  {spans.map((span, spanIdx) => (
                    <Box
                      key={`${span.event.id}-${spanIdx}`}
                      onClick={(e) => handleEventClick(span.event, e)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        position: 'absolute',
                        top: spanIdx * 22,
                        left: `${(span.startCol / 7) * 100}%`,
                        width: `${(span.colSpan / 7) * 100}%`,
                        height: 20,
                        px: 0.75,
                        bgcolor: span.event.color,
                        cursor: 'pointer',
                        pointerEvents: 'auto',
                        borderTopLeftRadius: span.isStart ? 3 : 0,
                        borderBottomLeftRadius: span.isStart ? 3 : 0,
                        borderTopRightRadius: span.isEnd ? 3 : 0,
                        borderBottomRightRadius: span.isEnd ? 3 : 0,
                        transition: 'opacity 0.15s ease',
                        '&:hover': { opacity: 0.85 },
                        zIndex: 5,
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: 'Poppins, sans-serif !important',
                          fontSize: '0.6rem',
                          color: '#FFFFFF',
                          fontWeight: 500,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {span.isStart ? span.event.title : ''}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          );
        })}
      </Paper>

      {/* Popover: All events for a date */}
      <Popover
        open={Boolean(popoverAnchor)}
        anchorEl={popoverAnchor}
        onClose={() => {
          setPopoverAnchor(null);
          setPopoverDate(null);
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            border: '1px solid #E5E7EB',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            minWidth: 280,
            maxWidth: 340,
            mt: 0.5,
            overflow: 'hidden',
          },
        }}
      >
        {popoverDate && (
          <>
            {/* Header */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 1.5,
                borderBottom: '1px solid #E5E7EB',
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontFamily: 'Poppins, sans-serif !important',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: '#111827',
                  }}
                >
                  {format(popoverDate, 'EEEE, MMM d')}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'Poppins, sans-serif !important',
                    fontSize: '0.65rem',
                    color: '#6B7280',
                  }}
                >
                  {getEventsForDay(popoverDate).length} event
                  {getEventsForDay(popoverDate).length !== 1 ? 's' : ''}
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={() => {
                  setPopoverAnchor(null);
                  setPopoverDate(null);
                }}
                sx={{ p: 0.5 }}
              >
                <CloseIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>

            {/* Events List */}
            <Box sx={{ maxHeight: 260, overflowY: 'auto', p: 1 }}>
              {getEventsForDay(popoverDate).map((event) => (
                <Box
                  key={event.id}
                  onClick={(e) => handleEventClick(event, e)}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1,
                    p: 1,
                    borderRadius: 1,
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                    '&:hover': { bgcolor: '#F9FAFB' },
                  }}
                >
                  <Box
                    sx={{
                      width: 4,
                      height: 32,
                      borderRadius: 0.5,
                      bgcolor: event.color,
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins, sans-serif !important',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: '#111827',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {event.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins, sans-serif !important',
                        fontSize: '0.65rem',
                        color: '#6B7280',
                      }}
                    >
                      {event.allDay
                        ? 'All day'
                        : `${format(event.start, 'h:mm a')} – ${format(event.end, 'h:mm a')}`}
                    </Typography>
                  </Box>
                  {event.members && event.members.length > 0 && (
                    <Box sx={{ display: 'flex', gap: -0.5 }}>
                      {event.members.slice(0, 2).map((m, i) => (
                        <Avatar
                          key={m.id}
                          src={m.avatar}
                          sx={{
                            width: 20,
                            height: 20,
                            fontSize: '0.55rem',
                            border: '1.5px solid #FFFFFF',
                            ml: i > 0 ? -0.75 : 0,
                          }}
                        >
                          {m.initials}
                        </Avatar>
                      ))}
                      {event.members.length > 2 && (
                        <Avatar
                          sx={{
                            width: 20,
                            height: 20,
                            fontSize: '0.5rem',
                            bgcolor: '#F3F4F6',
                            color: '#6B7280',
                            border: '1.5px solid #FFFFFF',
                            ml: -0.75,
                          }}
                        >
                          +{event.members.length - 2}
                        </Avatar>
                      )}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>

            <Divider />

            {/* Add Event Button */}
            {!isPastDay(popoverDate) && (
              <Box sx={{ p: 1 }}>
                <Button
                  fullWidth
                  size="small"
                  startIcon={<AddIcon sx={{ fontSize: 14 }} />}
                  onClick={() => {
                    const newDraft: EventDraft = {
                      id: null,
                      title: '',
                      date: startOfDay(popoverDate),
                      startHour: 9,
                      startMinute: 0,
                      endHour: 10,
                      endMinute: 0,
                      allDay: false,
                      color: EVENT_COLORS[0].value,
                      members: [],
                    };
                    setDraft(newDraft);
                    setDialogOpen(true);
                    setPopoverAnchor(null);
                    setPopoverDate(null);
                  }}
                  sx={{
                    fontFamily: 'Poppins, sans-serif !important',
                    textTransform: 'none',
                    fontSize: '0.7rem',
                    borderRadius: 1.5,
                    py: 0.5,
                  }}
                >
                  Add Event
                </Button>
              </Box>
            )}
          </>
        )}
      </Popover>

      {/* Event Editor Dialog */}
      <EventEditorDialog
        open={dialogOpen}
        draft={draft}
        onClose={() => {
          setDialogOpen(false);
          setDraft(null);
        }}
        onSave={handleSave}
        onDelete={handleDelete}
        onDraftChange={setDraft}
      />
    </Box>
  );
}