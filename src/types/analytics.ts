// src/types/analytics.ts

export interface TaskAnalytic {
  id: number;
  header: string;
  type: string;
  status: 'Done' | 'In Process' | 'Pending';
  target: string;
  limit: string;
  reviewer: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
}

export const PROJECTS: Project[] = [
  { id: 'foyer', name: 'FOYER Project', description: 'Front-office modernization' },
  { id: 'emr', name: 'EMR Innovation', description: 'Electronic medical records platform' },
  { id: 'dashboard', name: 'Analytics Dashboard', description: 'Admin analytics for teams' },
  { id: 'mobile', name: 'Mobile App v2', description: 'Next-gen mobile experience' },
];

export const STATUS_COLORS: Record<string, { bg: string; color: string; border: string; icon: string }> = {
  Done: { bg: '#F0FDF4', color: '#166534', border: '#86EFAC', icon: '✅' },
  'In Process': { bg: '#FEF3C7', color: '#92400E', border: '#FCD34D', icon: '⏳' },
  Pending: { bg: '#F3F4F6', color: '#374151', border: '#D1D5DB', icon: '⏸️' },
};