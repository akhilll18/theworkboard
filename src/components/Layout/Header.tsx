// src/components/Layout/Header.tsx
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Add,
  Settings,
  Logout,
  Person,
  Help,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { CalendarWithEvents } from '../Calendar/CalendarWithEvents';
import { SearchButton } from '../Search/SearchButton';
import { useSearch } from '../../context/SearchContext';
import { NotificationButton } from '../Notifications/NotificationButton';
import { CREATE_TASK_EVENT } from '../../pages/KanbanPage';

interface HeaderProps {
  toggleMobileSidebar: () => void;
}

export function Header({ toggleMobileSidebar }: HeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { openSearch } = useSearch();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
  };

  const handleNotificationClick = (notification: any) => {
    console.log('Notification clicked:', notification);
  };

  const handleViewAllNotifications = () => {
    console.log('View all notifications');
  };

  const handleCreateTask = () => {
    const event = new CustomEvent(CREATE_TASK_EVENT, { 
      detail: { columnId: 'todo' } 
    });
    window.dispatchEvent(event);
  };

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        width: '100%',
      }}
    >
      <Toolbar sx={{ 
        minHeight: { xs: 56, sm: 64 }, 
        px: { xs: 1, sm: 2, md: 3 },
        gap: { xs: 0.5, sm: 1 },
      }}>
        {/* Sidebar Toggle Button */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="toggle sidebar"
          onClick={toggleMobileSidebar}
          sx={{ mr: 1 }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo */}
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            fontWeight: 600,
            fontFamily: 'Poppins, sans-serif !important',
            fontSize: { xs: '1rem', sm: '1.25rem' },
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Box
            sx={{
              display: { xs: 'flex', md: 'none' },
              width: 28,
              height: 28,
              bgcolor: 'primary.main',
              borderRadius: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '0.75rem', fontFamily: 'Poppins, sans-serif !important' }}>
              W
            </Typography>
          </Box>
          Workora
        </Typography>

        {/* Search - Desktop */}
        <Box sx={{ 
          flex: 1, 
          maxWidth: { md: 300, lg: 400 }, 
          display: { xs: 'none', md: 'block' },
          mx: 2,
        }}>
          <SearchButton 
            placeholder="Search tickets, boards..." 
            onSearch={handleSearch}
          />
        </Box>

        {/* Search Icon - Mobile/Tablet */}
        <IconButton
          sx={{ display: { xs: 'flex', md: 'none' } }}
          onClick={openSearch}
        >
          <SearchIcon fontSize="small" />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        {/* Actions */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 0.25, sm: 0.5 },
        }}>
          {/* Create Button */}
          <IconButton
            color="primary"
            size="small"
            onClick={handleCreateTask}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' },
              borderRadius: 1,
              px: { xs: 1, sm: 1.5 },
              mr: { xs: 0.5, sm: 1 },
            }}
          >
            <Add fontSize="small" />
            <Typography
              variant="body2"
              sx={{
                ml: 0.5,
                fontWeight: 500,
                display: { xs: 'none', sm: 'block' },
                fontFamily: 'Poppins, sans-serif !important',
                fontSize: { sm: '0.75rem', md: '0.875rem' },
              }}
            >
              Create
            </Typography>
          </IconButton>

          {/* Calendar Button */}
          <CalendarWithEvents />

          {/* Notifications */}
          <NotificationButton
            onNotificationClick={handleNotificationClick}
            onViewAllClick={handleViewAllNotifications}
          />

          {/* Profile */}
          <IconButton 
            onClick={handleProfileMenuOpen} 
            size="small" 
            sx={{ ml: { xs: 0, sm: 0.5 } }}
          >
            <Avatar
              sx={{ 
                width: { xs: 28, sm: 32 }, 
                height: { xs: 28, sm: 32 }, 
                bgcolor: 'primary.light' 
              }}
              src="https://i.pravatar.cc/150?img=11"
            >
              DM
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                mt: 1.5,
                width: 240,
                borderRadius: 2,
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography 
                variant="body2" 
                fontWeight={600}
                sx={{ fontFamily: 'Poppins, sans-serif !important' }}
              >
                Akhil Reddy 
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ fontFamily: 'Poppins, sans-serif !important' }}
              >
                akhil@workora.com
              </Typography>
            </Box>
            <Divider />
            <MenuItem>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="My Profile"
                primaryTypographyProps={{
                  fontFamily: 'Poppins, sans-serif',
                }}
              />
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Settings"
                primaryTypographyProps={{
                  fontFamily: 'Poppins, sans-serif',
                }}
              />
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <Help fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Help"
                primaryTypographyProps={{
                  fontFamily: 'Poppins, sans-serif',
                }}
              />
            </MenuItem>
            <Divider />
            <MenuItem 
              sx={{ color: 'error.main' }}
              onClick={() => {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userName');
                window.location.href = '/login';
              }}
            >
              <ListItemIcon>
                <Logout fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText 
                primary="Logout"
                primaryTypographyProps={{
                  fontFamily: 'Poppins, sans-serif',
                }}
              />
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}