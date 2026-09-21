// src/components/Calendar/EventEditorDialog.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  FormControlLabel,
  Switch,
  IconButton,
  Divider,
  Alert,
} from '@mui/material';
import { Close as CloseIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
  EventDraft,
  EVENT_COLORS,
  START_HOURS,
  MINUTES,
} from '../../types/calendar';
import { format, isBefore, startOfDay } from 'date-fns';
import { MemberMultiSelect } from '../Kanban/MemberMultiSelect';
import { Member } from '../../data/membersData';

interface EventEditorDialogProps {
  open: boolean;
  draft: EventDraft | null;
  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
  onDraftChange: (draft: EventDraft) => void;
}

export function EventEditorDialog({
  open,
  draft,
  onClose,
  onSave,
  onDelete,
  onDraftChange,
}: EventEditorDialogProps) {
  if (!draft) return null;

  const isEdit = draft.id !== null;
  const isPastDay = isBefore(startOfDay(draft.date), startOfDay(new Date()));
  const readOnly = isPastDay;

  // Format hour + minute to "HH:MM"
  const formatTime = (hour: number, minute: number) =>
    `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 0,
          maxWidth: 420,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          p: 2,
          pb: 1.5,
          gap: 1,
        }}
      >
        {/* Left: Title + Date */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontWeight: 600,
              fontFamily: 'Poppins, sans-serif !important',
              fontSize: '0.9rem',
              color: '#111827',
            }}
          >
            {readOnly ? 'Event Details' : isEdit ? 'Edit Event' : 'New Event'}
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Poppins, sans-serif !important',
              fontSize: '0.7rem',
              color: '#6B7280',
              mt: 0.25,
            }}
          >
            {format(draft.date, 'EEEE, MMMM d, yyyy')}
          </Typography>
        </Box>

        {/* Right: Color circles + Close */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
          {EVENT_COLORS.map((color) => (
            <Box
              key={color.value}
              onClick={() =>
                !readOnly && onDraftChange({ ...draft, color: color.value })
              }
              sx={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                bgcolor: color.value,
                cursor: readOnly ? 'default' : 'pointer',
                border:
                  draft.color === color.value
                    ? '2px solid #111827'
                    : '1px solid rgba(0,0,0,0.1)',
                transition: 'transform 0.15s ease',
                '&:hover': readOnly ? {} : { transform: 'scale(1.15)' },
              }}
            />
          ))}
          <IconButton onClick={onClose} size="small" sx={{ p: 0.5, ml: 0.5 }}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 2, pt: 1 }}>
        {readOnly && (
          <Alert
            severity="info"
            sx={{
              mb: 2,
              borderRadius: 1.5,
              fontFamily: 'Poppins, sans-serif !important',
              fontSize: '0.7rem',
              '& .MuiAlert-message': {
                fontFamily: 'Poppins, sans-serif !important',
                fontSize: '0.7rem',
              },
            }}
          >
            This event is in the past and cannot be edited.
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
          {/* Title */}
          <Box>
            <Typography
              sx={{
                fontFamily: 'Poppins, sans-serif !important',
                fontSize: '0.7rem',
                fontWeight: 500,
                color: '#374151',
                mb: 0.5,
              }}
            >
              Title
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Add a title"
              value={draft.title}
              onChange={(e) => onDraftChange({ ...draft, title: e.target.value })}
              disabled={readOnly}
              autoFocus={!readOnly}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.8rem',
                },
                '& .MuiOutlinedInput-input': {
                  fontFamily: 'Poppins, sans-serif !important',
                  fontSize: '0.8rem',
                  py: 0.75,
                },
              }}
            />
          </Box>

          {/* Start Time + End Time */}
          {!draft.allDay && (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              <Box>
                <Typography
                  sx={{
                    fontFamily: 'Poppins, sans-serif !important',
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    color: '#374151',
                    mb: 0.5,
                  }}
                >
                  Start
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <FormControl fullWidth size="small">
                    <Select
                      value={String(draft.startHour)}
                      onChange={(e) =>
                        onDraftChange({ ...draft, startHour: Number(e.target.value) })
                      }
                      disabled={readOnly}
                      sx={{
                        borderRadius: 1.5,
                        fontSize: '0.8rem',
                        '& .MuiSelect-select': {
                          fontFamily: 'Poppins, sans-serif !important',
                          fontSize: '0.8rem',
                          py: 0.75,
                        },
                      }}
                    >
                      {START_HOURS.map((hour) => (
                        <MenuItem
                          key={hour}
                          value={String(hour)}
                          sx={{
                            fontFamily: 'Poppins, sans-serif !important',
                            fontSize: '0.8rem',
                          }}
                        >
                          {String(hour).padStart(2, '0')}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth size="small">
                    <Select
                      value={String(draft.startMinute)}
                      onChange={(e) =>
                        onDraftChange({ ...draft, startMinute: Number(e.target.value) })
                      }
                      disabled={readOnly}
                      sx={{
                        borderRadius: 1.5,
                        fontSize: '0.8rem',
                        '& .MuiSelect-select': {
                          fontFamily: 'Poppins, sans-serif !important',
                          fontSize: '0.8rem',
                          py: 0.75,
                        },
                      }}
                    >
                      {MINUTES.map((min) => (
                        <MenuItem
                          key={min}
                          value={String(min)}
                          sx={{
                            fontFamily: 'Poppins, sans-serif !important',
                            fontSize: '0.8rem',
                          }}
                        >
                          :{String(min).padStart(2, '0')}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontFamily: 'Poppins, sans-serif !important',
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    color: '#374151',
                    mb: 0.5,
                  }}
                >
                  End
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <FormControl fullWidth size="small">
                    <Select
                      value={String(draft.endHour)}
                      onChange={(e) =>
                        onDraftChange({ ...draft, endHour: Number(e.target.value) })
                      }
                      disabled={readOnly}
                      sx={{
                        borderRadius: 1.5,
                        fontSize: '0.8rem',
                        '& .MuiSelect-select': {
                          fontFamily: 'Poppins, sans-serif !important',
                          fontSize: '0.8rem',
                          py: 0.75,
                        },
                      }}
                    >
                      {START_HOURS.map((hour) => (
                        <MenuItem
                          key={hour}
                          value={String(hour)}
                          sx={{
                            fontFamily: 'Poppins, sans-serif !important',
                            fontSize: '0.8rem',
                          }}
                        >
                          {String(hour).padStart(2, '0')}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth size="small">
                    <Select
                      value={String(draft.endMinute)}
                      onChange={(e) =>
                        onDraftChange({ ...draft, endMinute: Number(e.target.value) })
                      }
                      disabled={readOnly}
                      sx={{
                        borderRadius: 1.5,
                        fontSize: '0.8rem',
                        '& .MuiSelect-select': {
                          fontFamily: 'Poppins, sans-serif !important',
                          fontSize: '0.8rem',
                          py: 0.75,
                        },
                      }}
                    >
                      {MINUTES.map((min) => (
                        <MenuItem
                          key={min}
                          value={String(min)}
                          sx={{
                            fontFamily: 'Poppins, sans-serif !important',
                            fontSize: '0.8rem',
                          }}
                        >
                          :{String(min).padStart(2, '0')}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </Box>
          )}

          {/* All Day Toggle */}
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={draft.allDay}
                onChange={(e) => onDraftChange({ ...draft, allDay: e.target.checked })}
                disabled={readOnly}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#111827',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    bgcolor: '#111827',
                  },
                }}
              />
            }
            label={
              <Typography
                sx={{
                  fontFamily: 'Poppins, sans-serif !important',
                  fontSize: '0.75rem',
                  color: '#374151',
                }}
              >
                All day
              </Typography>
            }
          />

          {/* Members */}
          <Box>
            <Typography
              sx={{
                fontFamily: 'Poppins, sans-serif !important',
                fontSize: '0.7rem',
                fontWeight: 500,
                color: '#374151',
                mb: 0.5,
              }}
            >
              Members
            </Typography>
            <MemberMultiSelect
              value={
                (draft.members || [])
                  .map((m) => ({
                    id: m.id,
                    name: m.name,
                    avatar: m.avatar,
                    initials: m.initials,
                    position: m.position || '',
                    email: '',
                  })) as Member[]
              }
              onChange={(members) => {
                onDraftChange({
                  ...draft,
                  members: members.map((m) => ({
                    id: m.id,
                    name: m.name,
                    avatar: m.avatar,
                    initials: m.initials,
                    position: m.position,
                  })),
                });
              }}
              placeholder="Add members..."
              disabled={readOnly}
            />
          </Box>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions
        sx={{
          p: 1.5,
          px: 2,
          gap: 1,
          justifyContent: readOnly ? 'flex-end' : isEdit ? 'space-between' : 'flex-end',
        }}
      >
        {!readOnly && isEdit && (
          <Button
            size="small"
            startIcon={<DeleteIcon sx={{ fontSize: 16 }} />}
            onClick={onDelete}
            sx={{
              fontFamily: 'Poppins, sans-serif !important',
              textTransform: 'none',
              fontSize: '0.75rem',
              color: '#DC2626',
              '&:hover': { bgcolor: '#FEF2F2' },
            }}
          >
            Delete
          </Button>
        )}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            onClick={onClose}
            sx={{
              fontFamily: 'Poppins, sans-serif !important',
              textTransform: 'none',
              fontSize: '0.75rem',
              py: 0.5,
              px: 1.5,
            }}
          >
            {readOnly ? 'Close' : 'Cancel'}
          </Button>
          {!readOnly && (
            <Button
              size="small"
              variant="contained"
              onClick={onSave}
              disabled={!draft.title.trim()}
              sx={{
                fontFamily: 'Poppins, sans-serif !important',
                textTransform: 'none',
                fontSize: '0.75rem',
                borderRadius: 1.5,
                py: 0.5,
                px: 2,
                bgcolor: '#111827',
                '&:hover': { bgcolor: '#374151' },
              }}
            >
              {isEdit ? 'Save' : 'Create'}
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
}