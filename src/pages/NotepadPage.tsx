// src/pages/NotepadPage.tsx
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as NotepadIcon,
} from '@mui/icons-material';
import { NoteCard } from '../components/Notepad/NoteCard';
import { NoteEditorModal } from '../components/Notepad/NoteEditorModal';
import { Note } from '../types/note';
import { initialNotes } from '../data/notesData';
import { useSidebarState } from '../components/Layout/Layout';
import { useToast } from '../context/ToastContext';
import { format } from 'date-fns';

export function NotepadPage() {
  const { sidebarOpen, isMobile, isTablet, isDesktop } = useSidebarState();
  const { showToast } = useToast();

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('workora_notes');
    return saved ? JSON.parse(saved) : initialNotes;
  });
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  // Save to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('workora_notes', JSON.stringify(notes));
  }, [notes]);

  // Calculate grid columns based on sidebar state + screen size
  const getGridColumns = () => {
    if (isMobile) {
      return 'repeat(2, 1fr)';
    }
    if (isTablet) {
      return sidebarOpen ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)';
    }
    return sidebarOpen ? 'repeat(4, 1fr)' : 'repeat(5, 1fr)';
  };

  const handleCreateNote = () => {
    setSelectedNote(null);
    setEditorOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setEditorOpen(true);
  };

  const handleSaveNote = (noteData: Partial<Note>) => {
    if (noteData.id) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === noteData.id ? { ...n, ...noteData } as Note : n
        )
      );

      // ✅ TOAST: Note updated
      showToast(
        'Note has been updated',
        `"${noteData.title}" · ${format(new Date(), 'EEEE, MMMM do')}`,
        'success'
      );
    } else {
      const newNote: Note = {
        id: `note-${Date.now()}`,
        title: noteData.title || 'Untitled Note',
        content: noteData.content || '',
        color: noteData.color || '#FFFFFF',
        isPinned: noteData.isPinned || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setNotes((prev) => [newNote, ...prev]);

      // ✅ TOAST: Note created
      showToast(
        'Note has been created',
        `"${newNote.title}" · ${format(new Date(), 'EEEE, MMMM do')} at ${format(new Date(), 'h:mm a')}`,
        'success'
      );
    }
  };

  const handleCopyNote = (note: Note) => {
    const copiedNote: Note = {
      ...note,
      id: `note-${Date.now()}`,
      title: `${note.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes((prev) => [copiedNote, ...prev]);

    // ✅ TOAST: Note duplicated
    showToast(
      'Note has been duplicated',
      `"${copiedNote.title}"`,
      'success'
    );
  };

  const handleDeleteClick = (noteId: string) => {
    setNoteToDelete(noteId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (noteToDelete) {
      const deletedNote = notes.find((n) => n.id === noteToDelete);
      setNotes((prev) => prev.filter((n) => n.id !== noteToDelete));

      // ✅ TOAST: Note deleted
      showToast(
        'Note has been deleted',
        deletedNote ? `"${deletedNote.title}" was removed` : undefined,
        'info'
      );
    }
    setDeleteConfirmOpen(false);
    setNoteToDelete(null);
  };

  const handlePinNote = (noteId: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === noteId ? { ...n, isPinned: !n.isPinned, updatedAt: new Date().toISOString() } : n
      )
    );
  };

  const handleColorChange = (noteId: string, color: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === noteId ? { ...n, color, updatedAt: new Date().toISOString() } : n
      )
    );
  };

  // Sort notes - pinned first, then by updated date
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const totalNotes = notes.length;

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <NotepadIcon sx={{ fontSize: 28, color: '#111827' }} />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                fontFamily: 'Poppins, sans-serif !important',
                color: '#111827',
                fontSize: { xs: '1.5rem', sm: '1.75rem' },
              }}
            >
              Notepad
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: '#6B7280',
              fontFamily: 'Poppins, sans-serif !important',
              fontSize: '0.85rem',
            }}
          >
            {totalNotes === 0
              ? 'Create your first note'
              : `${totalNotes} note${totalNotes !== 1 ? 's' : ''}`}
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateNote}
          sx={{
            fontFamily: 'Poppins, sans-serif !important',
            textTransform: 'none',
            px: 2.5,
            py: 1,
            bgcolor: '#111827',
            fontSize: '0.85rem',
            borderRadius: 1.5,
            '&:hover': { bgcolor: '#374151' },
          }}
        >
          New Note
        </Button>
      </Box>

      {/* Notes Grid */}
      {sortedNotes.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: getGridColumns(),
            gap: { xs: 1, sm: 1, md: 1 },
          }}
        >
          {sortedNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={handleEditNote}
              onCopy={handleCopyNote}
              onDelete={handleDeleteClick}
              onPin={handlePinNote}
              onColorChange={handleColorChange}
            />
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            py: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            border: '2px dashed',
            borderColor: '#E5E7EB',
            borderRadius: 3,
            bgcolor: '#FAFAFA',
          }}
        >
          <NotepadIcon sx={{ fontSize: 48, color: '#9CA3AF', opacity: 0.5 }} />
          <Typography
            variant="body1"
            sx={{
              color: '#6B7280',
              fontFamily: 'Poppins, sans-serif !important',
              fontSize: '0.9rem',
            }}
          >
            No notes yet
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleCreateNote}
            sx={{
              fontFamily: 'Poppins, sans-serif !important',
              textTransform: 'none',
              borderRadius: 2,
              borderColor: '#111827',
              color: '#111827',
              fontSize: '0.8rem',
              '&:hover': {
                bgcolor: '#F9FAFB',
                borderColor: '#111827',
              },
            }}
          >
            Create Your First Note
          </Button>
        </Box>
      )}

      {/* Note Editor Modal */}
      <NoteEditorModal
        open={editorOpen}
        note={selectedNote}
        onClose={() => {
          setEditorOpen(false);
          setSelectedNote(null);
        }}
        onSave={handleSaveNote}
      />

      {/* Delete Confirmation */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: 340,
            p: 0,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: 'Poppins, sans-serif !important',
            fontWeight: 600,
            fontSize: '0.85rem',
            p: 2,
            pb: 1,
          }}
        >
          Delete Note?
        </DialogTitle>
        <DialogContent sx={{ p: 2, pt: 0 }}>
          <DialogContentText
            sx={{
              fontFamily: 'Poppins, sans-serif !important',
              fontSize: '0.75rem',
              color: '#6B7280',
            }}
          >
            This note will be permanently deleted. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1, gap: 0.75 }}>
          <Button
            onClick={() => setDeleteConfirmOpen(false)}
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
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            size="small"
            sx={{
              fontFamily: 'Poppins, sans-serif !important',
              textTransform: 'none',
              borderRadius: 1.5,
              fontSize: '0.75rem',
              py: 0.5,
              px: 2,
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}