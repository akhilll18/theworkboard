// src/components/Notifications/NotificationButton.tsx
import { useState } from 'react';
import { IconButton, Badge } from '@mui/material';
import { Notifications as BellIcon } from '@mui/icons-material';
import { NotificationPopover } from './NotificationPopover';

interface NotificationButtonProps {
  onNotificationClick?: (notification: any) => void;
  onViewAllClick?: () => void;
}

export function NotificationButton({
  onNotificationClick,
  onViewAllClick,
}: NotificationButtonProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // This should come from your state management
  const unreadCount = 3;

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          position: 'relative',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '0.6rem',
              height: 18,
              minWidth: 18,
              fontFamily: '"Google Sans", sans-serif !important',
            },
          }}
        >
          <BellIcon fontSize="small" />
        </Badge>
      </IconButton>

      <NotificationPopover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        onNotificationClick={onNotificationClick}
        onViewAllClick={onViewAllClick}
      />
    </>
  );
}