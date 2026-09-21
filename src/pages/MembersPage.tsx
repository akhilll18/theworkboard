// src/pages/MembersPage.tsx
import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  InputAdornment,
  TextField,
  Button,
  Chip,
} from '@mui/material';
import {
  People as PeopleIcon,
  Search as SearchIcon,
  Add as AddIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  CenterFocusStrong as CenterIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { MemberCard } from '../components/Members/MemberCard';
import { TEAM_MEMBERS } from '../data/teamData';
import { TeamMember } from '../types/member';

export function MembersPage() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoom, setZoom] = useState(100);

  // Root member (no manager)
  const rootMember = TEAM_MEMBERS.find((m) => !m.managerId) || TEAM_MEMBERS[0];

  const getChildren = (managerId: string): TeamMember[] => {
    return TEAM_MEMBERS.filter((m) => m.managerId === managerId);
  };

  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return TEAM_MEMBERS;
    const q = searchQuery.toLowerCase();
    return TEAM_MEMBERS.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.team.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Recursive tree node
  const renderTreeNode = (member: TeamMember): JSX.Element => {
    const children = getChildren(member.id);

    return (
      <Box
        key={member.id}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Member card */}
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <MemberCard
            member={member}
            isSelected={selectedMember?.id === member.id}
            onClick={() => setSelectedMember(member)}
            compact
          />
        </Box>

        {/* Children with connectors */}
        {children.length > 0 && (
          <Box sx={{ position: 'relative', mt: 3 }}>
            {/* Vertical line from parent */}
            <Box
              sx={{
                position: 'absolute',
                top: -12,
                left: '50%',
                width: 2,
                height: 12,
                bgcolor: '#D1D5DB',
                transform: 'translateX(-50%)',
              }}
            />

            {/* Horizontal connector (only if more than 1 child) */}
            {children.length > 1 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  width: `calc(100% - 220px)`,
                  height: 2,
                  bgcolor: '#D1D5DB',
                  transform: 'translateX(-50%)',
                }}
              />
            )}

            <Box
              sx={{
                display: 'flex',
                gap: 3,
                justifyContent: 'center',
                alignItems: 'flex-start',
                pt: 1.5,
              }}
            >
              {children.map((child) => (
                <Box key={child.id} sx={{ position: 'relative' }}>
                  {/* Vertical connector to each child */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -12,
                      left: '50%',
                      width: 2,
                      height: 12,
                      bgcolor: '#D1D5DB',
                      transform: 'translateX(-50%)',
                    }}
                  />
                  {renderTreeNode(child)}
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: 'calc(100vh - 100px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PeopleIcon sx={{ fontSize: 28, color: '#111827' }} />
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
              Members
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Poppins, sans-serif !important',
                fontSize: '0.8rem',
                color: '#6B7280',
              }}
            >
              Team structure and hierarchy · {TEAM_MEMBERS.length} members
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            size="small"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              width: 240,
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5,
                bgcolor: '#FFFFFF',
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
          <Button
            size="small"
            variant="contained"
            startIcon={<AddIcon sx={{ fontSize: 16 }} />}
            sx={{
              fontFamily: 'Poppins, sans-serif !important',
              textTransform: 'none',
              fontSize: '0.75rem',
              borderRadius: 1.5,
              bgcolor: '#111827',
              '&:hover': { bgcolor: '#374151' },
            }}
          >
            Add Member
          </Button>
        </Box>
      </Box>

      {/* Search Results */}
      {searchQuery.trim() && (
        <Box sx={{ mb: 2 }}>
          <Typography
            sx={{
              fontFamily: 'Poppins, sans-serif !important',
              fontSize: '0.7rem',
              color: '#6B7280',
              mb: 1,
            }}
          >
            {filteredMembers.length} result{filteredMembers.length !== 1 ? 's' : ''} found
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {filteredMembers.map((m) => (
              <Chip
                key={m.id}
                avatar={
                  <Box
                    component="img"
                    src={m.avatar}
                    sx={{ width: 20, height: 20, borderRadius: '50%' }}
                  />
                }
                label={m.name}
                size="small"
                onClick={() => setSelectedMember(m)}
                sx={{
                  fontFamily: 'Poppins, sans-serif !important',
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Main Content: Chart + Detail Panel */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          gap: 2,
          overflow: 'hidden',
        }}
      >
        {/* Org Chart */}
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            border: '1px solid #E5E7EB',
            borderRadius: 2,
            bgcolor: '#FAFAFA',
            position: 'relative',
            overflow: 'auto',
            p: 3,
            minHeight: 400,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease',
              minWidth: 'fit-content',
            }}
          >
            {renderTreeNode(rootMember)}
          </Box>

          {/* Zoom Controls */}
          <Box
            sx={{
              position: 'sticky',
              bottom: 16,
              left: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              bgcolor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: 1.5,
              px: 0.75,
              py: 0.5,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              width: 'fit-content',
              mt: 2,
              ml: 'auto',
            }}
          >
            <Tooltip title="Zoom out">
              <IconButton
                size="small"
                onClick={() => setZoom(Math.max(50, zoom - 10))}
                sx={{ p: 0.5 }}
              >
                <ZoomOutIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Typography
              sx={{
                fontFamily: 'Poppins, sans-serif !important',
                fontSize: '0.7rem',
                fontWeight: 500,
                color: '#374151',
                minWidth: 36,
                textAlign: 'center',
              }}
            >
              {zoom}%
            </Typography>
            <Tooltip title="Zoom in">
              <IconButton
                size="small"
                onClick={() => setZoom(Math.min(150, zoom + 10))}
                sx={{ p: 0.5 }}
              >
                <ZoomInIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Box sx={{ width: 1, height: 20, bgcolor: '#E5E7EB', mx: 0.5 }} />
            <Tooltip title="Center view">
              <IconButton size="small" onClick={() => setZoom(100)} sx={{ p: 0.5 }}>
                <CenterIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>

        {/* Detail Panel */}
        {selectedMember && (
          <Paper
            elevation={0}
            sx={{
              width: 300,
              flexShrink: 0,
              border: '1px solid #E5E7EB',
              borderRadius: 2,
              bgcolor: '#FFFFFF',
              p: 2,
              overflowY: 'auto',
              display: { xs: 'none', md: 'block' },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: -1 }}>
              <IconButton
                size="small"
                onClick={() => setSelectedMember(null)}
                sx={{ p: 0.5 }}
              >
                <CloseIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
            <MemberCard member={selectedMember} isSelected />
            <Box sx={{ mt: 2 }}>
              <Typography
                sx={{
                  fontFamily: 'Poppins, sans-serif !important',
                  fontSize: '0.65rem',
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  mb: 1,
                }}
              >
                Reports To
              </Typography>
              {selectedMember.managerId ? (
                <MemberCard
                  member={TEAM_MEMBERS.find((m) => m.id === selectedMember.managerId)!}
                  compact
                  onClick={() =>
                    setSelectedMember(
                      TEAM_MEMBERS.find((m) => m.id === selectedMember.managerId)!
                    )
                  }
                />
              ) : (
                <Typography
                  sx={{
                    fontFamily: 'Poppins, sans-serif !important',
                    fontSize: '0.7rem',
                    color: '#9CA3AF',
                    fontStyle: 'italic',
                  }}
                >
                  Top of hierarchy
                </Typography>
              )}
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  );
}