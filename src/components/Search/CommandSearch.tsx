// src/components/Search/CommandSearch.tsx
import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Dashboard,
  TrendingUp,
  Work,
  Bolt,
  Settings,
  AccessTime,
  Description,
  Message,
  KeyboardCommandKey,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Types
export interface SearchItem {
  id: string;
  label: string;
  icon?: React.ElementType;
  timestamp?: string;
  category?: string;
  onSelect?: () => void;
  shortcut?: string;
}

export interface SearchGroup {
  heading: string;
  items: SearchItem[];
}

interface CommandSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placeholder?: string;
  emptyMessage?: string;
  groups?: SearchGroup[];
  onSearch?: (query: string) => void;
}

// Default search data with correct MUI icons
const defaultGroups: SearchGroup[] = [
  {
    heading: 'Suggestions',
    items: [
      { id: '1', label: 'Dashboard', icon: Dashboard },
      { id: '2', label: 'Analytics', icon: TrendingUp },
      { id: '3', label: 'Projects', icon: Work },
      { id: '4', label: 'Integrations', icon: Bolt },
      { id: '5', label: 'Settings', icon: Settings },
    ],
  },
  {
    heading: 'Recent',
    items: [
      { id: '6', label: 'Q2 Sales Report', icon: AccessTime, timestamp: '2m ago' },
      { id: '7', label: 'Sprint Planning', icon: AccessTime, timestamp: '15m ago' },
      { id: '8', label: 'API Configuration', icon: AccessTime, timestamp: '1h ago' },
      { id: '9', label: 'Team Permissions', icon: AccessTime, timestamp: '3h ago' },
    ],
  },
  {
    heading: 'Quick Links',
    items: [
      { id: '10', label: 'Documentation', icon: Description },
      { id: '11', label: 'Changelog', icon: Description },
      { id: '12', label: 'Community Forum', icon: Message },
    ],
  },
];

export function CommandSearch({
  open,
  onOpenChange,
  placeholder = 'Type a command or search...',
  emptyMessage = 'No results found.',
  groups = defaultGroups,
  onSearch,
}: CommandSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter items based on search query
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return groups;

    const query = searchQuery.toLowerCase().trim();
    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          item.label.toLowerCase().includes(query)
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [groups, searchQuery]);

  // Flatten items for keyboard navigation
  const flatItems = useMemo(() => {
    return filteredGroups.flatMap((group) => group.items);
  }, [filteredGroups]);

  // Keyboard shortcuts
  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      // ⌘J or Ctrl+J to open
      if (event.key === 'j' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        onOpenChange(true);
      }

      // ESC to close
      if (event.key === 'Escape' && open) {
        onOpenChange(false);
        setSearchQuery('');
        setSelectedIndex(0);
      }

      // Arrow navigation when open
      if (open) {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          setSelectedIndex((prev) => 
            prev < flatItems.length - 1 ? prev + 1 : prev
          );
        }
        if (event.key === 'ArrowUp') {
          event.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        }
        if (event.key === 'Enter' && flatItems[selectedIndex]) {
          event.preventDefault();
          flatItems[selectedIndex].onSelect?.();
          onOpenChange(false);
          setSearchQuery('');
          setSelectedIndex(0);
        }
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange, flatItems, selectedIndex]);

  const handleClose = () => {
    onOpenChange(false);
    setSearchQuery('');
    setSelectedIndex(0);
  };

  const handleItemClick = (item: SearchItem) => {
    item.onSelect?.();
    handleClose();
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
          maxHeight: '80vh',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          bgcolor: 'background.paper',
        },
      }}
    >
      <DialogTitle sx={{ p: 0 }}>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <TextField
            fullWidth
            autoFocus
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
              onSearch?.(e.target.value);
            }}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchQuery('')}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                fontFamily: '"Google Sans", sans-serif !important',
                fontSize: '1rem',
                py: 0.5,
              },
            }}
            sx={{
              '& .MuiInputBase-root': {
                fontFamily: '"Google Sans", sans-serif !important',
              },
            }}
          />
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group, groupIndex) => (
              <Box key={group.heading}>
                {groupIndex > 0 && (
                  <Divider sx={{ my: 1 }} />
                )}
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      fontFamily: '"Google Sans", sans-serif !important',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontSize: '0.65rem',
                    }}
                  >
                    {group.heading}
                  </Typography>
                </Box>
                <List sx={{ py: 0 }}>
                  {group.items.map((item, index) => {
                    const globalIndex = flatItems.indexOf(item);
                    const isSelected = globalIndex === selectedIndex;
                    const Icon = item.icon;

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <ListItem disablePadding>
                          <ListItemButton
                            onClick={() => handleItemClick(item)}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            sx={{
                              borderRadius: 1,
                              mx: 1,
                              my: 0.5,
                              bgcolor: isSelected ? 'action.selected' : 'transparent',
                              transition: 'background-color 0.15s ease',
                              '&:hover': {
                                bgcolor: 'action.hover',
                              },
                            }}
                          >
                            {Icon && (
                              <ListItemIcon sx={{ minWidth: 40 }}>
                                <Icon
                                  fontSize="small"
                                  sx={{
                                    color: item.timestamp ? 'text.secondary' : 'primary.main',
                                  }}
                                />
                              </ListItemIcon>
                            )}
                            <ListItemText
                              primary={item.label}
                              primaryTypographyProps={{
                                fontFamily: '"Google Sans", sans-serif !important',
                                fontWeight: isSelected ? 500 : 400,
                                fontSize: '0.875rem',
                              }}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {item.timestamp && (
                                <Chip
                                  label={item.timestamp}
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: '0.65rem',
                                    fontFamily: '"Google Sans", sans-serif !important',
                                    bgcolor: 'action.hover',
                                  }}
                                />
                              )}
                              {isSelected && (
                                <Chip
                                  label="⏎"
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: '0.65rem',
                                    fontFamily: '"Google Sans", sans-serif !important',
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                  }}
                                />
                              )}
                            </Box>
                          </ListItemButton>
                        </ListItem>
                      </motion.div>
                    );
                  })}
                </List>
              </Box>
            ))
          ) : (
            <Box
              sx={{
                py: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <SearchIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.3 }} />
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontFamily: '"Google Sans", sans-serif !important' }}
              >
                {emptyMessage}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Footer with shortcuts */}
        <Box
          sx={{
            p: 1.5,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'action.hover',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Chip
              label="⌘K"
              size="small"
              sx={{
                height: 20,
                fontSize: '0.6rem',
                fontFamily: '"Google Sans", sans-serif !important',
                bgcolor: 'background.paper',
              }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontFamily: '"Google Sans", sans-serif !important' }}
            >
              to open
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Chip
              label="ESC"
              size="small"
              sx={{
                height: 20,
                fontSize: '0.6rem',
                fontFamily: '"Google Sans", sans-serif !important',
                bgcolor: 'background.paper',
              }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontFamily: '"Google Sans", sans-serif !important' }}
            >
              to close
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Chip
              label="↑↓"
              size="small"
              sx={{
                height: 20,
                fontSize: '0.6rem',
                fontFamily: '"Google Sans", sans-serif !important',
                bgcolor: 'background.paper',
              }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontFamily: '"Google Sans", sans-serif !important' }}
            >
              to navigate
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Chip
              label="⏎"
              size="small"
              sx={{
                height: 20,
                fontSize: '0.6rem',
                fontFamily: '"Google Sans", sans-serif !important',
                bgcolor: 'background.paper',
              }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontFamily: '"Google Sans", sans-serif !important' }}
            >
              to select
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}