// src/data/membersData.ts

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar: string;
  initials: string;
  position: string;
}

export const MEMBERS: Member[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80',
    initials: 'AJ',
    position: 'Software Engineer',
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    avatar: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80',
    initials: 'SC',
    position: 'Product Manager',
  },
  {
    id: '3',
    name: 'Michael Rodriguez',
    email: 'michael@example.com',
    avatar: 'https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=96&h=96&dpr=2&q=80',
    initials: 'MR',
    position: 'UX Designer',
  },
  {
    id: '4',
    name: 'Emma Wilson',
    email: 'emma@example.com',
    avatar: 'https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=96&h=96&dpr=2&q=80',
    initials: 'EW',
    position: 'Technical Lead',
  },
  {
    id: '5',
    name: 'David Kim',
    email: 'david@example.com',
    avatar: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=96&h=96&dpr=2&q=80',
    initials: 'DK',
    position: 'CTO',
  },
  {
    id: '6',
    name: 'Aron Thompson',
    email: 'aron@example.com',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=96&h=96&dpr=2&q=80',
    initials: 'AT',
    position: 'Software Engineer',
  },
  {
    id: '7',
    name: 'James Brown',
    email: 'james@example.com',
    avatar: 'https://images.unsplash.com/photo-1543299750-19d1d6297053?w=96&h=96&dpr=2&q=80',
    initials: 'JB',
    position: 'Product Manager',
  },
  {
    id: '8',
    name: 'Maria Garcia',
    email: 'maria@example.com',
    avatar: 'https://images.unsplash.com/photo-1620075225255-8c2051b6c015?w=96&h=96&dpr=2&q=80',
    initials: 'MG',
    position: 'UX Designer',
  },
  {
    id: '9',
    name: 'Nick Johnson',
    email: 'nick@example.com',
    avatar: 'https://images.unsplash.com/photo-1485206412256-701ccc5b93ca?w=96&h=96&dpr=2&q=80',
    initials: 'NJ',
    position: 'Technical Lead',
  },
  {
    id: '10',
    name: 'Liam Thompson',
    email: 'liam@example.com',
    avatar: 'https://images.unsplash.com/photo-1542595913-85d69b0edbaf?w=96&h=96&dpr=2&q=80',
    initials: 'LT',
    position: 'CTO',
  },
];