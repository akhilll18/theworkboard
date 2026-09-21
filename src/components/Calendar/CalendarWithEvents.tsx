// src/components/Calendar/CalendarWithEvents.tsx
import { useState } from 'react';
import {
  Popover,
  IconButton,
  Badge,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  Chip,
} from '@mui/material';
import {
  CalendarToday,
  Event,
  Add,
  Close,
  FiberManualRecord,
} from '@mui/icons-material';

// Types
interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  from: string;
  to: string;
  color: 'blue' | 'teal' | 'orange' | 'green' | 'red' | 'purple';
  description?: string;
}

// Sample events data
const defaultEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Product Standup',
    date: new Date(new Date().setDate(new Date().getDate() + 0)),
    from: '08:30 AM',
    to: '09:00 AM',
    color: 'blue',
    description: 'Daily standup meeting with product team',
  },
  {
    id: '2',
    title: 'UX Walkthrough',
    date: new Date(new Date().setDate(new Date().getDate() + 0)),
    from: '11:00 AM',
    to: '12:00 PM',
    color: 'teal',
    description: 'Review design prototypes with UX team',
  },
  {
    id: '3',
    title: 'Stakeholder Demo',
    date: new Date(new Date().setDate(new Date().getDate() + 0)),
    from: '03:00 PM',
    to: '04:30 PM',
    color: 'orange',
    description: 'Demo latest features to stakeholders',
  },
  {
    id: '4',
    title: 'Sprint Planning',
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    from: '10:00 AM',
    to: '11:30 AM',
    color: 'purple',
    description: 'Plan next sprint tasks and assignments',
  },
  {
    id: '5',
    title: 'Code Review Session',
    date: new Date(new Date().setDate(new Date().getDate() + 3)),
    from: '02:00 PM',
    to: '03:30 PM',
    color: 'green',
    description: 'Review pull requests and provide feedback',
  },
  {
    id: '6',
    title: 'Client Meeting',
    date: new Date(new Date().setDate(new Date().getDate() + 5)),
    from: '09:30 AM',
    to: '10:30 AM',
    color: 'red',
    description: 'Monthly client progress review',
  },
];

const colorMap = {
  blue: { dot: '#0052CC', bg: 'rgba(0, 82, 204, 0.08)', time: '#0052CC' },
  teal: { dot: '#00B8D9', bg: 'rgba(0, 184, 217, 0.08)', time: '#00B8D9' },
  orange: { dot: '#FF8B00', bg: 'rgba(255, 139, 0, 0.08)', time: '#FF8B00' },
  green: { dot: '#36B37E', bg: 'rgba(54, 179, 126, 0.08)', time: '#36B37E' },
  red: { dot: '#FF5630', bg: 'rgba(255, 86, 48, 0.08)', time: '#FF5630' },
  purple: { dot: '#6554C0', bg: 'rgba(101, 84, 192, 0.08)', time: '#6554C0' },
};

// Simple date helper
const getEventsForDate = (date: Date): CalendarEvent[] => {
  return defaultEvents.filter(event => 
    event.date.toDateString() === date.toDateString()
  );
};

const hasEvents = (date: Date): boolean => {
  return defaultEvents.some(event => 
    event.date.toDateString() === date.toDateString()
  );
};

export function CalendarWithEvents() {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [open, setOpen] = useState(false);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  // Generate calendar days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Add empty cells for padding
    const startPadding = firstDay.getDay();
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const currentMonthDays = selectedDate ? getDaysInMonth(selectedDate) : [];

  const changeMonth = (increment: number) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setMonth(newDate.getMonth() + increment);
      setSelectedDate(newDate);
    }
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <>
      {/* Calendar Icon Button */}
      <IconButton 
        onClick={handleOpen} 
        size="small"
        sx={{
          position: 'relative',
          '&:hover': {
            bgcolor: 'rgba(0, 82, 204, 0.08)',
          },
        }}
      >
        <Badge 
          badgeContent={defaultEvents.length} 
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '0.65rem',
              height: 18,
              minWidth: 18,
            },
          }}
        >
          <CalendarToday fontSize="small" />
        </Badge>
      </IconButton>

      {/* Calendar Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1.5,
            width: 420,
            maxWidth: '90vw',
            maxHeight: 600,
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography 
              variant="subtitle1" 
              fontWeight={600}
              sx={{ fontFamily: '"Google Sans", sans-serif !important' }}
            >
              Calendar
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Button 
                size="small" 
                variant="outlined"
                startIcon={<Add />}
                sx={{
                  fontFamily: '"Google Sans", sans-serif !important',
                  textTransform: 'none',
                }}
              >
                Add Event
              </Button>
              <IconButton size="small" onClick={handleClose}>
                <Close fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Simple Calendar */}
        {selectedDate && (
          <Box sx={{ p: 2 }}>
            {/* Month Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <IconButton onClick={() => changeMonth(-1)} size="small">
                ←
              </IconButton>
              <Typography 
                variant="subtitle1" 
                fontWeight={600}
                sx={{ fontFamily: '"Google Sans", sans-serif !important' }}
              >
                {formatMonth(selectedDate)}
              </Typography>
              <IconButton onClick={() => changeMonth(1)} size="small">
                →
              </IconButton>
            </Box>

            {/* Day Headers */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, mb: 1 }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <Typography 
                  key={day} 
                  variant="caption" 
                  align="center"
                  sx={{ 
                    fontWeight: 600, 
                    color: 'text.secondary',
                    fontFamily: '"Google Sans", sans-serif !important',
                    fontSize: '0.7rem',
                  }}
                >
                  {day}
                </Typography>
              ))}
            </Box>

            {/* Days */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
              {currentMonthDays.map((day, index) => (
                <Box
                  key={index}
                  onClick={() => day && setSelectedDate(day)}
                  sx={{
                    aspectRatio: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1,
                    cursor: day ? 'pointer' : 'default',
                    bgcolor: day && day.toDateString() === selectedDate?.toDateString() 
                      ? 'primary.main' 
                      : 'transparent',
                    color: day && day.toDateString() === selectedDate?.toDateString() 
                      ? 'white' 
                      : 'text.primary',
                    '&:hover': {
                      bgcolor: day ? 'action.hover' : 'transparent',
                    },
                    position: 'relative',
                  }}
                >
                  {day && (
                    <>
                      <Typography 
                        variant="body2"
                        sx={{ 
                          fontFamily: '"Google Sans", sans-serif !important',
                          fontWeight: day.toDateString() === selectedDate?.toDateString() ? 600 : 400,
                        }}
                      >
                        {day.getDate()}
                      </Typography>
                      {hasEvents(day) && (
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 2,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 4,
                            height: 4,
                            borderRadius: '50%',
                            bgcolor: day.toDateString() === selectedDate?.toDateString() 
                              ? 'white' 
                              : 'primary.main',
                          }}
                        />
                      )}
                    </>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        <Divider />

        {/* Events List */}
        <Box sx={{ p: 2, maxHeight: 250, overflowY: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography 
              variant="subtitle2" 
              fontWeight={600}
              sx={{ fontFamily: '"Google Sans", sans-serif !important' }}
            >
              {selectedDate?.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Typography>
            <Chip 
              label={`${selectedDateEvents.length} events`} 
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontFamily: '"Google Sans", sans-serif !important' }}
            />
          </Box>

          {selectedDateEvents.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {selectedDateEvents.map((event) => {
                const color = colorMap[event.color];
                return (
                  <Card 
                    key={event.id} 
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      borderLeft: `4px solid ${color.dot}`,
                      '&:hover': {
                        bgcolor: color.bg,
                      },
                    }}
                  >
                    <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography 
                            variant="body2" 
                            fontWeight={600}
                            sx={{ fontFamily: '"Google Sans", sans-serif !important' }}
                          >
                            {event.title}
                          </Typography>
                          {event.description && (
                            <Typography 
                              variant="caption" 
                              color="text.secondary"
                              sx={{ 
                                display: 'block',
                                mt: 0.5,
                                fontFamily: '"Google Sans", sans-serif !important' 
                              }}
                            >
                              {event.description}
                            </Typography>
                          )}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Chip
                              label={`${event.from} - ${event.to}`}
                              size="small"
                              sx={{
                                fontFamily: '"Google Sans", sans-serif !important',
                                fontSize: '0.65rem',
                                height: 20,
                                bgcolor: color.bg,
                                color: color.time,
                                fontWeight: 500,
                              }}
                            />
                            <Chip
                              label={event.color}
                              size="small"
                              sx={{
                                fontFamily: '"Google Sans", sans-serif !important',
                                fontSize: '0.65rem',
                                height: 20,
                                bgcolor: color.bg,
                                color: color.time,
                              }}
                            />
                          </Box>
                        </Box>
                        <FiberManualRecord 
                          sx={{ 
                            color: color.dot, 
                            fontSize: 12,
                            mt: 0.5,
                          }} 
                        />
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          ) : (
            <Box 
              sx={{ 
                py: 4, 
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Event sx={{ fontSize: 40, color: 'text.secondary', opacity: 0.5 }} />
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontFamily: '"Google Sans", sans-serif !important' }}
              >
                No events for this day
              </Typography>
              <Button 
                size="small" 
                startIcon={<Add />}
                sx={{
                  fontFamily: '"Google Sans", sans-serif !important',
                  textTransform: 'none',
                }}
              >
                Add Event
              </Button>
            </Box>
          )}
        </Box>
      </Popover>
    </>
  );
}