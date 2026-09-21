// src/components/Notepad/NoteCard.tsx
import { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Paper,
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  PushPin as PinIcon,
  PushPinOutlined as UnpinIcon,
  Palette as PaletteIcon,
  CalendarToday as CalendarIcon,
  AttachFile as AttachFileIcon,
} from '@mui/icons-material';
import { Note, NOTE_COLORS } from '../../types/note';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;        // ✅ RESTORED
  onCopy: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onPin: (noteId: string) => void;
  onColorChange: (noteId: string, color: string) => void;
}

export function NoteCard({
  note,
  onEdit,                              // ✅ RESTORED
  onCopy,
  onDelete,
  onPin,
  onColorChange,
}: NoteCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [colorMenuAnchor, setColorMenuAnchor] = useState<null | HTMLElement>(null);

  const menuOpen = Boolean(anchorEl);
  const colorMenuOpen = Boolean(colorMenuAnchor);

  const colorConfig = NOTE_COLORS.find((c) => c.value === note.color) || NOTE_COLORS[0];

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleColorMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setColorMenuAnchor(e.currentTarget);
    setAnchorEl(null);
  };

  const handleColorMenuClose = () => {
    setColorMenuAnchor(null);
  };

  const handleColorSelect = (color: string) => {
    onColorChange(note.id, color);
    handleColorMenuClose();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const attachments = (note as any).attachments || [];

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: colorConfig.value,
        border: `1px solid ${colorConfig.border}`,
        borderRadius: 2,
        p: 2,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
        minHeight: 180,
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        },
      }}
      onClick={() => onEdit(note)}     // ✅ RESTORED
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 0.5,
          mb: 1,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            fontFamily: 'Poppins, sans-serif !important',
            fontSize: '0.9rem',
            color: colorConfig.text,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.3,
            flex: 1,
            minWidth: 0,
          }}
        >
          {note.title || 'Untitled Note'}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, flexShrink: 0 }}>
          {note.isPinned && (
            <Tooltip title="Pinned">
              <PinIcon
                sx={{
                  fontSize: 16,
                  color: colorConfig.text,
                  opacity: 0.7,
                  transform: 'rotate(45deg)',
                }}
              />
            </Tooltip>
          )}
          <IconButton
            size="small"
            onClick={handleMenuOpen}
            sx={{
              width: 24,
              height: 24,
              color: colorConfig.text,
              opacity: 0.6,
              '&:hover': {
                opacity: 1,
                bgcolor: 'rgba(0,0,0,0.05)',
              },
            }}
          >
            <MoreVertIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </Box>

      {/* Content */}
      <Typography
        variant="body2"
        sx={{
          fontFamily: 'Poppins, sans-serif !important',
          fontSize: '0.75rem',
          color: colorConfig.text,
          opacity: 0.8,
          mb: 2,
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          lineHeight: 1.5,
          whiteSpace: 'pre-wrap',
        }}
      >
        {note.content || 'No content'}
      </Typography>

      <Divider sx={{ mb: 1, borderColor: colorConfig.border, opacity: 0.4 }} />

      {/* Footer */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <CalendarIcon sx={{ fontSize: 12, color: colorConfig.text, opacity: 0.6 }} />
          <Typography
            sx={{
              fontFamily: 'Poppins, sans-serif !important',
              fontSize: '0.6rem',
              color: colorConfig.text,
              opacity: 0.7,
            }}
          >
            {formatDate(note.updatedAt)}
          </Typography>
          {attachments.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, ml: 0.5 }}>
              <AttachFileIcon sx={{ fontSize: 11, color: colorConfig.text, opacity: 0.6 }} />
              <Typography
                sx={{
                  fontFamily: 'Poppins, sans-serif !important',
                  fontSize: '0.6rem',
                  color: colorConfig.text,
                  opacity: 0.7,
                }}
              >
                {attachments.length}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 0.25 }}>
          <Tooltip title="Copy">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onCopy(note);
              }}
              sx={{
                width: 24,
                height: 24,
                color: colorConfig.text,
                '&:hover': { bgcolor: 'rgba(0,0,0,0.08)' },
              }}
            >
              <CopyIcon sx={{ fontSize: 13 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
              sx={{
                width: 24,
                height: 24,
                color: '#DC2626',
                '&:hover': { bgcolor: 'rgba(220,38,38,0.08)' },
              }}
            >
              <DeleteIcon sx={{ fontSize: 13 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* 3-dot menu */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          sx: { borderRadius: 2, minWidth: 160 },
        }}
      >
       
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            onPin(note.id);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            {note.isPinned ? <UnpinIcon fontSize="small" /> : <PinIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText
            primary={note.isPinned ? 'Unpin Note' : 'Pin Note'}
            primaryTypographyProps={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '0.8rem',
            }}
          />
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            onCopy(note);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <CopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Duplicate"
            primaryTypographyProps={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '0.8rem',
            }}
          />
        </MenuItem>
        <MenuItem onClick={handleColorMenuOpen}>
          <ListItemIcon>
            <PaletteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Change Color"
            primaryTypographyProps={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '0.8rem',
            }}
          />
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.id);
            handleMenuClose();
          }}
          sx={{ color: '#DC2626' }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: '#DC2626' }} />
          </ListItemIcon>
          <ListItemText
            primary="Delete"
            primaryTypographyProps={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '0.8rem',
            }}
          />
        </MenuItem>
      </Menu>

      {/* Color Menu */}
      <Menu
        anchorEl={colorMenuAnchor}
        open={colorMenuOpen}
        onClose={handleColorMenuClose}
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          sx: { borderRadius: 2, p: 1 },
        }}
      >
        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', maxWidth: 180 }}>
          {NOTE_COLORS.map((color) => (
            <Box
              key={color.value}
              onClick={(e) => {
                e.stopPropagation();
                handleColorSelect(color.value);
              }}
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                bgcolor: color.value,
                border:
                  note.color === color.value
                    ? '3px solid #111827'
                    : `2px solid ${color.border}`,
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.15)',
                },
              }}
            />
          ))}
        </Box>
      </Menu>
    </Paper>
  );
}