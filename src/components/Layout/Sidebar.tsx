// src/components/Layout/Sidebar.tsx
import { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Typography,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  Badge,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
 
  Dashboard as DashboardIcon,
   Task as TaskIcon,
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  BarChart as AnalyticsIcon,
  Folder as ProjectIcon,
  Mail as InboxIcon,
  Edit as NotepadIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

export interface NavItem {
  label: string;
  icon?: React.ElementType;
  type: 'dropdown' | 'link' | 'divider' | 'section';
  href?: string;
  items?: NavItem[];
  badge?: number;
}

const navigationData: NavItem[] = [
  { label: 'WORKSPACE', type: 'section', icon: undefined },

  { label: 'Dashboard', icon: DashboardIcon, type: 'link', href: '/dashboard' },
    { label: 'Inbox', icon: InboxIcon, type: 'link', href: '/inbox', badge: 3 },
  { label: 'My Tasks', icon: TaskIcon, type: 'link', href: '/my-tasks', badge: 5 },
  { label: 'My Boards', icon: DashboardIcon, type: 'link', href: '/boards/my' },
  
  { label: 'Members', icon: PeopleIcon, type: 'link', href: '/members' },
  {
    label: 'Projects',
    icon: ProjectIcon,
    type: 'dropdown',
    items: [
      { label: 'All Projects', type: 'link', href: '/projects' },
      { label: 'Active', type: 'link', href: '/projects/active' },
    ],
  },
  { label: 'TOOLS', type: 'section', icon: undefined },
  { label: 'Calendar', icon: CalendarIcon, type: 'link', href: '/calendar' },
  { label: 'Project Analytics', icon: AnalyticsIcon, type: 'link', href: '/analytics' },
  { label: 'Notepad', icon: NotepadIcon, type: 'link', href: '/notepad' },
  { label: 'OTHER', type: 'section', icon: undefined },
  { label: 'Settings', icon: SettingsIcon, type: 'link', href: '/settings' },
];

interface SidebarProps {
  open: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ open, toggleSidebar }: SidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({
    'Projects': true,
  });

  const toggleDropdown = (label: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleNavigation = (href: string) => {
    navigate(href);
    if (isMobile) {
      toggleSidebar();
    }
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return location.pathname === href;
  };

  const renderNavItem = (item: NavItem, depth: number = 0) => {
    if (item.type === 'section') {
      if (!open && !isMobile) {
        return (
          <Box key={item.label} sx={{ display: 'flex', justifyContent: 'center', py: 0.5 }}>
            <Divider sx={{ width: '50%' }} />
          </Box>
        );
      }
      return (
        <Box key={item.label} sx={{ px: 1.25, pt: 1.25, pb: 0.25 }}>
          <Typography
            variant="caption"
            sx={{
              color: '#9CA3AF',
              fontFamily: 'Poppins, sans-serif !important',
              fontWeight: 600,
              fontSize: '0.5rem',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
            }}
          >
            {item.label}
          </Typography>
        </Box>
      );
    }

    if (item.type === 'divider') {
      return <Divider key={`divider-${depth}`} sx={{ my: 0.5 }} />;
    }

    const Icon = item.icon;
    const isOpen = openDropdowns[item.label];
    const active = isActive(item.href);
    const showLabel = open || isMobile;

    if (item.type === 'dropdown' && item.items) {
      return (
        <Box key={item.label}>
          <ListItem disablePadding sx={{ pl: depth * 1.5 }}>
            <Tooltip title={!showLabel ? item.label : ''} placement="right" arrow>
              <ListItemButton 
                onClick={() => showLabel && toggleDropdown(item.label)}
                sx={{
                  borderRadius: 1,
                  mx: 0.5,
                  my: 0.1,
                  minHeight: 30,
                  justifyContent: showLabel ? 'flex-start' : 'center',
                  px: showLabel ? 0.75 : 0.5,
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                {Icon && (
                  <ListItemIcon sx={{ minWidth: showLabel ? 26 : 0, justifyContent: 'center' }}>
                    <Icon sx={{ fontSize: 16, color: '#6B7280' }} />
                  </ListItemIcon>
                )}
                {showLabel && (
                  <>
                    <ListItemText 
                      primary={item.label}
                      sx={{
                        '& .MuiTypography-root': {
                          fontFamily: 'Poppins, sans-serif',
                          fontWeight: 500,
                          fontSize: '0.7rem',
                          color: '#374151',
                        }
                      }}
                    />
                    {isOpen ? <ExpandLess sx={{ fontSize: 14 }} /> : <ExpandMore sx={{ fontSize: 14 }} />}
                  </>
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
          {showLabel && (
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.items.map((subItem) => renderNavItem(subItem, depth + 1))}
              </List>
            </Collapse>
          )}
        </Box>
      );
    }

    return (
      <ListItem key={item.label} disablePadding sx={{ pl: depth * 1.5 }}>
        <Tooltip title={!showLabel ? item.label : ''} placement="right" arrow>
          <ListItemButton 
            onClick={() => {
              if (item.href) handleNavigation(item.href);
            }}
            sx={{
              borderRadius: 1,
              mx: 0.5,
              my: 0.1,
              minHeight: 30,
              justifyContent: showLabel ? 'flex-start' : 'center',
              px: showLabel ? 0.75 : 0.5,
              bgcolor: active ? 'action.selected' : 'transparent',
              borderLeft: active && showLabel ? '3px solid #000000' : '3px solid transparent',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Badge
              badgeContent={item.badge}
              color="primary"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.45rem',
                  height: 11,
                  minWidth: 11,
                  fontFamily: 'Poppins, sans-serif !important',
                  top: 3,
                  right: -2,
                },
              }}
            >
              {Icon && (
                <ListItemIcon sx={{ minWidth: showLabel ? 26 : 0, justifyContent: 'center' }}>
                  <Icon sx={{ fontSize: 16, color: active ? '#000000' : '#6B7280' }} />
                </ListItemIcon>
              )}
            </Badge>
            {showLabel && (
              <ListItemText 
                primary={item.label}
                sx={{
                  '& .MuiTypography-root': {
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: active ? 600 : 400,
                    fontSize: '0.7rem',
                    color: active ? '#000000' : '#374151',
                  }
                }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </ListItem>
    );
  };

  const drawerWidth = open ? 190 : 52;

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={isMobile ? open : true}
      onClose={toggleSidebar}
      anchor="left"
      ModalProps={{
        keepMounted: true,
        BackdropProps: {
          sx: {
            backgroundColor: isMobile ? 'rgba(0,0,0,0.3)' : 'transparent',
            backdropFilter: isMobile ? 'blur(2px)' : 'none',
            pointerEvents: isMobile ? 'auto' : 'none',
          },
        },
      }}
      sx={{
        width: isMobile ? 190 : drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isMobile ? 190 : drawerWidth,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
          fontFamily: 'Poppins, sans-serif !important',
          position: isMobile ? 'fixed' : 'relative',
          height: '100vh',
          zIndex: isMobile ? 1300 : 1100,
          boxShadow: isMobile ? '4px 0 20px rgba(0,0,0,0.1)' : 'none',
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            duration: theme.transitions.duration.shortest,
          }),
        },
      }}
    >
      {/* Header with Logo */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: open || isMobile ? 'space-between' : 'center',
        p: open || isMobile ? 1.25 : 0.5,
        height: 50,
        borderBottom: '1px solid',
        borderColor: 'divider',
        flexDirection: open || isMobile ? 'row' : 'column',
        gap: open || isMobile ? 0 : 0.25,
      }}>
        {open || isMobile ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  bgcolor: 'primary.main',
                  borderRadius: 0.75,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Typography 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 700, 
                    fontSize: '0.75rem',
                    fontFamily: 'Poppins, sans-serif !important',
                  }}
                >
                  W
                </Typography>
              </Box>
              <Typography 
                sx={{ 
                  fontWeight: 600,
                  fontFamily: 'Poppins, sans-serif !important',
                  fontSize: '0.8rem',
                }}
              >
                Workora
              </Typography>
            </Box>
            <IconButton onClick={toggleSidebar} size="small" sx={{ p: 0.25 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </IconButton>
          </>
        ) : (
          <>
            <Box
              sx={{
                width: 24,
                height: 24,
                bgcolor: 'primary.main',
                borderRadius: 0.75,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography 
                sx={{ 
                  color: 'white', 
                  fontWeight: 700, 
                  fontSize: '0.75rem',
                  fontFamily: 'Poppins, sans-serif !important',
                }}
              >
                W
              </Typography>
            </Box>
            <IconButton onClick={toggleSidebar} size="small" sx={{ p: 0.15 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </IconButton>
          </>
        )}
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', py: 0.5 }}>
        <List disablePadding>
          {navigationData.map((item) => renderNavItem(item))}
        </List>
      </Box>

      {/* Bottom Section */}
      <Box sx={{ 
        borderTop: '1px solid', 
        borderColor: 'divider',
        p: open || isMobile ? 1.25 : 0.5,
      }}>
        {open || isMobile ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Avatar 
              sx={{ width: 24, height: 24, bgcolor: 'primary.light', fontSize: '0.65rem' }}
              src="https://i.pravatar.cc/150?img=11"
            >
              DM
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography 
                sx={{ 
                  fontWeight: 500,
                  fontFamily: 'Poppins, sans-serif !important',
                  fontSize: '0.7rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  color: '#111827',
                }}
              >
                Akhil Reddy
              </Typography>
              <Typography 
                sx={{ 
                  color: '#9CA3AF',
                  fontFamily: 'Poppins, sans-serif !important',
                  fontSize: '0.55rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'block',
                }}
              >
                akhil@workora.com
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Tooltip title="Akhil Reddy" placement="right" arrow>
              <Avatar 
                sx={{ width: 24, height: 24, bgcolor: 'primary.light', fontSize: '0.65rem' }}
                src="https://i.pravatar.cc/150?img=11"
              >
                DM
              </Avatar>
            </Tooltip>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}