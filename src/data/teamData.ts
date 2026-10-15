// src/data/teamData.ts
import { TeamMember } from '../types/member';

export const TEAM_MEMBERS: TeamMember[] = [
  // CEO
  {
    id: 'ceo',
    name: 'M. Praveen Reddy',
    role: 'CEO',
    team: 'Leadership',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=96&h=96&dpr=2&q=80',
    initials: 'PR',
    email: 'praveenreddy@workora.com',
    phone: '+91 1234567890',
    location: 'Gachibowli',
    managerId: null,
  },

  // === Direct reports to CEO ===

  // Head of Department (was Head of Design)
  {
    id: 'vijay',
    name: 'Vijay',
    role: 'Head of Department',
    team: 'Design',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80',
    initials: 'VJ',
    email: 'vijay@workora.com',
    phone: '+91 1234567890',
    location: 'Kukatpally',
    managerId: 'ceo',
  },

  // Head of Sales (was Mike Perkins → Priya)
  {
    id: 'priya',
    name: 'Priya',
    role: 'Head of Sales',
    team: 'Sales',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&dpr=2&q=80',
    initials: 'PR',
    email: 'priya@workora.com',
    phone: '+91 1234567890',
    location: 'Nizampet',
    managerId: 'ceo',
  },

  // HR (new — under CEO)
  {
    id: 'swetha',
    name: 'Swetha',
    role: 'HR Manager',
    team: 'Leadership',
    avatar: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80',
    initials: 'SW',
    email: 'swetha@workora.com',
    phone: '+91 1234567890',
    location: 'JNTU',
    managerId: 'ceo',
  },

  // === Under Vijay (Head of Department) ===

  // UI Team Lead (was Susan Smith → Akhil)
  {
    id: 'akhil',
    name: 'Akhil',
    role: 'UI Team Lead',
    team: 'Design',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&dpr=2&q=80',
    initials: 'AK',
    email: 'akhil@workora.com',
    phone: '+91 1234567890',
    location: 'Lingampally',
    managerId: 'vijay',
  },

  // === Under Akhil (UI Team Lead) ===
  {
    id: 'ashok',
    name: 'Ashok',
    role: 'UI Designer',
    team: 'Design',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&dpr=2&q=80',
    initials: 'AS',
    email: 'ashok@workora.com',
    phone: '+91 1234567890',
    location: 'Pragathinagar',
    managerId: 'akhil',
  },
  {
    id: 'bindu',
    name: 'Bindu',
    role: 'UI Designer',
    team: 'Design',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&h=96&dpr=2&q=80',
    initials: 'BN',
    email: 'bindu@workora.com',
    phone: '+91 1234567890',
    location: 'Moosapet',
    managerId: 'akhil',
  },
  {
    id: 'karthick',
    name: 'Karthick',
    role: 'Product Designer',
    team: 'Design',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&dpr=2&q=80',
    initials: 'KT',
    email: 'karthick@workora.com',
    phone: '+91 1234567890',
    location: 'Gachibowli',
    managerId: 'akhil',
  },
  {
    id: 'sudhakar',
    name: 'Sudhakar',
    role: 'UX Designer',
    team: 'Design',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&dpr=2&q=80',
    initials: 'SD',
    email: 'sudhakar@workora.com',
    phone: '+91 1234567890',
    location: 'Kukatpally',
    managerId: 'akhil',
  },
  {
    id: 'ram',
    name: 'Ram',
    role: 'UI Designer',
    team: 'Design',
    avatar: 'https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=96&h=96&dpr=2&q=80',
    initials: 'RM',
    email: 'ram@workora.com',
    phone: '+91 1234567890',
    location: 'Nizampet',
    managerId: 'akhil',
  },
  {
    id: 'madhan',
    name: 'Madhan',
    role: 'UI Designer',
    team: 'Design',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80',
    initials: 'MD',
    email: 'madhan@workora.com',
    phone: '+91 1234567890',
    location: 'JNTU',
    managerId: 'akhil',
  },
];