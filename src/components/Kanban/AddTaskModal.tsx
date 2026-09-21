// src/components/Kanban/AddTaskModal.tsx
import { useState } from 'react';
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
  FormControl,
  Select,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { ColumnId, Priority } from '../../types/kanban';
import { MemberMultiSelect } from './MemberMultiSelect';
import { AttachmentUploader, AttachmentFile } from './AttachmentUploader';
import { Member } from '../../data/membersData';

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  columnId: ColumnId;
  onAdd: (task: any) => void;
  availableColumns?: { id: ColumnId; title: string }[];
}

const priorities: Priority[] = ['low', 'medium', 'high'];

const colors = [
  { name: 'Default', value: '#FFFFFF', border: '#E5E7EB' },
  { name: 'Bug', value: '#FEF2F2', border: '#FCA5A5' },
  { name: 'Feature', value: '#EFF6FF', border: '#93C5FD' },
  { name: 'Improvement', value: '#F5F3FF', border: '#C4B5FD' },
  { name: 'Urgent', value: '#FFF7ED', border: '#FDBA74' },
  { name: 'Completed', value: '#F0FDF4', border: '#86EFAC' },
  { name: 'In Progress', value: '#FFFBEB', border: '#FDE68A' },
  { name: 'Review', value: '#FDF2F8', border: '#F9A8D4' },
];

const DEFAULT_COLUMNS = [
  { id: 'todo' as ColumnId, title: 'To Do' },
  { id: 'inProgress' as ColumnId, title: 'In Progress' },
  { id: 'review' as ColumnId, title: 'Review' },
  { id: 'done' as ColumnId, title: 'Done' },
];

export function AddTaskModal({
  open,
  onClose,
  columnId,
  onAdd,
  availableColumns = DEFAULT_COLUMNS,
}: AddTaskModalProps) {
  const [status, setStatus] = useState<ColumnId | ''>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [cardColor, setCardColor] = useState('#FFFFFF');
  const [cardImage, setCardImage] = useState<string>('');
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [fileError, setFileError] = useState('');

  const handleFilesAdd = (newFiles: File[]) => {
    setFileError('');
    const newAttachments: AttachmentFile[] = newFiles.map((file) => {
      const entry: AttachmentFile = {
        id: `file-${Date.now()}-${Math.random()}`,
        file,
      };
      if (file.type.startsWith('image/')) {
        entry.preview = URL.createObjectURL(file);
      }
      return entry;
    });
    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const handleFileRemove = (id: string) => {
    setAttachments((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCardImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleRemoveImage = () => {
    setCardImage('');
  };

  const handleSubmit = () => {
    if (!title.trim()) return;

    const finalColumnId: ColumnId = (status as ColumnId) || columnId || 'todo';

    const newTask = {
      id: `task-${Date.now()}`,
      code: `TASK-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      title: title.trim(),
      description: description.trim() || 'No description',
      priority,
      assignees:
        selectedMembers.length > 0
          ? selectedMembers.map((m) => ({ name: m.name, avatar: m.avatar }))
          : [{ name: 'Unassigned', avatar: '' }],
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || new Date().toISOString().split('T')[0],
      dueDate: endDate || new Date().toISOString().split('T')[0],
      cardColor: cardColor,       // ✅ Saved correctly
      cardImage: cardImage,       // ✅ Saved correctly
      labels: [],
      attachments: attachments.map((a) => ({
        id: a.id,
        name: a.file.name,
        size: `${(a.file.size / 1024).toFixed(1)} KB`,
        file: a.file,
      })),
      comments: [],
      subtasks: [],
      progress: 0,
      columnId: finalColumnId,
    };

    onAdd(newTask);
    handleClose();
  };

  const handleClose = () => {
    attachments.forEach((a) => {
      if (a.preview) URL.revokeObjectURL(a.preview);
    });
    setStatus('');
    setTitle('');
    setDescription('');
    setPriority('medium');
    setSelectedMembers([]);
    setStartDate('');
    setEndDate('');
    setCardColor('#FFFFFF');
    setCardImage('');
    setAttachments([]);
    setFileError('');
    onClose();
  };

  // Shared styles
  const labelStyle = {
    fontFamily: 'Poppins, sans-serif !important',
    fontSize: '0.65rem',
    fontWeight: 500,
    color: '#6B7280',
    mb: 0.5,
    display: 'block',
  } as const;

  const dateFieldWrapperSx = {
    minWidth: 120,
    flex: { xs: '1 1 auto', sm: '0 0 auto' },
  } as const;

  const dateInputSx = {
    width: '100%',
    '& .MuiOutlinedInput-root': {
      borderRadius: 1.5,
      height: 34,
    },
    '& .MuiOutlinedInput-input': {
      fontFamily: 'Poppins, sans-serif !important',
      fontSize: '0.72rem',
      py: 0.5,
      px: 1,
    },
    '& input[type="date"]::-webkit-calendar-picker-indicator': {
      fontSize: '0.85rem',
      cursor: 'pointer',
      opacity: 0.6,
    },
  } as const;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 0,
          overflow: 'hidden',
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          p: 2.5,
          pb: 1.5,
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            fontFamily: 'Poppins, sans-serif !important',
            fontSize: '1rem',
            color: '#111827',
            textAlign: 'center',
          }}
        >
          Add Task
        </Typography>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            p: 0.5,
          }}
        >
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, pt: 2.5, mt: 1.5 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {/* Row 1 — Status + Priority + Start Date + End Date + Card Image */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 0.5,
              flexWrap: { xs: 'wrap', md: 'nowrap' },
              rowGap: 1.5,
            }}
          >
            {/* Status */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minWidth: 110,
                flex: { xs: '1 1 auto', md: '0 0 auto' },
              }}
            >
              <Typography sx={labelStyle}>Status</Typography>
              <FormControl size="small" fullWidth>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ColumnId)}
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) {
                      return (
                        <Typography
                          sx={{
                            fontFamily: 'Poppins, sans-serif !important',
                            fontSize: '0.72rem',
                            color: '#9CA3AF',
                          }}
                        >
                          Select...
                        </Typography>
                      );
                    }
                    const col = availableColumns.find((c) => c.id === selected);
                    return (
                      <Typography
                        sx={{
                          fontFamily: 'Poppins, sans-serif !important',
                          fontSize: '0.72rem',
                          color: '#111827',
                        }}
                      >
                        {col?.title || selected}
                      </Typography>
                    );
                  }}
                  sx={{
                    borderRadius: 1.5,
                    height: 34,
                    '& .MuiSelect-select': {
                      fontFamily: 'Poppins, sans-serif !important',
                      fontSize: '0.72rem',
                      py: 0.5,
                      px: 1,
                    },
                  }}
                >
                  {availableColumns.map((col) => (
                    <MenuItem
                      key={col.id}
                      value={col.id}
                      sx={{
                        fontFamily: 'Poppins, sans-serif !important',
                        fontSize: '0.75rem',
                      }}
                    >
                      {col.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Priority */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minWidth: 100,
                flex: { xs: '1 1 auto', md: '0 0 auto' },
              }}
            >
              <Typography sx={labelStyle}>Priority</Typography>
              <FormControl size="small" fullWidth>
                <Select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  sx={{
                    borderRadius: 1.5,
                    height: 34,
                    '& .MuiSelect-select': {
                      fontFamily: 'Poppins, sans-serif !important',
                      fontSize: '0.72rem',
                      py: 0.5,
                      px: 1,
                    },
                  }}
                >
                  {priorities.map((p) => (
                    <MenuItem
                      key={p}
                      value={p}
                      sx={{
                        fontFamily: 'Poppins, sans-serif !important',
                        fontSize: '0.75rem',
                      }}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Start Date */}
            <Box sx={dateFieldWrapperSx}>
              <Typography sx={labelStyle}>Start Date</Typography>
              <TextField
                type="date"
                size="small"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                sx={{
                  ...dateInputSx,
                  '& .MuiOutlinedInput-input::-webkit-datetime-edit': {
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '0.72rem',
                    visibility: startDate ? 'visible' : 'hidden',
                  },
                }}
              />
            </Box>

            {/* End Date */}
            <Box sx={dateFieldWrapperSx}>
              <Typography sx={labelStyle}>End Date</Typography>
              <TextField
                type="date"
                size="small"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                sx={{
                  ...dateInputSx,
                  '& .MuiOutlinedInput-input::-webkit-datetime-edit': {
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '0.72rem',
                    visibility: endDate ? 'visible' : 'hidden',
                  },
                }}
              />
            </Box>

            {/* Card Image (replaces Grace) */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
              }}
            >
              <Typography sx={labelStyle}>Card Image</Typography>
              {cardImage ? (
                <Box sx={{ position: 'relative' }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 34,
                      borderRadius: 1.5,
                      overflow: 'hidden',
                      border: '1px solid #E5E7EB',
                      bgcolor: '#F3F4F6',
                    }}
                  >
                    <Box
                      component="img"
                      src={cardImage}
                      alt="Card"
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                  <Tooltip title="Remove image">
                    <IconButton
                      size="small"
                      onClick={handleRemoveImage}
                      sx={{
                        position: 'absolute',
                        top: -6,
                        right: -6,
                        bgcolor: '#DC2626',
                        color: '#FFFFFF',
                        width: 10,
                        height: 10,
                        '&:hover': { bgcolor: '#B91C1C' },
                        '& .MuiSvgIcon-root': { fontSize: 11 },
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              ) : (
                <Tooltip title="Upload image">
                  <Box
                    component="label"
                    sx={{
                      width: 64,
                      height: 34,
                     borderRadius: 1.5,
                      border: '1.5px dashed #D1D5DB',
                      bgcolor: '#FAFAFA',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      '&:hover': {
                        borderColor: '#9CA3AF',
                        bgcolor: '#F3F4F6',
                      },
                    }}
                  >
                    <ImageIcon sx={{ fontSize: 16, color: '#6B7280' }} />
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </Box>
                </Tooltip>
              )}
            </Box>
          </Box>

          {/* Title */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
            <Typography
              sx={{
                fontFamily: 'Poppins, sans-serif !important',
                fontSize: '0.72rem',
                fontWeight: 500,
                color: '#374151',
                minWidth: 85,
                pt: 1.5,
                whiteSpace: 'nowrap',
              }}
            >
              Title *
            </Typography>
            <TextField
              fullWidth
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              variant="outlined"
              size="small"
              autoFocus
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: 1.5 },
                '& .MuiOutlinedInput-input': {
                  fontFamily: 'Poppins, sans-serif !important',
                  fontSize: '0.8rem',
                },
              }}
            />
          </Box>

          {/* Description */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
            <Typography
              sx={{
                fontFamily: 'Poppins, sans-serif !important',
                fontSize: '0.72rem',
                fontWeight: 500,
                color: '#374151',
                minWidth: 85,
                pt: 1.5,
                whiteSpace: 'nowrap',
              }}
            >
              Description
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Add more details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: 1.5 },
                '& .MuiOutlinedInput-input': {
                  fontFamily: 'Poppins, sans-serif !important',
                  fontSize: '0.8rem',
                },
              }}
            />
          </Box>

          {/* Assignees */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
            <Typography
              sx={{
                fontFamily: 'Poppins, sans-serif !important',
                fontSize: '0.72rem',
                fontWeight: 500,
                color: '#374151',
                minWidth: 85,
                pt: 1.5,
                whiteSpace: 'nowrap',
              }}
            >
              Assignees
            </Typography>
            <Box sx={{ flex: 1 }}>
              <MemberMultiSelect
                value={selectedMembers}
                onChange={setSelectedMembers}
                placeholder="Add members..."
              />
            </Box>
          </Box>

          {/* Card Color */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography
              sx={{
                fontFamily: 'Poppins, sans-serif !important',
                fontSize: '0.72rem',
                fontWeight: 500,
                color: '#374151',
                minWidth: 85,
                whiteSpace: 'nowrap',
              }}
            >
              Card Color
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {colors.map((color) => (
                <Box
                  key={color.value}
                  onClick={() => setCardColor(color.value)}
                  sx={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    bgcolor: color.value,
                    border:
                      cardColor === color.value
                        ? '3px solid #111827'
                        : `2px solid ${color.border}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    '&:hover': { transform: 'scale(1.1)' },
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Attachments */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
            <Typography
              sx={{
                fontFamily: 'Poppins, sans-serif !important',
                fontSize: '0.72rem',
                fontWeight: 500,
                color: '#374151',
                minWidth: 85,
                pt: 1.5,
                whiteSpace: 'nowrap',
              }}
            >
              Attachments
            </Typography>
            <Box sx={{ flex: 1 }}>
              <AttachmentUploader
                files={attachments}
                onFilesAdd={handleFilesAdd}
                onFileRemove={handleFileRemove}
                maxFiles={5}
                maxSize={10 * 1024 * 1024}
                error={fileError}
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          pt: 1.5,
          borderTop: '1px solid #E5E7EB',
          gap: 1,
        }}
      >
        <Button
          onClick={handleClose}
          sx={{
            fontFamily: 'Poppins, sans-serif !important',
            textTransform: 'none',
            fontSize: '0.8rem',
            color: '#374151',
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!title.trim()}
          sx={{
            fontFamily: 'Poppins, sans-serif !important',
            textTransform: 'none',
            borderRadius: 1.5,
            px: 3,
            fontSize: '0.8rem',
            bgcolor: '#111827',
            '&:hover': { bgcolor: '#374151' },
            '&.Mui-disabled': {
              bgcolor: '#E5E7EB',
              color: '#9CA3AF',
            },
          }}
        >
          Add Task
        </Button>
      </DialogActions>
    </Dialog>
  );
}