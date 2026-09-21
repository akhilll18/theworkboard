// src/components/Toast/ToastContainer.tsx
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Slide,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useToast, Toast as ToastType } from '../../context/ToastContext';

const TYPE_CONFIG = {
  success: {
    icon: CheckIcon,
    color: '#10B981',
    bg: '#F0FDF4',
    border: '#86EFAC',
  },
  error: {
    icon: ErrorIcon,
    color: '#DC2626',
    bg: '#FEF2F2',
    border: '#FCA5A5',
  },
  info: {
    icon: InfoIcon,
    color: '#3B82F6',
    bg: '#EFF6FF',
    border: '#93C5FD',
  },
  warning: {
    icon: WarningIcon,
    color: '#F59E0B',
    bg: '#FFFBEB',
    border: '#FCD34D',
  },
};

interface ToastItemProps {
  toast: ToastType;
  onClose: () => void;
  isMobile: boolean;
}

function ToastItem({ toast, onClose, isMobile }: ToastItemProps) {
  const config = TYPE_CONFIG[toast.type];
  const Icon = config.icon;

  return (
    <Slide direction="left" in mountOnEnter unmountOnExit>
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1.25,
          p: 1.5,
          mb: 1,
          minWidth: isMobile ? 'auto' : 320,
          maxWidth: isMobile ? '100%' : 400,
          bgcolor: '#FFFFFF',
          border: '1px solid #E5E7EB',
         
          borderRadius: 1.5,
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          animation: 'slideIn 0.3s ease-out',
          '@keyframes slideIn': {
            from: {
              opacity: 0,
              transform: 'translateX(20px)',
            },
            to: {
              opacity: 1,
              transform: 'translateX(0)',
            },
          },
        }}
      >
        {/* Icon */}
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            bgcolor: config.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            mt: 0.25,
          }}
        >
          <Icon sx={{ fontSize: 16, color: config.color }} />
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontFamily: 'Poppins, sans-serif !important',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#111827',
              lineHeight: 1.3,
            }}
          >
            {toast.title}
          </Typography>
          {toast.description && (
            <Typography
              sx={{
                fontFamily: 'Poppins, sans-serif !important',
                fontSize: '0.7rem',
                color: '#6B7280',
                mt: 0.25,
                lineHeight: 1.4,
              }}
            >
              {toast.description}
            </Typography>
          )}
        </Box>

        {/* Close */}
        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            p: 0.25,
            mt: 0.25,
            color: '#9CA3AF',
            '&:hover': {
              color: '#374151',
              bgcolor: '#F3F4F6',
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 14 }} />
        </IconButton>
      </Paper>
    </Slide>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        position: 'fixed',
        top: isMobile ? 60 : 80,
        right: isMobile ? 8 : 16,
        left: isMobile ? 8 : 'auto',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: isMobile ? 'stretch' : 'flex-end',
        pointerEvents: 'none',
        '& > *': {
          pointerEvents: 'auto',
        },
      }}
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
          isMobile={isMobile}
        />
      ))}
    </Box>
  );
}