// src/pages/InboxPage.tsx
import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Button,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Search as SearchIcon,
  Inbox as InboxIcon,
  Send as SendIcon,
} from '@mui/icons-material';

// Chat Illustration SVG (converted from reference)
function ChatIllustration() {
  return (
    <svg
      width="180"
      height="120"
      viewBox="0 0 180 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Left bubble */}
      <rect
        x="20"
        y="20"
        width="80"
        height="44"
        rx="12"
        fill="#F3F4F6"
        stroke="#E5E7EB"
        strokeWidth="1.5"
      />
      {/* Left bubble tail */}
      <path
        d="M36 64 L32 76 L48 64"
        fill="#F3F4F6"
        stroke="#E5E7EB"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Left bubble text lines */}
      <rect x="32" y="32" width="48" height="4" rx="2" fill="#D1D5DB" />
      <rect x="32" y="42" width="36" height="4" rx="2" fill="#E5E7EB" />
      {/* Left bubble avatar dot */}
      <circle cx="32" cy="52" r="3" fill="#E5E7EB" />

      {/* Right bubble */}
      <rect
        x="80"
        y="50"
        width="80"
        height="40"
        rx="12"
        fill="#EEF2FF"
        stroke="#C7D2FE"
        strokeWidth="1.5"
      />
      {/* Right bubble tail */}
      <path
        d="M144 90 L148 100 L132 90"
        fill="#EEF2FF"
        stroke="#C7D2FE"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Right bubble text lines */}
      <rect x="92" y="62" width="52" height="4" rx="2" fill="#C7D2FE" />
      <rect x="92" y="72" width="32" height="4" rx="2" fill="#DBEAFE" />

      {/* Decorative dots */}
      <circle cx="14" cy="46" r="2" fill="#E5E7EB" />
      <circle cx="168" cy="66" r="2" fill="#C7D2FE" />
      <circle cx="110" cy="16" r="2.5" fill="#E5E7EB" />
    </svg>
  );
}

export function InboxPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  const hasMessages = messages.length > 0;

  return (
    <Box sx={{ width: '100%', height: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 2,
        }}
      >
        <InboxIcon sx={{ fontSize: 28, color: '#111827' }} />
        <Box>
          <Typography
            sx={{
              fontFamily: 'Poppins, sans-serif !important',
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#111827',
              lineHeight: 1.2,
            }}
          >
            Inbox
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Poppins, sans-serif !important',
              fontSize: '0.8rem',
              color: '#6B7280',
            }}
          >
            Stay connected with your team
          </Typography>
        </Box>
      </Box>

      {/* Two-pane layout */}
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          border: '1px solid #E5E7EB',
          borderRadius: 2,
          overflow: 'hidden',
          height: '100%',
          minHeight: 500,
        }}
      >
        {/* Left Pane - Messages List */}
        <Box
          sx={{
            width: { xs: '100%', md: 320 },
            borderRight: { xs: 'none', md: '1px solid #E5E7EB' },
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#FFFFFF',
            flexShrink: 0,
          }}
        >
          {/* Left Header */}
          <Box sx={{ p: 1.5, borderBottom: '1px solid #E5E7EB' }}>
            <Typography
              sx={{
                fontFamily: 'Poppins, sans-serif !important',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#111827',
                mb: 1,
              }}
            >
              Messages ({messages.length})
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                },
                '& .MuiOutlinedInput-input': {
                  fontFamily: 'Poppins, sans-serif !important',
                  fontSize: '0.75rem',
                  py: 0.75,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 16, color: '#9CA3AF' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Message List / Empty State */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {!hasMessages ? (
              // Inbox Zero Empty State
              <Box
                sx={{
                  textAlign: 'center',
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    bgcolor: '#F3F4F6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <InboxIcon sx={{ fontSize: 28, color: '#9CA3AF' }} />
                </Box>
                <Typography
                  sx={{
                    fontFamily: 'Poppins, sans-serif !important',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#111827',
                  }}
                >
                  Inbox zero
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'Poppins, sans-serif !important',
                    fontSize: '0.75rem',
                    color: '#6B7280',
                    lineHeight: 1.5,
                    maxWidth: 220,
                  }}
                >
                  You're all caught up. No new messages.
                </Typography>
              </Box>
            ) : (
              // Message list would render here
              <Box />
            )}
          </Box>
        </Box>

        {/* Right Pane - Conversation View */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#FAFAFA',
            display: { xs: 'none', md: 'flex' },
          }}
        >
          {!hasMessages ? (
            // Chat Illustration Empty State
            <Box
              sx={{
                textAlign: 'center',
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                maxWidth: 400,
              }}
            >
              <ChatIllustration />
              <Typography
                sx={{
                  fontFamily: 'Poppins, sans-serif !important',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: '#111827',
                  mt: 1,
                }}
              >
                No messages yet
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'Poppins, sans-serif !important',
                  fontSize: '0.85rem',
                  color: '#6B7280',
                  lineHeight: 1.6,
                  maxWidth: 300,
                }}
              >
                Start a conversation with your team. Messages will appear here.
              </Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<SendIcon sx={{ fontSize: 16 }} />}
                sx={{
                  fontFamily: 'Poppins, sans-serif !important',
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  borderRadius: 1.5,
                  px: 2.5,
                  py: 0.75,
                  bgcolor: '#111827',
                  mt: 1,
                  '&:hover': { bgcolor: '#374151' },
                }}
              >
                Send a message
              </Button>
            </Box>
          ) : (
            <Box />
          )}
        </Box>

        {/* Mobile Empty State (only shows when both panes collapse) */}
        {!hasMessages && (
          <Box
            sx={{
              display: { xs: 'flex', md: 'none' },
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#FAFAFA',
              p: 4,
              gap: 2,
            }}
          >
            <ChatIllustration />
            <Typography
              sx={{
                fontFamily: 'Poppins, sans-serif !important',
                fontSize: '1rem',
                fontWeight: 600,
                color: '#111827',
                textAlign: 'center',
              }}
            >
              No messages yet
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Poppins, sans-serif !important',
                fontSize: '0.8rem',
                color: '#6B7280',
                lineHeight: 1.6,
                textAlign: 'center',
                maxWidth: 280,
              }}
            >
              Start a conversation with your team. Messages will appear here.
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<SendIcon sx={{ fontSize: 16 }} />}
              sx={{
                fontFamily: 'Poppins, sans-serif !important',
                textTransform: 'none',
                fontSize: '0.8rem',
                borderRadius: 1.5,
                px: 2.5,
                py: 0.75,
                bgcolor: '#111827',
                '&:hover': { bgcolor: '#374151' },
              }}
            >
              Send a message
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}