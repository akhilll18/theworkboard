// src/components/Members/MemberCard.tsx
import { Box, Avatar, Typography } from '@mui/material';
import { TeamMember, TEAM_COLORS } from '../../types/member';

interface MemberCardProps {
  member: TeamMember;
  isSelected?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

export function MemberCard({ member, isSelected, onClick, compact }: MemberCardProps) {
  const teamColor = TEAM_COLORS[member.team] || TEAM_COLORS.Leadership;

  if (compact) {
    return (
      <Box
        onClick={onClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 1.25,
          py: 0.75,
          minWidth: 180,
          bgcolor: '#FFFFFF',
          border: '1px solid',
          borderColor: isSelected ? '#111827' : '#E5E7EB',
          borderRadius: 1.5,
          cursor: 'pointer',
          boxShadow: isSelected
            ? '0 0 0 2px rgba(17,24,39,0.08)'
            : '0 1px 2px rgba(0,0,0,0.04)',
          transition: 'all 0.15s ease',
          '&:hover': {
            borderColor: isSelected ? '#111827' : '#9CA3AF',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          },
        }}
      >
        <Avatar
          src={member.avatar}
          alt={member.name}
          sx={{
            width: 32,
            height: 32,
            fontSize: '0.7rem',
            bgcolor: teamColor.bg,
            color: teamColor.text,
          }}
        >
          {member.initials}
        </Avatar>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            sx={{
              fontFamily: 'Poppins, sans-serif !important',
              fontSize: '0.72rem',
              fontWeight: 600,
              color: '#111827',
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {member.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
            <Typography
              sx={{
                fontFamily: 'Poppins, sans-serif !important',
                fontSize: '0.6rem',
                color: '#6B7280',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {member.role}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, flexShrink: 0 }}>
              <Box
                sx={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  bgcolor: teamColor.dot,
                }}
              />
              <Typography
                sx={{
                  fontFamily: 'Poppins, sans-serif !important',
                  fontSize: '0.6rem',
                  color: teamColor.text,
                  fontWeight: 500,
                }}
              >
                {member.team}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  // Expanded (side panel) style
  return (
    <Box
      onClick={onClick}
      sx={{
        p: 2,
        bgcolor: '#FFFFFF',
        border: '1px solid',
        borderColor: isSelected ? '#111827' : '#E5E7EB',
        borderRadius: 1.5,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        '&:hover': {
          borderColor: isSelected ? '#111827' : '#9CA3AF',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.5 }}>
        <Avatar
          src={member.avatar}
          alt={member.name}
          sx={{
            width: 44,
            height: 44,
            fontSize: '0.85rem',
            bgcolor: teamColor.bg,
            color: teamColor.text,
          }}
        >
          {member.initials}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontFamily: 'Poppins, sans-serif !important',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#111827',
            }}
          >
            {member.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography
              sx={{
                fontFamily: 'Poppins, sans-serif !important',
                fontSize: '0.7rem',
                color: '#6B7280',
              }}
            >
              {member.role}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
              <Box
                sx={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  bgcolor: teamColor.dot,
                }}
              />
              <Typography
                sx={{
                  fontFamily: 'Poppins, sans-serif !important',
                  fontSize: '0.7rem',
                  color: teamColor.text,
                  fontWeight: 500,
                }}
              >
                {member.team}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {member.email && (
        <Typography
          sx={{
            fontFamily: 'Poppins, sans-serif !important',
            fontSize: '0.7rem',
            color: '#374151',
            mb: 0.5,
          }}
        >
          📧 {member.email}
        </Typography>
      )}
      {member.phone && (
        <Typography
          sx={{
            fontFamily: 'Poppins, sans-serif !important',
            fontSize: '0.7rem',
            color: '#374151',
            mb: 0.5,
          }}
        >
          📞 {member.phone}
        </Typography>
      )}
      {member.location && (
        <Typography
          sx={{
            fontFamily: 'Poppins, sans-serif !important',
            fontSize: '0.7rem',
            color: '#374151',
          }}
        >
          📍 {member.location}
        </Typography>
      )}
    </Box>
  );
}