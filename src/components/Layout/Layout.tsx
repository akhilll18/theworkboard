// src/components/Layout/Layout.tsx
import { useState, ReactNode, useEffect, createContext, useContext } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface SidebarStateContextType {
  sidebarOpen: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export const SidebarStateContext = createContext<SidebarStateContextType>({
  sidebarOpen: true,
  isMobile: false,
  isTablet: false,
  isDesktop: true,
});

export const useSidebarState = () => useContext(SidebarStateContext);

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <SidebarStateContext.Provider
      value={{
        sidebarOpen,
        isMobile,
        isTablet,
        isDesktop,
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          minHeight: '100vh', 
          bgcolor: 'background.default',
          overflow: 'hidden',
        }}
      >
        <Sidebar
          open={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100vh',
            overflow: 'hidden',
          }}
        >
          <Header toggleMobileSidebar={toggleSidebar} />
          <Box
            sx={{
              flexGrow: 1,
              p: { xs: 1, sm: 2, md: 3 },
              bgcolor: 'background.default',
              overflowY: 'auto',
              overflowX: 'hidden',
              width: '100%',
              WebkitOverflowScrolling: 'touch',
              // Better mobile scrolling
              '&::-webkit-scrollbar': {
                width: 6,
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#c1c7d0',
                borderRadius: 3,
              },
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </SidebarStateContext.Provider>
  );
}