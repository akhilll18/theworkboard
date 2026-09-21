// src/types/note.ts
export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export const NOTE_COLORS = [
  { name: 'White', value: '#FFFFFF', border: '#E5E7EB', text: '#111827' },
  { name: 'Black', value: '#1F2937', border: '#111827', text: '#FFFFFF' },
  { name: 'Yellow', value: '#FEF3C7', border: '#FCD34D', text: '#78350F' },
  { name: 'Green', value: '#D1FAE5', border: '#6EE7B7', text: '#065F46' },
  { name: 'Blue', value: '#DBEAFE', border: '#93C5FD', text: '#1E40AF' },
  { name: 'Purple', value: '#EDE9FE', border: '#C4B5FD', text: '#5B21B6' },
  { name: 'Orange', value: '#FFEDD5', border: '#FDBA74', text: '#9A3412' },
  { name: 'Red', value: '#FEE2E2', border: '#FCA5A5', text: '#991B1B' },
];