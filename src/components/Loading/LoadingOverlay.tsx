// src/components/Loading/LoadingOverlay.tsx
import { Box, Backdrop, Typography } from '@mui/material';
import LiquidWaveSpinner from './LiquidWaveSpinner';

interface LoadingOverlayProps {
  open: boolean;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingOverlay({ 
  open, 
  message = 'Loading...', 
  size = 'md' 
}: LoadingOverlayProps) {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
      }}
      open={open}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        gap: 2,
        maxWidth: 400,
        width: '100%',
      }}>
        <LiquidWaveSpinner 
          size={size}
          loadingTexts={[
            'Loading...',
            'Please wait...',
            'Almost there...',
            'Preparing your content...',
          ]}
        />
        {message && (
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'white',
              fontFamily: '"Google Sans", sans-serif !important',
              textAlign: 'center',
              mt: 1,
            }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Backdrop>
  );
}