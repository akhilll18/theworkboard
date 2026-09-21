// src/components/Kanban/CreateListDialog.tsx
import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface CreateListDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (title: string) => void;
}

export function CreateListDialog({ open, onClose, onCreate }: CreateListDialogProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) return;
    onCreate(title.trim());
    setTitle('');
    onClose();
  };

  const handleClose = () => {
    setTitle('');
    onClose();
  };

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
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 3,
          pb: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontFamily: '"Google Sans", sans-serif !important',
          }}
        >
          Create New List
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, pt: 2 }}>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontFamily: '"Google Sans", sans-serif !important',
            mb: 2,
          }}
        >
          Enter a name for your new list/column
        </Typography>
        <TextField
          fullWidth
          autoFocus
          placeholder="List name (e.g., Sprint 23, Backlog, etc.)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
        />
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          pt: 0,
          gap: 1,
        }}
      >
        <Button
          onClick={handleClose}
          sx={{
            fontFamily: '"Google Sans", sans-serif !important',
            textTransform: 'none',
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!title.trim()}
          sx={{
            fontFamily: '"Google Sans", sans-serif !important',
            textTransform: 'none',
            borderRadius: 2,
            px: 4,
          }}
        >
          Create List
        </Button>
      </DialogActions>
    </Dialog>
  );
}