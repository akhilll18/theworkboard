// src/components/Kanban/TaskDetailModal.tsx
import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Avatar,
  TextField,
  Button,
  Paper,
  MenuItem,
  Select,
  FormControl,
  DialogActions,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  InputAdornment,
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
  AttachFile as PaperclipIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { Task, Priority, ColumnId } from '../../types/kanban';
import { format } from 'date-fns';
import { MemberMultiSelect } from './MemberMultiSelect';
import { Member, MEMBERS } from '../../data/membersData';

interface TaskDetailModalProps {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
  availableColumns?: { id: ColumnId; title: string }[];
}

const priorityLabels: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

const cardColors = [
  { name: 'Default', value: '#FFFFFF', textColor: '#000000', borderColor: '#E5E7EB' },
  { name: 'Bug', value: '#FEF2F2', textColor: '#991B1B', borderColor: '#FCA5A5' },
  { name: 'Feature', value: '#EFF6FF', textColor: '#1E40AF', borderColor: '#93C5FD' },
  { name: 'Improvement', value: '#F5F3FF', textColor: '#5B21B6', borderColor: '#C4B5FD' },
  { name: 'Urgent', value: '#FFF7ED', textColor: '#9A3412', borderColor: '#FDBA74' },
  { name: 'Completed', value: '#F0FDF4', textColor: '#166534', borderColor: '#86EFAC' },
  { name: 'In Progress', value: '#FFFBEB', textColor: '#92400E', borderColor: '#FDE68A' },
  { name: 'Review', value: '#FDF2F8', textColor: '#9D174D', borderColor: '#F9A8D4' },
];

const DEFAULT_COLUMNS: { id: ColumnId; label: string }[] = [
  { id: 'todo', label: 'To Do' },
  { id: 'inProgress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
];

export function TaskDetailModal({
  open,
  task,
  onClose,
  onUpdate,
  onDelete,
  availableColumns = DEFAULT_COLUMNS,
}: TaskDetailModalProps) {
  const [comment, setComment] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editMembers, setEditMembers] = useState<Member[]>([]);
  const [editCardImage, setEditCardImage] = useState<string>('');

  useEffect(() => {
    if (task) {
      setEditTitle(task.title || '');
      setEditDescription(task.description || '');
      setEditStartDate(task.startDate || task.dueDate || '');
      setEditEndDate(task.endDate || task.dueDate || '');
      setEditCardImage((task as any).cardImage || '');

      const taskAssignees = task.assignees || [];
      const matchedMembers = MEMBERS.filter((m) =>
        taskAssignees.some((a) => a.name === m.name)
      );
      setEditMembers(matchedMembers);
    }
  }, [task]);

  if (!task) return null;

  // ---------- Handlers ----------

  const handleAddComment = () => {
    if (!comment.trim()) return;
    const newComment = {
      id: `c${Date.now()}`,
      author: 'You',
      avatar: 'https://i.pravatar.cc/150?img=11',
      content: comment,
      timestamp: new Date().toISOString(),
    };
    onUpdate({
      ...task,
      comments: [...(task.comments || []), newComment],
    });
    setComment('');
  };

  const handleTitleChange = (value: string) => {
    setEditTitle(value);
    onUpdate({ ...task, title: value });
  };

  const handleDescriptionChange = (value: string) => {
    setEditDescription(value);
    onUpdate({ ...task, description: value });
  };

  const handleStatusChange = (newStatus: ColumnId) => {
    onUpdate({ ...task, columnId: newStatus });
  };

  const handlePriorityChange = (newPriority: Priority) => {
    onUpdate({ ...task, priority: newPriority });
  };

  const handleCardColorChange = (colorValue: string) => {
    onUpdate({ ...task, cardColor: colorValue });
  };

  const handleStartDateChange = (value: string) => {
    setEditStartDate(value);
    onUpdate({ ...task, startDate: value, dueDate: value });
  };

  const handleEndDateChange = (value: string) => {
    setEditEndDate(value);
    onUpdate({ ...task, endDate: value, dueDate: value });
  };

  const handleMembersChange = (members: Member[]) => {
    setEditMembers(members);
    onUpdate({
      ...task,
      assignees:
        members.length > 0
          ? members.map((m) => ({ name: m.name, avatar: m.avatar }))
          : [{ name: 'Unassigned', avatar: '' }],
    });
  };

  // Image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setEditCardImage(base64);
      onUpdate({ ...task, cardImage: base64 } as Task);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setEditCardImage('');
    onUpdate({ ...task, cardImage: '' } as Task);
  };

  // Attachments
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        id: `file-${Date.now()}-${Math.random()}`,
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        file,
        url: URL.createObjectURL(file),
      }));
      onUpdate({
        ...task,
        attachments: [...(task.attachments || []), ...newFiles],
      });
    }
  };

  const handleRemoveFile = (fileId: string) => {
    onUpdate({
      ...task,
      attachments: (task.attachments || []).filter((a) => a.id !== fileId),
    });
  };

  const handleDownloadFile = (attachment: any) => {
    if (attachment.url) window.open(attachment.url, '_blank');
    else if (attachment.file) {
      const url = URL.createObjectURL(attachment.file);
      window.open(url, '_blank');
    }
  };

  const handleDeleteConfirm = () => {
    onDelete(task.id);
    setDeleteConfirmOpen(false);
    onClose();
  };

  const attachments = task.attachments || [];
  const comments = task.comments || [];
  const currentColorName =
    cardColors.find((c) => c.value === task.cardColor)?.name || 'Default';

  // Shared small label style
  const smallLabelStyle = {
    fontFamily: 'Poppins, sans-serif !important',
    fontSize: '0.65rem',
    fontWeight: 500,
    color: '#6B7280',
    mb: 0.5,
    display: 'block',
  } as const;

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: '90vh',
            overflow: 'hidden',
            p: 0,
          },
        }}
      >
        {/* Header Row — Status + Priority + Start + End + Close */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 1,
            p: 2,
            pb: 1.5,
            borderBottom: '1px solid #E5E7EB',
            flexWrap: 'wrap',
            rowGap: 1.5,
          }}
        >
          {/* Status */}
          <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 120, flex: { xs: '1 1 auto', sm: '0 0 auto' } }}>
            <Typography sx={smallLabelStyle}>Status</Typography>
            <FormControl size="small" fullWidth>
              <Select
                value={task.columnId || 'todo'}
                onChange={(e) => handleStatusChange(e.target.value as ColumnId)}
                sx={{
                  borderRadius: 1.5,
                  height: 34,
                  '& .MuiSelect-select': {
                    fontFamily: 'Poppins, sans-serif !important',
                    fontSize: '0.75rem',
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
                    {col.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Priority */}
          <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 110, flex: { xs: '1 1 auto', sm: '0 0 auto' } }}>
            <Typography sx={smallLabelStyle}>Priority</Typography>
            <FormControl size="small" fullWidth>
              <Select
                value={task.priority || 'medium'}
                onChange={(e) => handlePriorityChange(e.target.value as Priority)}
                sx={{
                  borderRadius: 1.5,
                  height: 34,
                  '& .MuiSelect-select': {
                    fontFamily: 'Poppins, sans-serif !important',
                    fontSize: '0.75rem',
                    py: 0.5,
                    px: 1,
                  },
                }}
              >
                {Object.entries(priorityLabels).map(([value, label]) => (
                  <MenuItem
                    key={value}
                    value={value}
                    sx={{
                      fontFamily: 'Poppins, sans-serif !important',
                      fontSize: '0.75rem',
                    }}
                  >
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Start Date */}
          <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 130, flex: { xs: '1 1 auto', sm: '0 0 auto' } }}>
            <Typography sx={smallLabelStyle}>Start Date</Typography>
            <TextField
              type="date"
              size="small"
              value={editStartDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: 1.5, height: 34 },
                '& .MuiOutlinedInput-input': {
                  fontFamily: 'Poppins, sans-serif !important',
                  fontSize: '0.72rem',
                  py: 0.5,
                  px: 1,
                },
                '& input[type="date"]::-webkit-datetime-edit': {
                  visibility: editStartDate ? 'visible' : 'hidden',
                },
              }}
            />
          </Box>

          {/* End Date */}
          <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 130, flex: { xs: '1 1 auto', sm: '0 0 auto' } }}>
            <Typography sx={smallLabelStyle}>End Date</Typography>
            <TextField
              type="date"
              size="small"
              value={editEndDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: 1.5, height: 34 },
                '& .MuiOutlinedInput-input': {
                  fontFamily: 'Poppins, sans-serif !important',
                  fontSize: '0.72rem',
                  py: 0.5,
                  px: 1,
                },
                '& input[type="date"]::-webkit-datetime-edit': {
                  visibility: editEndDate ? 'visible' : 'hidden',
                },
              }}
            />
          </Box>

          {/* Close */}
          <Box sx={{ ml: 'auto', alignSelf: 'flex-start' }}>
            <IconButton onClick={onClose} size="small" sx={{ p: 0.5 }}>
              <CloseIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </Box>

        <DialogContent sx={{ p: 2, overflowY: 'auto' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Card Image */}
            <Box>
              <Typography sx={smallLabelStyle}>Card Image</Typography>
              {editCardImage ? (
                <Box>
                  <Box
                    sx={{
                      width: '100%',
                      height: 180,
                      borderRadius: 1.5,
                      overflow: 'hidden',
                      border: '1px solid #E5E7EB',
                      bgcolor: '#F9FAFB',
                      position: 'relative',
                    }}
                  >
                    <Box
                      component="img"
                      src={editCardImage}
                      alt="Card"
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {/* Overlay on hover */}
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        bgcolor: 'rgba(0,0,0,0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        opacity: 0,
                        transition: 'opacity 0.2s ease',
                        '&:hover': { opacity: 1 },
                      }}
                    >
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<UploadIcon sx={{ fontSize: 14 }} />}
                        onClick={() => imageInputRef.current?.click()}
                        sx={{
                          fontFamily: 'Poppins, sans-serif !important',
                          textTransform: 'none',
                          fontSize: '0.7rem',
                          borderRadius: 1.5,
                          bgcolor: '#FFFFFF',
                          color: '#111827',
                          '&:hover': { bgcolor: '#F3F4F6' },
                        }}
                      >
                        Replace
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<DeleteIcon sx={{ fontSize: 14 }} />}
                        onClick={handleRemoveImage}
                        sx={{
                          fontFamily: 'Poppins, sans-serif !important',
                          textTransform: 'none',
                          fontSize: '0.7rem',
                          borderRadius: 1.5,
                          bgcolor: '#DC2626',
                          color: '#FFFFFF',
                          '&:hover': { bgcolor: '#B91C1C' },
                        }}
                      >
                        Remove
                      </Button>
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Paper
                  elevation={0}
                  onClick={() => imageInputRef.current?.click()}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    p: 2,
                    border: '2px dashed #D1D5DB',
                    borderRadius: 1.5,
                    bgcolor: '#FAFAFA',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      borderColor: '#9CA3AF',
                      bgcolor: '#F3F4F6',
                    },
                  }}
                >
                  <ImageIcon sx={{ fontSize: 20, color: '#6B7280' }} />
                  <Typography
                    sx={{
                      fontFamily: 'Poppins, sans-serif !important',
                      fontSize: '0.75rem',
                      color: '#6B7280',
                      fontWeight: 500,
                    }}
                  >
                    Click to upload image
                  </Typography>
                </Paper>
              )}
              <input
                ref={imageInputRef}
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Box>

            {/* Title */}
            <Box>
              <Typography sx={smallLabelStyle}>Title</Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Task title"
                value={editTitle}
                onChange={(e) => handleTitleChange(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: 1.5 },
                  '& .MuiOutlinedInput-input': {
                    fontFamily: 'Poppins, sans-serif !important',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    py: 1,
                    px: 1.5,
                  },
                }}
              />
            </Box>

            {/* Description */}
            <Box>
              <Typography sx={smallLabelStyle}>Description</Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                size="small"
                placeholder="Add a description..."
                value={editDescription}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: 1.5 },
                  '& .MuiOutlinedInput-input': {
                    fontFamily: 'Poppins, sans-serif !important',
                    fontSize: '0.78rem',
                    py: 1,
                    px: 1.5,
                  },
                }}
              />
            </Box>

            {/* Card Color (left) + Assignees (right) */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2,
              }}
            >
              {/* Card Color */}
              <Box>
                <Typography sx={smallLabelStyle}>Card Color</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                  {cardColors.map((color) => (
                    <Box
                      key={color.value}
                      onClick={() => handleCardColorChange(color.value)}
                      sx={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        bgcolor: color.value,
                        border:
                          task.cardColor === color.value
                            ? '3px solid #111827'
                            : `2px solid ${color.borderColor}`,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        '&:hover': { transform: 'scale(1.1)' },
                      }}
                    />
                  ))}
                </Box>
                <Typography
                  sx={{
                    fontFamily: 'Poppins, sans-serif !important',
                    fontSize: '0.65rem',
                    color: '#6B7280',
                    mt: 0.75,
                  }}
                >
                  {currentColorName}
                </Typography>
              </Box>

              {/* Assignees */}
              <Box>
                <Typography sx={smallLabelStyle}>Assignees</Typography>
                <MemberMultiSelect
                  value={editMembers}
                  onChange={handleMembersChange}
                  placeholder="Add members..."
                />
              </Box>
            </Box>

            {/* Attachments */}
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 0.75,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'Poppins, sans-serif !important',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#111827',
                  }}
                >
                  Attachments ({attachments.length})
                </Typography>
                <Button
                  size="small"
                  startIcon={<PaperclipIcon sx={{ fontSize: 14 }} />}
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    fontFamily: 'Poppins, sans-serif !important',
                    textTransform: 'none',
                    fontSize: '0.7rem',
                    borderRadius: 1.5,
                  }}
                >
                  Add file
                </Button>
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
              </Box>

              {attachments.length > 0 ? (
                <Box
                  sx={{
                    border: '1px solid #E5E7EB',
                    borderRadius: 1.5,
                    overflow: 'hidden',
                  }}
                >
                  {attachments.map((attachment, index) => (
                    <Box
                      key={attachment.id}
                      onClick={() => handleDownloadFile(attachment)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        px: 1.25,
                        py: 1,
                        borderBottom:
                          index === attachments.length - 1
                            ? 'none'
                            : '1px solid #F3F4F6',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease',
                        '&:hover': { bgcolor: '#F9FAFB' },
                      }}
                    >
                      <PaperclipIcon sx={{ fontSize: 15, color: '#6B7280' }} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontFamily: 'Poppins, sans-serif !important',
                            fontSize: '0.72rem',
                            fontWeight: 500,
                            color: '#111827',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {attachment.name}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: 'Poppins, sans-serif !important',
                            fontSize: '0.62rem',
                            color: '#6B7280',
                          }}
                        >
                          {attachment.size}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile(attachment.id);
                        }}
                        sx={{
                          p: 0.5,
                          color: '#9CA3AF',
                          '&:hover': { color: '#DC2626', bgcolor: '#FEF2F2' },
                        }}
                      >
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography
                  sx={{
                    fontFamily: 'Poppins, sans-serif !important',
                    fontSize: '0.7rem',
                    color: '#9CA3AF',
                    textAlign: 'center',
                    py: 2,
                    border: '1px dashed #E5E7EB',
                    borderRadius: 1.5,
                  }}
                >
                  No attachments yet
                </Typography>
              )}
            </Box>

            {/* Comments — ONE unified box */}
            <Box>
              <Typography
                sx={{
                  fontFamily: 'Poppins, sans-serif !important',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#111827',
                  mb: 0.75,
                }}
              >
                Comments ({comments.length})
              </Typography>

              {/* Unified Comments Container */}
              <Box
                sx={{
                  border: '1px solid #E5E7EB',
                  borderRadius: 2,
                  overflow: 'hidden',
                  bgcolor: '#FFFFFF',
                }}
              >
                {/* Comments List (scrollable) */}
                {comments.length > 0 && (
                  <Box
                    sx={{
                      maxHeight: 260,
                      overflowY: 'auto',
                      '&::-webkit-scrollbar': { width: 5 },
                      '&::-webkit-scrollbar-thumb': {
                        bgcolor: '#E5E7EB',
                        borderRadius: 3,
                      },
                    }}
                  >
                    <List disablePadding dense>
                      {comments.map((c, idx) => (
                        <ListItem
                          key={c.id}
                          sx={{
                            alignItems: 'flex-start',
                            py: 1.25,
                            px: 1.5,
                            borderBottom:
                              idx === comments.length - 1
                                ? 'none'
                                : '1px solid #F3F4F6',
                          }}
                        >
                          <Avatar
                            src={c.avatar}
                            sx={{ width: 26, height: 26, mr: 1 }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.75,
                                mb: 0.25,
                                flexWrap: 'wrap',
                              }}
                            >
                              <Typography
                                sx={{
                                  fontFamily: 'Poppins, sans-serif !important',
                                  fontSize: '0.72rem',
                                  fontWeight: 600,
                                  color: '#111827',
                                }}
                              >
                                {c.author}
                              </Typography>
                              <Typography
                                sx={{
                                  fontFamily: 'Poppins, sans-serif !important',
                                  fontSize: '0.6rem',
                                  color: '#9CA3AF',
                                }}
                              >
                                {format(new Date(c.timestamp), 'MMM d, yyyy • h:mm a')}
                              </Typography>
                            </Box>
                            <Typography
                              sx={{
                                fontFamily: 'Poppins, sans-serif !important',
                                fontSize: '0.72rem',
                                color: '#374151',
                                lineHeight: 1.5,
                              }}
                            >
                              {c.content}
                            </Typography>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Empty state */}
                {comments.length === 0 && (
                  <Box
                    sx={{
                      py: 2.5,
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'Poppins, sans-serif !important',
                        fontSize: '0.7rem',
                        color: '#9CA3AF',
                      }}
                    >
                      No comments yet. Start the conversation!
                    </Typography>
                  </Box>
                )}

                {/* Divider between list and input */}
                <Box sx={{ height: '1px', bgcolor: '#F3F4F6' }} />

                {/* Input + Send at bottom */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    px: 1.5,
                    py: 1,
                    gap: 1,
                  }}
                >
                  <TextField
                    fullWidth
                    variant="standard"
                    size="small"
                    placeholder="Write a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment();
                      }
                    }}
                    InputProps={{
                      disableUnderline: true,
                    }}
                    sx={{
                      '& .MuiInputBase-input': {
                        fontFamily: 'Poppins, sans-serif !important',
                        fontSize: '0.75rem',
                        py: 0.75,
                        px: 0.5,
                      },
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={handleAddComment}
                    disabled={!comment.trim()}
                    sx={{
                      bgcolor: comment.trim() ? '#111827' : 'transparent',
                      color: comment.trim() ? '#FFFFFF' : '#9CA3AF',
                      '&:hover': {
                        bgcolor: comment.trim() ? '#374151' : 'transparent',
                      },
                      '&.Mui-disabled': {
                        color: '#D1D5DB',
                      },
                      width: 30,
                      height: 30,
                    }}
                  >
                    <SendIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation (still used if needed internally) */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 2, maxWidth: 340 } }}
      >
        <DialogTitle
          sx={{
            fontFamily: 'Poppins, sans-serif !important',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          Delete Task?
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{ fontFamily: 'Poppins, sans-serif !important', fontSize: '0.75rem' }}
          >
            Are you sure you want to delete this task? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setDeleteConfirmOpen(false)}
            size="small"
            sx={{
              fontFamily: 'Poppins, sans-serif !important',
              textTransform: 'none',
              fontSize: '0.75rem',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            size="small"
            sx={{
              textTransform: 'none',
              fontFamily: 'Poppins, sans-serif !important',
              fontSize: '0.75rem',
              borderRadius: 1.5,
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}