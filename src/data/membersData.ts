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
    name: 'praveen reddy',
    email: 'praveen@example.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80',
    initials: 'PR',
    position: 'Software Engineer',
  },
  {
    id: '2',
    name: 'Akhil Reddy',
    email: 'akhil@example.com',
    avatar: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80',
    initials: 'AR',
    position: 'Product Manager',
  },
  {
    id: '3',
    name: 'Ashok Reddy',
    email: 'ashok@example.com',
    avatar: 'https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=96&h=96&dpr=2&q=80',
    initials: 'AR',
    position: 'UX Designer',
  },
  {
    id: '4',
    name: 'Karthikeya Reddy',
    email: 'karthikeya@example.com',
    avatar: 'https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=96&h=96&dpr=2&q=80',
    initials: 'KR',
    position: 'Technical Lead',
  },
  {
    id: '5',
    name: 'Bindu ',
    email: 'bindu@example.com',
    avatar: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=96&h=96&dpr=2&q=80',
    initials: 'BR',
    position: 'CTO',
  },
  {
    id: '6',
    name: 'Gautham',
    email: 'gautham@example.com',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=96&h=96&dpr=2&q=80',
    initials: 'GR',
    position: 'Software Engineer',
  },
  {
    id: '7',
    name: 'Vijay Reddy',
    email: 'vijay@example.com',
    avatar: 'https://images.unsplash.com/photo-1543299750-19d1d6297053?w=96&h=96&dpr=2&q=80',
    initials: 'VR',
    position: 'Product Manager',
  },
  {
    id: '8',
    name: 'Swetha',
    email: 'swetha@example.com',
    avatar: 'https://images.unsplash.com/photo-1620075225255-8c2051b6c015?w=96&h=96&dpr=2&q=80',
    initials: 'SG',
    position: 'UX Designer',
  },
  {
    id: '9',
    name: 'Shivram ',
    email: 'shivram@example.com',
    avatar: 'https://images.unsplash.com/photo-1485206412256-701ccc5b93ca?w=96&h=96&dpr=2&q=80',
    initials: 'NJ',
    position: 'Technical Lead',
  },
  {
    id: '10',
    name: 'Krishna',
    email: 'krishna@example.com',
    avatar: 'https://images.unsplash.com/photo-1542595913-85d69b0edbaf?w=96&h=96&dpr=2&q=80',
    initials: 'LT',
    position: 'CTO',
  },
];