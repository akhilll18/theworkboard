// src/types/member.ts

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  team: 'Leadership' | 'Design' | 'Sales' | 'Marketing' | 'Engineering';
  avatar: string;
  initials: string;
  email?: string;
  phone?: string;
  location?: string;
  managerId?: string | null;
}

export const TEAM_COLORS: Record<string, { dot: string; bg: string; text: string }> = {
  Leadership: { dot: '#3B82F6', bg: '#EFF6FF', text: '#1E40AF' },
  Design: { dot: '#8B5CF6', bg: '#F5F3FF', text: '#5B21B6' },
  Sales: { dot: '#10B981', bg: '#F0FDF4', text: '#166534' },
  Marketing: { dot: '#F59E0B', bg: '#FFFBEB', text: '#92400E' },
  Engineering: { dot: '#0EA5E9', bg: '#F0F9FF', text: '#075985' },
};