// src/components/Search/SearchButton.tsx
import { useState } from 'react';
import { Button, Chip, Box } from '@mui/material';
import { Search as SearchIcon, KeyboardCommandKey } from '@mui/icons-material';
import { CommandSearch } from './CommandSearch';

interface SearchButtonProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export function SearchButton({ placeholder = 'Search...', onSearch }: SearchButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        sx={{
          borderRadius: 2,
          px: 2,
          py: 1,
          color: 'text.secondary',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          fontFamily: '"Google Sans", sans-serif !important',
          fontWeight: 400,
          textTransform: 'none',
          '&:hover': {
            bgcolor: 'action.hover',
            borderColor: 'primary.main',
          },
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
        <Box sx={{ flex: 1, textAlign: 'left' }}>{placeholder}</Box>
        <Chip
          label="⌘J"
          size="small"
          sx={{
            height: 20,
            fontSize: '0.6rem',
            fontFamily: '"Google Sans", sans-serif !important',
            bgcolor: 'action.hover',
            '& .MuiChip-label': {
              px: 0.5,
            },
          }}
        />
      </Button>

      <CommandSearch
        open={open}
        onOpenChange={setOpen}
        placeholder={placeholder}
        onSearch={onSearch}
      />
    </>
  );
}