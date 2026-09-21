// src/components/Kanban/MemberMultiSelect.tsx
import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Avatar,
  Typography,
  Chip,
  TextField,
  Popper,
  Paper,
  ClickAwayListener,
  List,
  ListItemButton,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';
import { Member, MEMBERS } from '../../data/membersData';

interface MemberMultiSelectProps {
  value: Member[];
  onChange: (members: Member[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function MemberMultiSelect({
  value,
  onChange,
  placeholder = 'Add members...',
  disabled = false,
}: MemberMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const anchorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter members based on search
  const filteredMembers = MEMBERS.filter((m) => {
    if (value.find((v) => v.id === m.id)) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.position.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q)
    );
  });

  const handleToggle = () => {
    if (disabled) return;
    setOpen((prev) => !prev);
    if (!open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleSelect = (member: Member) => {
    onChange([...value, member]);
    setSearch('');
    // Keep focus on input for continued selection
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleRemove = (memberId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    onChange(value.filter((m) => m.id !== memberId));
  };

  const handleClickAway = () => {
    setOpen(false);
    setSearch('');
  };

  // Auto-open when typing
  useEffect(() => {
    if (search && !open) setOpen(true);
  }, [search, open]);

  // Reset open when disabled
  useEffect(() => {
    if (disabled) {
      setOpen(false);
      setSearch('');
    }
  }, [disabled]);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box ref={anchorRef} sx={{ position: 'relative', width: '100%' }}>
        {/* Chips container + input */}
        <Box
          onClick={handleToggle}
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 0.5,
            alignItems: 'center',
            minHeight: 40,
            px: 0.75,
            py: 0.5,
            border: '1px solid',
            borderColor: open ? '#111827' : '#E5E7EB',
            borderRadius: 1.5,
            bgcolor: disabled ? '#F9FAFB' : '#FFFFFF',
            cursor: disabled ? 'not-allowed' : 'text',
            transition: 'border-color 0.15s ease',
            '&:hover': {
              borderColor: disabled ? '#E5E7EB' : '#9CA3AF',
            },
          }}
        >
          {/* Selected member chips */}
          {value.map((member) => (
            <Chip
              key={member.id}
              avatar={
                <Avatar
                  src={member.avatar}
                  alt={member.name}
                  sx={{ width: 18, height: 18, fontSize: '0.5rem' }}
                >
                  {member.initials}
                </Avatar>
              }
              label={member.name}
              size="small"
              onDelete={disabled ? undefined : (e) => handleRemove(member.id, e as any)}
              deleteIcon={<CloseIcon sx={{ fontSize: 12 }} />}
              onClick={(e) => e.stopPropagation()}
              sx={{
                height: 24,
                fontSize: '0.7rem',
                fontFamily: 'Poppins, sans-serif !important',
                bgcolor: '#F3F4F6',
                color: '#374151',
                borderRadius: '999px',
                '& .MuiChip-avatar': {
                  width: 18,
                  height: 18,
                  ml: 0.25,
                },
                '& .MuiChip-label': {
                  px: 0.75,
                  fontFamily: 'Poppins, sans-serif !important',
                  fontSize: '0.7rem',
                },
                '& .MuiChip-deleteIcon': {
                  fontSize: 12,
                  color: '#6B7280',
                  mr: 0.25,
                  '&:hover': { color: '#DC2626' },
                },
              }}
            />
          ))}

          {/* Inline search input */}
          <TextField
            inputRef={inputRef}
            variant="standard"
            placeholder={value.length === 0 ? placeholder : 'Add more...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={disabled}
            onClick={(e) => e.stopPropagation()}
            onFocus={() => !disabled && setOpen(true)}
            sx={{
              flex: 1,
              minWidth: 100,
              '& .MuiInputBase-root': {
                fontFamily: 'Poppins, sans-serif !important',
                fontSize: '0.75rem',
              },
              '& .MuiInput-underline:before, & .MuiInput-underline:after': {
                display: 'none',
              },
              '& .MuiInputBase-input': {
                fontFamily: 'Poppins, sans-serif !important',
                fontSize: '0.75rem',
                py: 0.5,
                '&::placeholder': {
                  fontFamily: 'Poppins, sans-serif !important',
                  fontSize: '0.75rem',
                  color: '#9CA3AF',
                  opacity: 1,
                },
              },
            }}
          />
        </Box>

        {/* Dropdown */}
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          style={{
            width: anchorRef.current?.clientWidth,
            zIndex: 1500,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              mt: 0.5,
              borderRadius: 1.5,
              border: '1px solid #E5E7EB',
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              maxHeight: 280,
              overflow: 'hidden',
            }}
          >
            {/* Search bar at the top of dropdown */}
            <Box
              sx={{
                p: 1,
                borderBottom: '1px solid #F3F4F6',
                bgcolor: '#FAFAFA',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <TextField
                fullWidth
                size="small"
                autoFocus
                placeholder="Search members..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    fontSize: '0.75rem',
                    bgcolor: '#FFFFFF',
                  },
                  '& .MuiOutlinedInput-input': {
                    fontFamily: 'Poppins, sans-serif !important',
                    fontSize: '0.75rem',
                    py: 0.75,
                    '&::placeholder': {
                      fontFamily: 'Poppins, sans-serif !important',
                      fontSize: '0.75rem',
                      color: '#9CA3AF',
                      opacity: 1,
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 16, color: '#9CA3AF' }} />
                    </InputAdornment>
                  ),
                  endAdornment: search ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSearch('');
                          inputRef.current?.focus();
                        }}
                        sx={{ p: 0.25 }}
                      >
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
              />
            </Box>

            {/* Members list */}
            <List sx={{ py: 0.5, maxHeight: 200, overflowY: 'auto' }}>
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <ListItemButton
                    key={member.id}
                    onClick={() => handleSelect(member)}
                    sx={{
                      py: 0.75,
                      px: 1.5,
                      gap: 1.25,
                      '&:hover': {
                        bgcolor: '#F9FAFB',
                      },
                    }}
                  >
                    <Avatar
                      src={member.avatar}
                      alt={member.name}
                      sx={{ width: 28, height: 28, fontSize: '0.7rem' }}
                    >
                      {member.initials}
                    </Avatar>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography
                        sx={{
                          fontFamily: 'Poppins, sans-serif !important',
                          fontSize: '0.78rem',
                          fontWeight: 500,
                          color: '#111827',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {member.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: 'Poppins, sans-serif !important',
                          fontSize: '0.65rem',
                          color: '#6B7280',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {member.position}
                      </Typography>
                    </Box>
                  </ListItemButton>
                ))
              ) : (
                <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
                  <Typography
                    sx={{
                      fontFamily: 'Poppins, sans-serif !important',
                      fontSize: '0.75rem',
                      color: '#9CA3AF',
                    }}
                  >
                    {search ? `No members match "${search}"` : 'No members found'}
                  </Typography>
                </Box>
              )}
            </List>
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}