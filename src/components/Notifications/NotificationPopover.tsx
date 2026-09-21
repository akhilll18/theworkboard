// src/components/Notifications/NotificationPopover.tsx
import { useState } from 'react';
import {
  Popover,
  PopoverProps,
  Badge,
  Avatar,
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  IconButton,
  Divider,
  Scrollbar,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import {
  Notifications as BellIcon,
  Favorite as HeartIcon,
  PersonAdd as UserPlusIcon,
  Comment as MessageCircleIcon,
  AlternateEmail as AtSignIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Types
type NotificationType = 'like' | 'follow' | 'comment' | 'mention';

interface Notification {
  id: number;
  avatar: string;
  initials: string;
  name: string;
  action: string;
  preview: string | null;
  time: string;
  unread: boolean;
  type: NotificationType;
}

interface NotificationPopoverProps {
  anchorEl?: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onMarkAllRead?: () => void;
  onNotificationClick?: (notification: Notification) => void;
  onViewAllClick?: () => void;
}

// Type configuration
const typeConfig: Record<NotificationType, { icon: React.ReactNode; color: string; bgColor: string }> = {
  like: {
    icon: <HeartIcon sx={{ fontSize: '0.65rem' }} />,
    color: '#f43f5e',
    bgColor: 'rgba(244, 63, 94, 0.1)',
  },
  follow: {
    icon: <UserPlusIcon sx={{ fontSize: '0.65rem' }} />,
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.1)',
  },
  comment: {
    icon: <MessageCircleIcon sx={{ fontSize: '0.65rem' }} />,
    color: '#22c55e',
    bgColor: 'rgba(34, 197, 94, 0.1)',
  },
  mention: {
    icon: <AtSignIcon sx={{ fontSize: '0.65rem' }} />,
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.1)',
  },
};

// Initial notifications data
const initialNotifications: Notification[] = [
  {
    id: 1,
    avatar: 'https://images.shadcnspace.com/assets/profiles/ben.webp',
    initials: 'BT',
    name: 'Ben Thompson',
    action: 'liked your post',
    preview: 'Building a design system with shadcn/ui...',
    time: '2m ago',
    unread: true,
    type: 'like',
  },
  {
    id: 2,
    avatar: 'https://images.shadcnspace.com/assets/profiles/jessica.webp',
    initials: 'PN',
    name: 'Priya Nair',
    action: 'started following you',
    preview: null,
    time: '1h ago',
    unread: true,
    type: 'follow',
  },
  {
    id: 3,
    avatar: 'https://images.shadcnspace.com/assets/profiles/albert.webp',
    initials: 'DP',
    name: 'Daniel Park',
    action: 'commented on your post',
    preview: '"Great work on the new design!"',
    time: '3h ago',
    unread: false,
    type: 'comment',
  },
  {
    id: 4,
    avatar: 'https://images.shadcnspace.com/assets/profiles/linda.webp',
    initials: 'LM',
    name: 'Linda Moore',
    action: 'mentioned you in a thread',
    preview: 'Hey @you, check out this component...',
    time: '1d ago',
    unread: false,
    type: 'mention',
  },
];

// Notification Item Component
const NotificationItem = ({
  notification,
  onClick,
}: {
  notification: Notification;
  onClick?: (notification: Notification) => void;
}) => {
  const config = typeConfig[notification.type];

  return (
    <ListItem
      disablePadding
      sx={{
        bgcolor: notification.unread ? 'action.hover' : 'transparent',
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
    >
      <ListItemButton
        onClick={() => onClick?.(notification)}
        sx={{
          px: 2,
          py: 1.5,
          gap: 2,
        }}
      >
        <ListItemAvatar sx={{ minWidth: 0, position: 'relative' }}>
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <Avatar
              src={notification.avatar}
              sx={{ width: 36, height: 36 }}
            >
              {notification.initials}
            </Avatar>
            <Box
              sx={{
                position: 'absolute',
                bottom: -2,
                right: -2,
                width: 16,
                height: 16,
                borderRadius: '50%',
                bgcolor: config.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                border: '2px solid',
                borderColor: 'background.paper',
              }}
            >
              {config.icon}
            </Box>
          </Box>
        </ListItemAvatar>

        <ListItemText
          sx={{
            flex: 1,
            minWidth: 0,
          }}
          primary={
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: '"Google Sans", sans-serif !important',
                  lineHeight: 1.4,
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    fontWeight: 600,
                    fontFamily: '"Google Sans", sans-serif !important',
                  }}
                >
                  {notification.name}
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    color: 'text.secondary',
                    fontFamily: '"Google Sans", sans-serif !important',
                  }}
                >
                  {' '}
                  {notification.action}
                </Typography>
              </Typography>
              {notification.preview && (
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontFamily: '"Google Sans", sans-serif !important',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '200px',
                  }}
                >
                  {notification.preview}
                </Typography>
              )}
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontFamily: '"Google Sans", sans-serif !important',
                  mt: 0.25,
                }}
              >
                {notification.time}
              </Typography>
            </Box>
          }
        />

        {notification.unread && (
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              flexShrink: 0,
              mt: 0.5,
            }}
          />
        )}
      </ListItemButton>
    </ListItem>
  );
};

// Main Notification Popover Component
export function NotificationPopover({
  open,
  onClose,
  onMarkAllRead,
  onNotificationClick,
  onViewAllClick,
}: NotificationPopoverProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [tabValue, setTabValue] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((n) => n.unread).length;
  const unreadItems = notifications.filter((n) => n.unread);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    onMarkAllRead?.();
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: 'all' | 'unread') => {
    setTabValue(newValue);
  };

  const getDisplayedNotifications = () => {
    return tabValue === 'all' ? notifications : unreadItems;
  };

  const displayedNotifications = getDisplayedNotifications();

  return (
    <Popover
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        sx: {
          width: 320,
          maxHeight: 480,
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
          mt: 1.5,
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              fontFamily: '"Google Sans", sans-serif !important',
            }}
          >
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Chip
              label={`${unreadCount} new`}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                fontFamily: '"Google Sans", sans-serif !important',
                bgcolor: 'action.selected',
              }}
            />
          )}
        </Box>
        {unreadCount > 0 && (
          <Button
            size="small"
            onClick={handleMarkAllRead}
            sx={{
              fontSize: '0.7rem',
              fontFamily: '"Google Sans", sans-serif !important',
              textTransform: 'none',
              color: 'text.secondary',
              '&:hover': {
                color: 'text.primary',
              },
            }}
          >
            Mark all read
          </Button>
        )}
      </Box>

      {/* Tabs */}
      <Box sx={{ px: 2, pt: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            minHeight: 32,
            '& .MuiTab-root': {
              minHeight: 32,
              fontSize: '0.75rem',
              fontFamily: '"Google Sans", sans-serif !important',
              textTransform: 'none',
              fontWeight: 500,
              flex: 1,
            },
            '& .MuiTabs-indicator': {
              height: 2,
            },
          }}
        >
          <Tab label="All" value="all" />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <span>Unread</span>
                {unreadCount > 0 && (
                  <Typography
                    component="span"
                    sx={{
                      fontSize: '0.65rem',
                      color: 'text.secondary',
                      fontFamily: '"Google Sans", sans-serif !important',
                    }}
                  >
                    ({unreadCount})
                  </Typography>
                )}
              </Box>
            }
            value="unread"
          />
        </Tabs>
      </Box>

      {/* Notification List */}
      <Box
        sx={{
          maxHeight: 280,
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: 4,
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'action.hover',
            borderRadius: 2,
          },
        }}
      >
        {displayedNotifications.length > 0 ? (
          <List disablePadding>
            {displayedNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={onNotificationClick}
              />
            ))}
          </List>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 6,
              gap: 1,
            }}
          >
            <BellIcon sx={{ fontSize: 40, color: 'text.secondary', opacity: 0.3 }} />
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontFamily: '"Google Sans", sans-serif !important',
              }}
            >
              {tabValue === 'all' ? 'No notifications' : "You're all caught up!"}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Button
          fullWidth
          size="small"
          onClick={onViewAllClick}
          sx={{
            fontSize: '0.8rem',
            fontFamily: '"Google Sans", sans-serif !important',
            textTransform: 'none',
            color: 'text.secondary',
            '&:hover': {
              color: 'text.primary',
              bgcolor: 'action.hover',
            },
          }}
        >
          View all notifications
        </Button>
      </Box>
    </Popover>
  );
}