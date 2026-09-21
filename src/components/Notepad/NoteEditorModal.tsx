// src/components/Notepad/NoteEditorModal.tsx
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  PushPin as PinIcon,
  PushPinOutlined as UnpinIcon,
} from '@mui/icons-material';
import { Note, NOTE_COLORS } from '../../types/note';

interface NoteEditorModalProps {
  open: boolean;
  note: Note | null;
  onClose: () => void;
  onSave: (note: Partial<Note>) => void;
}

export function NoteEditorModal({ open, note, onClose, onSave }: NoteEditorModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState(NOTE_COLORS[0].value);
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setColor(note.color);
      setIsPinned(note.isPinned);
    } else {
      setTitle('');
      setContent('');
      setColor(NOTE_COLORS[0].value);
      setIsPinned(false);
    }
  }, [note, open]);

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;

    onSave({
      id: note?.id,
      title: title.trim() || 'Untitled Note',
      content: content.trim(),
      color,
      isPinned,
      createdAt: note?.createdAt,
      updatedAt: new Date().toISOString(),
    });

    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setContent('');
    setColor(NOTE_COLORS[0].value);
    setIsPinned(false);
    onClose();
  };

  const colorConfig = NOTE_COLORS.find((c) => c.value === color) || NOTE_COLORS[0];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 0,
          overflow: 'hidden',
          maxWidth: 400,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 1.5,
          pb: 1,
        
          bgcolor: colorConfig.value,
          borderBottom: `2px solid ${colorConfig.border}`,
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            fontFamily: 'Poppins, sans-serif !important',
            fontSize: '0.85rem',
            color: colorConfig.text,
          }}
        >
          {note ? 'Edit Note' : 'New Note'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.25 }}>
          <IconButton
            size="small"
            onClick={() => setIsPinned(!isPinned)}
            sx={{ color: colorConfig.text, p: 0.5 }}
          >
            {isPinned ? <PinIcon sx={{ fontSize: 16 }} /> : <UnpinIcon sx={{ fontSize: 16 }} />}
          </IconButton>
          <IconButton size="small" onClick={handleClose} sx={{ color: colorConfig.text, p: 0.5 }}>
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 1.5, pt: 1.5  }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          {/* Title */}
          <TextField
            fullWidth
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
            size="small"
            autoFocus
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5,
                mt: 1.5,
                fontSize: '0.8rem',
              },
              '& .MuiOutlinedInput-input': {
                fontFamily: 'Poppins, sans-serif !important',
                fontSize: '0.8rem',
                fontWeight: 500,
                py: 0.75,
                pt: 0.75,
              },
            }}
          />

          {/* Content */}
          <TextField
            fullWidth
            multiline
            rows={5}
            placeholder="Write your note here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5,
                fontSize: '0.75rem',
              },
              '& .MuiOutlinedInput-input': {
                fontFamily: 'Poppins, sans-serif !important',
                fontSize: '0.75rem',
                lineHeight: 1.5,
              },
            }}
          />

          {/* Color Picker */}
          <Box>
            <Typography
              sx={{
                color: '#6B7280',
                fontFamily: 'Poppins, sans-serif !important',
                display: 'block',
                mb: 0.5,
                fontSize: '0.65rem',
                fontWeight: 500,
              }}
            >
              Color
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {NOTE_COLORS.map((colorOption) => (
                <Box
                  key={colorOption.value}
                  onClick={() => setColor(colorOption.value)}
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: colorOption.value,
                    border: color === colorOption.value
                      ? '2px solid #111827'
                      : `1.5px solid ${colorOption.border}`,
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 1.5,
          pt: 1,
          borderTop: '1px solid',
          borderColor: 'divider',
          gap: 0.75,
        }}
      >
        <Button
          onClick={handleClose}
          size="small"
          sx={{
            fontFamily: 'Poppins, sans-serif !important',
            textTransform: 'none',
            fontSize: '0.75rem',
            py: 0.5,
            px: 1.5,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          size="small"
          disabled={!title.trim() && !content.trim()}
          sx={{
            fontFamily: 'Poppins, sans-serif !important',
            textTransform: 'none',
            borderRadius: 1.5,
            px: 2,
            py: 0.5,
            fontSize: '0.75rem',
            bgcolor: '#111827',
            '&:hover': { bgcolor: '#374151' },
          }}
        >
          {note ? 'Save' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}