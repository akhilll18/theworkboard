// src/pages/AnalyticsPage.tsx
import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Avatar,
  AvatarGroup,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassIcon,
  PauseCircleOutlined as PauseIcon,
  Assignment as TaskIcon,
  BarChart as ChartIcon,
  Folder as FolderIcon,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { PROJECTS, STATUS_COLORS } from '../types/analytics';
import { analyticsData, chartData } from '../data/analyticsData';

// Status variant styles matching the reference
const STATUS_VARIANTS: Record<string, { bg: string; color: string; border: string }> = {
  'In Progress': { bg: '#EFF6FF', color: '#1E40AF', border: '#93C5FD' },
  'Done': { bg: '#F0FDF4', color: '#166534', border: '#86EFAC' },
  'Review': { bg: '#FFFBEB', color: '#92400E', border: '#FCD34D' },
  'Planning': { bg: '#F9FAFB', color: '#374151', border: '#E5E7EB' },
};

// Derive start/end dates from analytics data (pseudo — just for display)
const getStartDate = (id: number) => {
  const date = new Date(2026, 0, 1);
  date.setDate(date.getDate() + id);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getEndDate = (id: number) => {
  const date = new Date(2026, 0, 15);
  date.setDate(date.getDate() + id);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getDueDate = (id: number) => {
  const date = new Date(2026, 1, 1);
  date.setDate(date.getDate() + id);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Team members for avatars
const TEAM_MEMBERS = [
  { src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80', fallback: 'SC' },
  { src: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80', fallback: 'MJ' },
  { src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&dpr=2&q=80', fallback: 'EP' },
  { src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&dpr=2&q=80', fallback: 'DK' },
  { src: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80', fallback: 'SD' },
];

export function AnalyticsPage() {
  const [selectedProject, setSelectedProject] = useState('foyer');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Done' | 'In Process' | 'Pending'>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Compute KPIs
  const kpis = useMemo(() => {
    const total = analyticsData.length;
    const completed = analyticsData.filter((t) => t.status === 'Done').length;
    const inProgress = analyticsData.filter((t) => t.status === 'In Process').length;
    const pending = total - completed - inProgress;
    return { total, completed, inProgress, pending };
  }, []);

  // Filter data
  const filteredData = useMemo(() => {
    return analyticsData.filter((t) => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          t.header.toLowerCase().includes(q) ||
          t.reviewer.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [statusFilter, searchQuery]);

  // Paginated
  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  // Team stats
  const teamStats = useMemo(() => {
    const stats: Record<string, { done: number; inProgress: number; pending: number; total: number }> = {};
    analyticsData.forEach((t) => {
      if (!stats[t.reviewer]) {
        stats[t.reviewer] = { done: 0, inProgress: 0, pending: 0, total: 0 };
      }
      stats[t.reviewer].total++;
      if (t.status === 'Done') stats[t.reviewer].done++;
      else if (t.status === 'In Process') stats[t.reviewer].inProgress++;
      else stats[t.reviewer].pending++;
    });
    return Object.entries(stats)
      .map(([name, s]) => ({ name, ...s }))
      .filter((s) => s.name !== 'Assign reviewer')
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
  }, []);

  const completionRate = Math.round((kpis.completed / kpis.total) * 100);

  // KPI Card component
  const KpiCard = ({
    title,
    value,
    change,
    trend,
    icon: Icon,
  }: {
    title: string;
    value: number | string;
    change: string;
    trend: 'up' | 'down';
    icon: any;
  }) => (
    <Card
      elevation={0}
      sx={{
        background: 'linear-gradient(to top, rgba(17,24,39,0.03), #FFFFFF)',
        border: '1px solid #E5E7EB',
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography
            sx={{
              fontFamily: 'Poppins, sans-serif !important',
              fontSize: '0.75rem',
              color: '#6B7280',
              fontWeight: 500,
            }}
          >
            {title}
          </Typography>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              bgcolor: '#F3F4F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon sx={{ fontSize: 18, color: '#374151' }} />
          </Box>
        </Box>
        <Typography
          sx={{
            fontFamily: 'Poppins, sans-serif !important',
            fontSize: '1.75rem',
            fontWeight: 600,
            color: '#111827',
            lineHeight: 1.1,
            mb: 1,
          }}
        >
          {value}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Chip
            size="small"
            icon={trend === 'up' ? <TrendingUpIcon sx={{ fontSize: 12 }} /> : <TrendingDownIcon sx={{ fontSize: 12 }} />}
            label={change}
            sx={{
              height: 20,
              fontSize: '0.65rem',
              fontFamily: 'Poppins, sans-serif !important',
              bgcolor: trend === 'up' ? '#F0FDF4' : '#FEF2F2',
              color: trend === 'up' ? '#166534' : '#991B1B',
              border: `1px solid ${trend === 'up' ? '#86EFAC' : '#FCA5A5'}`,
              '& .MuiChip-icon': { fontSize: 12 },
              '& .MuiChip-label': { px: 0.75 },
            }}
          />
          <Typography
            sx={{
              fontFamily: 'Poppins, sans-serif !important',
              fontSize: '0.65rem',
              color: '#6B7280',
            }}
          >
            vs last period
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ChartIcon sx={{ fontSize: 28, color: '#111827' }} />
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
              Project Analytics
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Poppins, sans-serif !important',
                fontSize: '0.8rem',
                color: '#6B7280',
              }}
            >
              Track progress and team performance
            </Typography>
          </Box>
        </Box>

        {/* Project Dropdown */}
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel
            sx={{
              fontFamily: 'Poppins, sans-serif !important',
              fontSize: '0.8rem',
            }}
          >
            Select Project
          </InputLabel>
          <Select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            label="Select Project"
            sx={{
              fontFamily: 'Poppins, sans-serif !important',
              borderRadius: 1.5,
              fontSize: '0.8rem',
              bgcolor: '#FFFFFF',
              '& .MuiSelect-select': {
                fontFamily: 'Poppins, sans-serif !important',
                fontSize: '0.8rem',
                py: 1,
              },
            }}
          >
            {PROJECTS.map((p) => (
              <MenuItem
                key={p.id}
                value={p.id}
                sx={{
                  fontFamily: 'Poppins, sans-serif !important',
                  fontSize: '0.8rem',
                }}
              >
                {p.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* KPI Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 2,
          mb: 3,
        }}
      >
        <KpiCard title="Total Tasks" value={kpis.total} change="+12.5%" trend="up" icon={TaskIcon} />
        <KpiCard title="Pending" value={kpis.pending} change="-3.2%" trend="down" icon={PauseIcon} />
        <KpiCard title="In Progress" value={kpis.inProgress} change="+8.4%" trend="up" icon={HourglassIcon} />
        <KpiCard title="Completed" value={kpis.completed} change="+15.2%" trend="up" icon={CheckCircleIcon} />
      </Box>

      {/* Completion Progress */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          border: '1px solid #E5E7EB',
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography
            sx={{
              fontFamily: 'Poppins, sans-serif !important',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#111827',
            }}
          >
            Overall Completion
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Poppins, sans-serif !important',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#111827',
            }}
          >
            {completionRate}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={completionRate}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: '#F3F4F6',
            '& .MuiLinearProgress-bar': {
              bgcolor: '#111827',
              borderRadius: 4,
            },
          }}
        />
      </Paper>

      {/* Chart + Team Stats */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 2,
          mb: 3,
        }}
      >
        {/* Chart */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            border: '1px solid #E5E7EB',
            borderRadius: 2,
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Poppins, sans-serif !important',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: '#111827',
              mb: 0.25,
            }}
          >
            Task Status Over Time
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Poppins, sans-serif !important',
              fontSize: '0.7rem',
              color: '#6B7280',
              mb: 2,
            }}
          >
            Last 6 months
          </Typography>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorInProgress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6B7280" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6B7280" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fontFamily: 'Poppins' }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fontFamily: 'Poppins' }}
              />
              <RechartsTooltip
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid #E5E7EB',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '0.75rem',
                }}
              />
              <Legend
                wrapperStyle={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '0.7rem',
                }}
              />
              <Area
                type="monotone"
                dataKey="completed"
                stroke="#10B981"
                fill="url(#colorCompleted)"
                strokeWidth={2}
                name="Completed"
              />
              <Area
                type="monotone"
                dataKey="inProgress"
                stroke="#F59E0B"
                fill="url(#colorInProgress)"
                strokeWidth={2}
                name="In Progress"
              />
              <Area
                type="monotone"
                dataKey="pending"
                stroke="#6B7280"
                fill="url(#colorPending)"
                strokeWidth={2}
                name="Pending"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Paper>

        {/* Team Progress */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            border: '1px solid #E5E7EB',
            borderRadius: 2,
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Poppins, sans-serif !important',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: '#111827',
              mb: 0.25,
            }}
          >
            Team Progress
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Poppins, sans-serif !important',
              fontSize: '0.7rem',
              color: '#6B7280',
              mb: 2,
            }}
          >
            Top contributors
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {teamStats.map((member) => {
              const rate = Math.round((member.done / member.total) * 100);
              return (
                <Box key={member.name}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          fontSize: '0.65rem',
                          bgcolor: '#F3F4F6',
                          color: '#374151',
                        }}
                      >
                        {member.name.charAt(0)}
                      </Avatar>
                      <Typography
                        sx={{
                          fontFamily: 'Poppins, sans-serif !important',
                          fontSize: '0.75rem',
                          color: '#374151',
                          fontWeight: 500,
                        }}
                      >
                        {member.name}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins, sans-serif !important',
                        fontSize: '0.7rem',
                        color: '#6B7280',
                      }}
                    >
                      {member.done}/{member.total}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={rate}
                    sx={{
                      height: 5,
                      borderRadius: 3,
                      bgcolor: '#F3F4F6',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: rate > 70 ? '#10B981' : rate > 40 ? '#F59E0B' : '#DC2626',
                        borderRadius: 3,
                      },
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        </Paper>
      </Box>

      {/* Detailed Table — NEW DESIGN */}
      <Paper
        elevation={0}
        sx={{
          border: '1px solid #E5E7EB',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        {/* Table Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: 'Poppins, sans-serif !important',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#111827',
              }}
            >
              Project Details
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Poppins, sans-serif !important',
                fontSize: '0.7rem',
                color: '#6B7280',
              }}
            >
              {filteredData.length} tasks found
            </Typography>
          </Box>
          <TextField
            size="small"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
            sx={{
              minWidth: 240,
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5,
                fontSize: '0.8rem',
              },
              '& .MuiOutlinedInput-input': {
                fontFamily: 'Poppins, sans-serif !important',
                fontSize: '0.8rem',
                py: 0.75,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: '#9CA3AF' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Status Tabs */}
        <Box sx={{ borderBottom: '1px solid #E5E7EB', px: 2 }}>
          <Tabs
            value={statusFilter}
            onChange={(_, v) => {
              setStatusFilter(v);
              setPage(0);
            }}
            sx={{
              minHeight: 40,
              '& .MuiTab-root': {
                fontFamily: 'Poppins, sans-serif !important',
                fontSize: '0.75rem',
                textTransform: 'none',
                minHeight: 40,
                py: 0.5,
              },
            }}
          >
            <Tab label={`All (${analyticsData.length})`} value="all" />
            <Tab label={`Done (${kpis.completed})`} value="Done" />
            <Tab label={`In Progress (${kpis.inProgress})`} value="In Process" />
            <Tab label={`Pending (${kpis.pending})`} value="Pending" />
          </Tabs>
        </Box>

        {/* Table — New Design */}
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                <TableCell
                  sx={{
                    fontFamily: 'Poppins, sans-serif !important',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Project
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: 'Poppins, sans-serif !important',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: 'Poppins, sans-serif !important',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Team
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontFamily: 'Poppins, sans-serif !important',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Start
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontFamily: 'Poppins, sans-serif !important',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  End
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontFamily: 'Poppins, sans-serif !important',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Due
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((task) => {
                const variant = STATUS_VARIANTS[task.status] || STATUS_VARIANTS['Planning'];
                // Pick a random-ish team based on task id
                const teamCount = (task.id % 3) + 1;
                const team = TEAM_MEMBERS.slice(0, teamCount);
                const extra = task.id % 4;

                return (
                  <TableRow
                    key={task.id}
                    sx={{
                      '&:hover': { bgcolor: '#F9FAFB' },
                      '&:last-child td': { borderBottom: 'none' },
                    }}
                  >
                    {/* Project Column */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 1,
                            bgcolor: '#F3F4F6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <FolderIcon sx={{ fontSize: 16, color: '#6B7280' }} />
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontFamily: 'Poppins, sans-serif !important',
                              fontSize: '0.8rem',
                              fontWeight: 500,
                              color: '#111827',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {task.header}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: 'Poppins, sans-serif !important',
                              fontSize: '0.7rem',
                              color: '#6B7280',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {task.reviewer}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Status Column */}
                    <TableCell>
                      <Chip
                        label={task.status}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: '0.7rem',
                          fontFamily: 'Poppins, sans-serif !important',
                          bgcolor: variant.bg,
                          color: variant.color,
                          border: `1px solid ${variant.border}`,
                          fontWeight: 500,
                          '& .MuiChip-label': { px: 1 },
                        }}
                      />
                    </TableCell>

                    {/* Team Column */}
                    <TableCell>
                      <AvatarGroup
                        max={3}
                        sx={{
                          '& .MuiAvatar-root': {
                            width: 24,
                            height: 24,
                            fontSize: '0.65rem',
                            border: '2px solid #FFFFFF',
                          },
                        }}
                      >
                        {team.map((member) => (
                          <Avatar
                            key={member.fallback}
                            src={member.src}
                            alt={member.fallback}
                          >
                            {member.fallback}
                          </Avatar>
                        ))}
                        {extra > 0 && (
                          <Avatar
                            sx={{
                              bgcolor: '#F3F4F6',
                              color: '#6B7280',
                              fontSize: '0.6rem',
                              width: 24,
                              height: 24,
                            }}
                          >
                            +{extra}
                          </Avatar>
                        )}
                      </AvatarGroup>
                    </TableCell>

                    {/* Start Date */}
                    <TableCell
                      align="right"
                      sx={{
                        fontFamily: 'Poppins, sans-serif !important',
                        fontSize: '0.75rem',
                        color: '#6B7280',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {getStartDate(task.id)}
                    </TableCell>

                    {/* End Date */}
                    <TableCell
                      align="right"
                      sx={{
                        fontFamily: 'Poppins, sans-serif !important',
                        fontSize: '0.75rem',
                        color: '#6B7280',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {getEndDate(task.id)}
                    </TableCell>

                    {/* Due Date */}
                    <TableCell
                      align="right"
                      sx={{
                        fontFamily: 'Poppins, sans-serif !important',
                        fontSize: '0.75rem',
                        color: '#111827',
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {getDueDate(task.id)}
                    </TableCell>
                  </TableRow>
                );
              })}
              {paginatedData.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{
                      py: 6,
                      fontFamily: 'Poppins, sans-serif !important',
                      fontSize: '0.8rem',
                      color: '#9CA3AF',
                    }}
                  >
                    No tasks found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredData.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 20, 30, 50]}
          sx={{
            borderTop: '1px solid #E5E7EB',
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontFamily: 'Poppins, sans-serif !important',
              fontSize: '0.75rem',
            },
            '& .MuiTablePagination-select': {
              fontFamily: 'Poppins, sans-serif !important',
              fontSize: '0.75rem',
            },
          }}
        />
      </Paper>
    </Box>
  );
}