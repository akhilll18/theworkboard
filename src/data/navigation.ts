import {
  Dashboard,
  ViewKanban,
  Assignment,
  People,
  Settings,
  Help,
  BarChart,
  Apps,
} from '@mui/icons-material';

export interface NavItem {
  label: string;
  icon?: React.ElementType;
  type: 'dropdown' | 'link' | 'divider';
  href?: string;
  items?: NavItem[];
  badge?: number;
}

export const navigationData: NavItem[] = [
  {
    label: 'Overview',
    icon: Dashboard,
    type: 'link',
    href: '/overview',
  },
  {
    label: 'Boards',
    icon: ViewKanban,
    type: 'dropdown',
    items: [
      { label: 'My Boards', type: 'link', href: '/boards/my' },
      { label: 'Team Boards', type: 'link', href: '/boards/team' },
      { label: 'Archived', type: 'link', href: '/boards/archived' },
    ],
  },
  {
    label: 'Tickets',
    icon: Assignment,
    type: 'dropdown',
    items: [
      { label: 'All Tickets', type: 'link', href: '/tickets/all' },
      { label: 'My Tickets', type: 'link', href: '/tickets/my' },
      { label: 'Sprint Backlog', type: 'link', href: '/tickets/backlog' },
    ],
  },
  {
    label: 'Team',
    icon: People,
    type: 'link',
    href: '/team',
  },
  {
    label: 'Analytics',
    icon: BarChart,
    type: 'link',
    href: '/analytics',
  },
  {
    type: 'divider',
    label: '',
    icon: undefined,
  },
  {
    label: 'Integrations',
    icon: Apps,
    type: 'dropdown',
    items: [
      { label: 'GitHub', type: 'link', href: '/integrations/github' },
      { label: 'Slack', type: 'link', href: '/integrations/slack' },
      { label: 'Jira', type: 'link', href: '/integrations/jira' },
    ],
  },
  {
    label: 'Settings',
    icon: Settings,
    type: 'link',
    href: '/settings',
  },
  {
    label: 'Help',
    icon: Help,
    type: 'link',
    href: '/help',
  },
];