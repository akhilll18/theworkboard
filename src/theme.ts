import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0052CC',
      light: '#4C9AFF',
      dark: '#0747A6',
    },
    secondary: {
      main: '#00B8D9',
      light: '#79E2F2',
      dark: '#008DA6',
    },
    background: {
      default: '#F4F5F7',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#172B4D',
      secondary: '#5E6C84',
    },
  },
  typography: {
    fontFamily: '"Google Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Google Sans", sans-serif',
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontFamily: '"Google Sans", sans-serif',
      fontWeight: 700,
      fontSize: '2rem',
    },
    h3: {
      fontFamily: '"Google Sans", sans-serif',
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontFamily: '"Google Sans", sans-serif',
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontFamily: '"Google Sans", sans-serif',
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontFamily: '"Google Sans", sans-serif',
      fontWeight: 600,
      fontSize: '1rem',
    },
    subtitle1: {
      fontFamily: '"Google Sans", sans-serif',
      fontWeight: 500,
      fontSize: '0.875rem',
    },
    subtitle2: {
      fontFamily: '"Google Sans", sans-serif',
      fontWeight: 500,
      fontSize: '0.75rem',
    },
    body1: {
      fontFamily: '"Google Sans", sans-serif',
      fontWeight: 400,
      fontSize: '0.875rem',
    },
    body2: {
      fontFamily: '"Google Sans", sans-serif',
      fontWeight: 400,
      fontSize: '0.75rem',
    },
    button: {
      fontFamily: '"Google Sans", sans-serif',
      fontWeight: 500,
      textTransform: 'none',
    },
    caption: {
      fontFamily: '"Google Sans", sans-serif',
      fontWeight: 400,
      fontSize: '0.7rem',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          fontFamily: '"Google Sans", sans-serif !important',
        },
        body: {
          fontFamily: '"Google Sans", sans-serif !important',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Google Sans", sans-serif',
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: '6px',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: '"Google Sans", sans-serif',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: '"Google Sans", sans-serif',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontFamily: '"Google Sans", sans-serif',
        },
        input: {
          fontFamily: '"Google Sans", sans-serif',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          fontFamily: '"Google Sans", sans-serif',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          fontFamily: '"Google Sans", sans-serif',
          borderRight: '1px solid #EBECF0',
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        root: {
          fontFamily: '"Google Sans", sans-serif',
        },
        primary: {
          fontFamily: '"Google Sans", sans-serif',
        },
        secondary: {
          fontFamily: '"Google Sans", sans-serif',
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          fontFamily: '"Google Sans", sans-serif',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          fontFamily: '"Google Sans", sans-serif',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          fontFamily: '"Google Sans", sans-serif',
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        root: {
          fontFamily: '"Google Sans", sans-serif',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontFamily: '"Google Sans", sans-serif',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          fontFamily: '"Google Sans", sans-serif',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          fontFamily: '"Google Sans", sans-serif',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          fontFamily: '"Google Sans", sans-serif',
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          fontFamily: '"Google Sans", sans-serif',
        },
      },
    },
  },
});