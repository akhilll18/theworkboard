// src/components/Loading/LoadingDemo.tsx
import { useState } from 'react';
import { Button, Box, Typography, Alert, Snackbar } from '@mui/material';
import { useSlowNetwork, simulateApiCall } from '../../hooks/useSlowNetwork';

// Sample data
const sampleBoards = [
  { id: 1, name: 'Design System', cards: 12 },
  { id: 2, name: 'Sprint 23', cards: 8 },
  { id: 3, name: 'Bug Fixes', cards: 5 },
  { id: 4, name: 'Feature Launch', cards: 15 },
];

export function LoadingDemo() {
  const { executeWithLoading } = useSlowNetwork();
  const [data, setData] = useState<typeof sampleBoards>([]);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleLoadData = async () => {
    try {
      const result = await executeWithLoading(
        () => simulateApiCall(sampleBoards, 2500), // Simulate slow network (2.5s)
        {
          onSuccess: () => {
            setData(result || []);
            setSnackbar({
              open: true,
              message: 'Data loaded successfully!',
              severity: 'success',
            });
          },
        }
      );
      if (result) {
        setData(result);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to load data!',
        severity: 'error',
      });
    }
  };

  const handleLoadSlowData = async () => {
    try {
      // Simulate very slow network (5s)
      const result = await executeWithLoading(
        () => simulateApiCall(sampleBoards, 5000),
        {
          onSuccess: () => {
            setData(result || []);
            setSnackbar({
              open: true,
              message: 'Slow data loaded successfully!',
              severity: 'success',
            });
          },
        }
      );
      if (result) {
        setData(result);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to load data!',
        severity: 'error',
      });
    }
  };

  const handleClearData = () => {
    setData([]);
    setSnackbar({
      open: true,
      message: 'Data cleared!',
      severity: 'success',
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{ fontFamily: '"Google Sans", sans-serif !important' }}
      >
        Loading Demo
      </Typography>
      
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ mb: 3, fontFamily: '"Google Sans", sans-serif !important' }}
      >
        Click the buttons below to see the loading animation in action.
        The loading will show for the duration of the simulated network delay.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
        <Button 
          variant="contained" 
          onClick={handleLoadData}
          sx={{ fontFamily: '"Google Sans", sans-serif !important' }}
        >
          Load Data (2.5s)
        </Button>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={handleLoadSlowData}
          sx={{ fontFamily: '"Google Sans", sans-serif !important' }}
        >
          Load Slow Data (5s)
        </Button>
        <Button 
          variant="outlined" 
          color="error" 
          onClick={handleClearData}
          sx={{ fontFamily: '"Google Sans", sans-serif !important' }}
        >
          Clear Data
        </Button>
      </Box>

      {/* Display loaded data */}
      {data.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography 
            variant="subtitle1" 
            fontWeight={600}
            sx={{ mb: 2, fontFamily: '"Google Sans", sans-serif !important' }}
          >
            Loaded Boards:
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 2 }}>
            {data.map((board) => (
              <Box
                key={board.id}
                sx={{
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography 
                  fontWeight={600}
                  sx={{ fontFamily: '"Google Sans", sans-serif !important' }}
                >
                  {board.name}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontFamily: '"Google Sans", sans-serif !important' }}
                >
                  {board.cards} cards
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity} 
          sx={{ fontFamily: '"Google Sans", sans-serif !important' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}