// src/components/Kanban/KanbanBoard.tsx
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Chip,
  Card,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Add as PlusIcon,
  Comment as MessageCircleIcon,
  AttachFile as PaperclipIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Task, Priority, ColumnId } from '../../types/kanban';
import { initialTasks } from '../../data/kanbanData';

interface KanbanBoardProps {
  onTaskClick: (task: Task) => void;
  onAddTask: (columnId: ColumnId) => void;
  tasks?: Record<ColumnId, Task[]>;
  onColumnRename?: (columnId: ColumnId, newName: string) => void;
  onColumnCopy?: (columnId: ColumnId) => void;
  onColumnDelete?: (columnId: ColumnId) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  customColumns?: { id: string; title: string; color: string; dotColor: string }[];
}

// ✅ Format YYYY-MM-DD → DD/MM
const formatDateShort = (dateStr?: string): string => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [, month, day] = parts;
  return `${day}/${month}`;
};

const priorityLabels: Record<Priority, string> = {
  low: 'Low Priority',
  medium: 'Medium Priority',
  high: 'High Priority',
};

const priorityStyles: Record<Priority, { bg: string; color: string; border: string }> = {
  low: { bg: '#F0FDF4', color: '#166534', border: '#86EFAC' },
  medium: { bg: '#FFFBEB', color: '#92400E', border: '#FCD34D' },
  high: { bg: '#FEF2F2', color: '#991B1B', border: '#FCA5A5' },
};

const statusStyles: Record<string, { bg: string; color: string; border: string }> = {
  todo: { bg: '#F3F4F6', color: '#374151', border: '#E5E7EB' },
  inProgress: { bg: '#EFF6FF', color: '#1E40AF', border: '#93C5FD' },
  review: { bg: '#F5F3FF', color: '#5B21B6', border: '#C4B5FD' },
  done: { bg: '#F0FDF4', color: '#166534', border: '#86EFAC' },
};

const columnDisplayNames: Record<string, string> = {
  todo: 'To Do',
  inProgress: 'In Progress',
  review: 'Review',
  done: 'Done',
};

let columnConfig: Record<ColumnId, { title: string; color: string; dotColor: string }> = {
  todo: { title: 'To Do', color: '#6B7280', dotColor: '#6B7280' },
  inProgress: { title: 'In Progress', color: '#3B82F6', dotColor: '#3B82F6' },
  review: { title: 'Review', color: '#8B5CF6', dotColor: '#8B5CF6' },
  done: { title: 'Done', color: '#10B981', dotColor: '#10B981' },
};

export function KanbanBoard({
  onTaskClick,
  onAddTask,
  tasks: externalTasks,
  onColumnRename,
  onColumnDelete,
  onEditTask,
  onDeleteTask,
  customColumns = [],
}: KanbanBoardProps) {
  const columns = externalTasks || initialTasks;
  const [localColumns, setLocalColumns] = useState<Record<ColumnId, Task[]>>(columns);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<ColumnId | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    if (externalTasks) {
      setLocalColumns(externalTasks);
    }
  }, [externalTasks]);

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameColumnId, setRenameColumnId] = useState<ColumnId | null>(null);
  const [newColumnName, setNewColumnName] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteColumnId, setDeleteColumnId] = useState<ColumnId | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const displayColumns = localColumns;

  const getColumnTasks = (columnId: ColumnId): Task[] => {
    return displayColumns[columnId] || [];
  };

  const getColumnTitle = (columnId: ColumnId): string => {
    const customCol = customColumns.find((c) => c.id === columnId);
    if (customCol) return customCol.title;
    return columnConfig[columnId]?.title || columnId;
  };

  const getColumnDotColor = (columnId: ColumnId): string => {
    const customCol = customColumns.find((c) => c.id === columnId);
    if (customCol) return customCol.dotColor;
    return columnConfig[columnId]?.dotColor || '#6B7280';
  };

  const isFixedColumn = (columnId: string) =>
    ['todo', 'inProgress', 'review', 'done'].includes(columnId);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: React.DragEvent, columnId: ColumnId, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: ColumnId, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();

    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId) {
      setDragOverColumn(null);
      setDragOverIndex(null);
      return;
    }

    let draggedTask: Task | null = null;
    let sourceColumn: ColumnId | null = null;
    let sourceIndex: number = -1;

    for (const colId of Object.keys(displayColumns) as ColumnId[]) {
      const tasks = displayColumns[colId];
      const index = tasks.findIndex((t) => t.id === taskId);
      if (index !== -1) {
        draggedTask = tasks[index];
        sourceColumn = colId;
        sourceIndex = index;
        break;
      }
    }

    if (!draggedTask || sourceColumn === null || sourceIndex === -1) {
      setDragOverColumn(null);
      setDragOverIndex(null);
      setDraggedTaskId(null);
      return;
    }

    if (sourceColumn === targetColumnId && sourceIndex === targetIndex) {
      setDragOverColumn(null);
      setDragOverIndex(null);
      setDraggedTaskId(null);
      return;
    }

    setLocalColumns((prev) => {
      const newColumns = { ...prev };
      const sourceTasks = [...newColumns[sourceColumn!]];
      const [removedTask] = sourceTasks.splice(sourceIndex, 1);

      if (sourceColumn === targetColumnId) {
        const targetTasks = [...sourceTasks];
        targetTasks.splice(targetIndex, 0, removedTask);
        newColumns[targetColumnId] = targetTasks;
      } else {
        const targetTasks = [...newColumns[targetColumnId]];
        const updatedTask = { ...removedTask, columnId: targetColumnId };
        targetTasks.splice(targetIndex, 0, updatedTask);
        newColumns[sourceColumn!] = sourceTasks;
        newColumns[targetColumnId] = targetTasks;
      }

      return newColumns;
    });

    setDragOverColumn(null);
    setDragOverIndex(null);
    setDraggedTaskId(null);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverColumn(null);
    setDragOverIndex(null);
  };

  const handleRenameClick = (columnId: ColumnId) => {
    setRenameColumnId(columnId);
    setNewColumnName(getColumnTitle(columnId));
    setRenameDialogOpen(true);
  };

  const handleRenameConfirm = () => {
    if (renameColumnId && newColumnName.trim()) {
      const columnId = renameColumnId;
      const newName = newColumnName.trim();

      const customCol = customColumns.find((c) => c.id === columnId);
      if (customCol) {
        customCol.title = newName;
      } else if (columnConfig[columnId]) {
        columnConfig[columnId] = { ...columnConfig[columnId], title: newName };
      }

      if (onColumnRename) {
        onColumnRename(columnId, newName);
      }

      setSnackbar({
        open: true,
        message: `Column renamed to "${newName}"`,
        severity: 'success',
      });
    }
    setRenameDialogOpen(false);
    setRenameColumnId(null);
    setNewColumnName('');
  };

  const handleDeleteClick = (columnId: ColumnId) => {
    setDeleteColumnId(columnId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteColumnId) {
      const columnId = deleteColumnId;
      const taskCount = displayColumns[columnId]?.length || 0;

      const newColumns = { ...displayColumns };
      delete newColumns[columnId];
      setLocalColumns(newColumns);

      const customIndex = customColumns.findIndex((c) => c.id === columnId);
      if (customIndex !== -1) {
        customColumns.splice(customIndex, 1);
      } else {
        delete columnConfig[columnId];
      }

      if (onColumnDelete) {
        onColumnDelete(columnId);
      }

      setSnackbar({
        open: true,
        message: `Column deleted with ${taskCount} tasks`,
        severity: 'success',
      });
    }
    setDeleteDialogOpen(false);
    setDeleteColumnId(null);
  };

  const handleTaskDelete = (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    if (onDeleteTask) {
      onDeleteTask(taskId);
      return;
    }
    setLocalColumns((prev) => {
      const newCols = { ...prev };
      Object.keys(newCols).forEach((key) => {
        newCols[key as ColumnId] = newCols[key as ColumnId].filter(
          (t) => t.id !== taskId
        );
      });
      return newCols;
    });
    setSnackbar({
      open: true,
      message: 'Task deleted',
      severity: 'success',
    });
  };

  const getAllColumns = () => {
    const fixed = Object.entries(columnConfig);
    const custom = customColumns.map(
      (col) =>
        [col.id, col] as [string, { title: string; color: string; dotColor: string }]
    );
    return [...fixed, ...custom];
  };

  const allColumns = getAllColumns();

  // =============================================================
  // RENDER CARD
  // =============================================================
  const renderCard = (task: Task, colId: ColumnId, index: number) => {
    const priorityStyle = priorityStyles[task.priority] || priorityStyles.medium;
    const isDone = colId === 'done';
    const isDragging = draggedTaskId === task.id;
    const isCustomCol = !isFixedColumn(colId);

    const statusStyle = statusStyles[colId];
    const statusLabel = columnDisplayNames[colId];

    const cardImage = (task as any).cardImage;
    const cardBgColor = task.cardColor || '#FFFFFF';
    const attachmentsCount = task.attachments?.length || 0;
    const commentsCount = task.comments?.length || 0;
    const assignees = task.assignees || [];
    const visibleAssignees = assignees.slice(0, 2);
    const extraCount = assignees.length - 2;

    // Date range
    const hasDateRange = task.startDate && task.endDate;

    return (
      <motion.div
        key={task.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        draggable
        onDragStart={(e) => handleDragStart(e, task.id)}
        onDragEnd={handleDragEnd}
        onDragOver={(e) => handleDragOver(e, colId, index)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, colId, index)}
        style={{
          cursor: 'grab',
          opacity: isDragging ? 0.4 : 1,
          borderTop:
            dragOverColumn === colId && dragOverIndex === index && !isDragging
              ? '2px solid #3B82F6'
              : '2px solid transparent',
          borderBottom:
            dragOverColumn === colId && dragOverIndex === index + 1 && !isDragging
              ? '2px solid #3B82F6'
              : '2px solid transparent',
        }}
      >
        <Card
          elevation={0}
          onClick={() => onTaskClick(task)}
          sx={{
            borderRadius: 2,
            border: '1px solid #E5E7EB',
            bgcolor: cardBgColor,   // ✅ Card color applied
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            overflow: 'hidden',
            '&:hover': {
              borderColor: '#D1D5DB',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            },
          }}
        >
          <Box sx={{ p: 1.25 }}>
            {/* Row 1: Date (left) + Delete (right) */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'Poppins, sans-serif !important',
                  fontSize: '0.65rem',
                  color: '#6B7280',
                  fontWeight: 500,
                }}
              >
                {task.startDate || task.dueDate || '2026-09-07'}
              </Typography>
              <IconButton
                size="small"
                onClick={(e) => handleTaskDelete(e, task.id)}
                sx={{
                  width: 20,
                  height: 20,
                  color: '#9CA3AF',
                  p: 0.25,
                  '&:hover': { color: '#DC2626', bgcolor: '#FEF2F2' },
                }}
              >
                <DeleteIcon sx={{ fontSize: 13 }} />
              </IconButton>
            </Box>

            {/* Image */}
            {cardImage && (
              <Box
                sx={{
                  width: '100%',
                  height: 110,
                  borderRadius: 1.5,
                  overflow: 'hidden',
                  mb: 1.25,
                  bgcolor: '#F3F4F6',
                }}
              >
                <Box
                  component="img"
                  src={cardImage}
                  alt=""
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </Box>
            )}

            {/* Title */}
            <Typography
              sx={{
                fontFamily: 'Poppins, sans-serif !important',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#111827',
                lineHeight: 1.35,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                mb: 0.5,
              }}
            >
              {task.title || 'Untitled Task'}
            </Typography>

            {/* Description */}
            {task.description && task.description !== 'No description' && (
              <Typography
                sx={{
                  fontFamily: 'Poppins, sans-serif !important',
                  fontSize: '0.68rem',
                  color: '#6B7280',
                  lineHeight: 1.45,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  mb: 1,
                }}
              >
                {task.description}
              </Typography>
            )}

            {/* ✅ Row: Status + Priority + Date Range (all in ONE ROW) */}
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 0.2,
                mb: 1,
              }}
            >
              {/* 1. Status Badge — hidden for custom columns and done */}
              {!isCustomCol && !isDone && statusStyle && (
                <Chip
                  label={statusLabel}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.6rem',
                    fontFamily: 'Poppins, sans-serif !important',
                    fontWeight: 500,
                    bgcolor: statusStyle.bg,
                    color: statusStyle.color,
                    border: `1px solid ${statusStyle.border}`,
                    '& .MuiChip-label': { px: 0.75 },
                  }}
                />
              )}

              {/* 2. Priority Badge (or Complete) */}
              {isDone ? (
                <Chip
                  icon={<CheckCircleIcon sx={{ fontSize: 12 }} />}
                  label="Complete"
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.6rem',
                    fontFamily: 'Poppins, sans-serif !important',
                    fontWeight: 500,
                    bgcolor: '#F0FDF4',
                    color: '#166534',
                    border: '1px solid #86EFAC',
                    '& .MuiChip-icon': { color: '#16A34A', ml: 0.5, mr: -0.5 },
                    '& .MuiChip-label': { px: 0.75 },
                  }}
                />
              ) : (
                <Chip
                  label={priorityLabels[task.priority]}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.6rem',
                    fontFamily: 'Poppins, sans-serif !important',
                    fontWeight: 500,
                    bgcolor: priorityStyle.bg,
                    color: priorityStyle.color,
                    border: `1px solid ${priorityStyle.border}`,
                    '& .MuiChip-label': { px: 0.75 },
                  }}
                />
              )}

              {/* 3. Date Range Badge — NEW */}
              {hasDateRange && (
                <Chip
                  label={`${formatDateShort(task.startDate)} - ${formatDateShort(task.endDate)}`}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.6rem',
                    fontFamily: 'Poppins, sans-serif !important',
                    fontWeight: 500,
                    bgcolor: '#ff0000',
                    color: '#fdfdfd',
                    border: '1px solid #E5E7EB',
                    '& .MuiChip-label': { px: 0.75 },
                  }}
                />
              )}
            </Box>

            {/* Divider */}
            <Box
              sx={{
                height: '1px',
                bgcolor: 'rgba(0,0,0,0.06)',
                my: 1,
              }}
            />

            {/* Footer: attachment + comment (left) | assignees (right) */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 1,
                minHeight: 22,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {attachmentsCount > 0 && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.25,
                      color: '#6B7280',
                    }}
                  >
                    <PaperclipIcon sx={{ fontSize: 12 }} />
                    <Typography
                      sx={{
                        fontFamily: 'Poppins, sans-serif !important',
                        fontSize: '0.65rem',
                        fontWeight: 500,
                      }}
                    >
                      {attachmentsCount}
                    </Typography>
                  </Box>
                )}
                {commentsCount > 0 && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.25,
                      color: '#6B7280',
                    }}
                  >
                    <MessageCircleIcon sx={{ fontSize: 12 }} />
                    <Typography
                      sx={{
                        fontFamily: 'Poppins, sans-serif !important',
                        fontSize: '0.65rem',
                        fontWeight: 500,
                      }}
                    >
                      {commentsCount}
                    </Typography>
                  </Box>
                )}
              </Box>

              {assignees.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {visibleAssignees.map((a, i) => (
                    <Avatar
                      key={a.name}
                      src={a.avatar}
                      sx={{
                        width: 20,
                        height: 20,
                        fontSize: '0.5rem',
                        border: '1.5px solid #FFFFFF',
                        ml: i > 0 ? -0.75 : 0,
                        bgcolor: '#E5E7EB',
                        color: '#374151',
                      }}
                    >
                      {a.name.charAt(0)}
                    </Avatar>
                  ))}
                  {extraCount > 0 && (
                    <Avatar
                      sx={{
                        width: 20,
                        height: 20,
                        fontSize: '0.5rem',
                        border: '1.5px solid #FFFFFF',
                        ml: -0.75,
                        bgcolor: '#F3F4F6',
                        color: '#6B7280',
                        fontWeight: 600,
                      }}
                    >
                      +{extraCount}
                    </Avatar>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </Card>
      </motion.div>
    );
  };

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 300,
              fontFamily: 'Poppins, sans-serif !important',
              color: 'text.primary',
            }}
          >
            Kanban Board
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontFamily: 'Poppins, sans-serif !important',
            }}
          >
            {`${Object.values(displayColumns).reduce(
              (acc, t) => acc + t.length,
              0
            )} cards across ${allColumns.length} columns`}
          </Typography>
        </Box>
       
      </Box>

      {/* Columns Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: 'repeat(4, 1fr)',
          },
          gap: { xs: 1, sm: 1, md: 1},
          alignItems: 'start',
          width: '100%',
        }}
      >
        {allColumns.map(([columnId, config]) => {
          const tasks = getColumnTasks(columnId as ColumnId);
          const colId = columnId as ColumnId;
          const columnTitle = config.title;
          const dotColor = getColumnDotColor(colId);

          return (
            <Paper
              key={columnId}
              elevation={0}
              sx={{
                bgcolor: '#F9FAFB',
                borderRadius: 2,
                p: 0.8,
                minHeight: 100,
                border: '1px solid #E5E7EB',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
              }}
              onDrop={(e) => {
                e.preventDefault();
                const taskId = e.dataTransfer.getData('text/plain');
                if (taskId) {
                  handleDrop(e, colId, tasks.length);
                }
              }}
            >
              {/* Column Header */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                 
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: dotColor,
                    flexShrink: 0,
                  }}
                />
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    fontFamily: 'Poppins, sans-serif !important',
                    color: '#111827',
                    fontSize: '0.85rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                  onClick={() => handleRenameClick(colId)}
                >
                  {columnTitle}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'Poppins, sans-serif !important',
                    fontSize: '0.75rem',
                    color: '#6B7280',
                    fontWeight: 500,
                  }}
                >
                  {tasks.length}
                </Typography>
              </Box>

              {/* Tasks */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  flex: 1,
                }}
              >
                <AnimatePresence>
                  {tasks.map((task, index) => renderCard(task, colId, index))}
                </AnimatePresence>
              </Box>

              {/* Add Card Button — bottom */}
              <Button
                fullWidth
                size="small"
                startIcon={<PlusIcon sx={{ fontSize: 14 }} />}
                onClick={() => onAddTask(colId)}
                sx={{
                  mt: 1.5,
                  py: 0.9,
                  fontFamily: 'Poppins, sans-serif !important',
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: '#6B7280',
                  border: '1.5px solid #D1D5DB',
                  borderRadius: 1,
                  bgcolor: 'transparent',
                  '&:hover': {
                    bgcolor: '#FFFFFF',
                    color: '#111827',
                    borderColor: '#9CA3AF',
                  },
                }}
              >
                Add Card
              </Button>
            </Paper>
          );
        })}
      </Box>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onClose={() => setRenameDialogOpen(false)}>
        <DialogTitle
          sx={{
            fontFamily: 'Poppins, sans-serif !important',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          Rename Column
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Column Name"
            type="text"
            fullWidth
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleRenameConfirm();
            }}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: 1.5 },
              '& .MuiOutlinedInput-input': {
                fontFamily: 'Poppins, sans-serif !important',
                fontSize: '0.8rem',
              },
              '& .MuiInputLabel-root': {
                fontFamily: 'Poppins, sans-serif !important',
                fontSize: '0.8rem',
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setRenameDialogOpen(false)}
            sx={{
              fontFamily: 'Poppins, sans-serif !important',
              textTransform: 'none',
              fontSize: '0.75rem',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRenameConfirm}
            variant="contained"
            disabled={!newColumnName.trim()}
            sx={{
              fontFamily: 'Poppins, sans-serif !important',
              textTransform: 'none',
              fontSize: '0.75rem',
              borderRadius: 1.5,
              bgcolor: '#111827',
              '&:hover': { bgcolor: '#374151' },
            }}
          >
            Rename
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle
          sx={{
            fontFamily: 'Poppins, sans-serif !important',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          Delete Column?
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{ fontFamily: 'Poppins, sans-serif !important', fontSize: '0.75rem' }}
          >
            Are you sure you want to delete this column? All cards in this column will also
            be deleted. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
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
            sx={{
              fontFamily: 'Poppins, sans-serif !important',
              textTransform: 'none',
              fontSize: '0.75rem',
              borderRadius: 1.5,
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ fontFamily: 'Poppins, sans-serif !important' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}