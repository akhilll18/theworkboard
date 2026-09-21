// src/data/kanbanData.ts
import { ColumnId, Task } from '../types/kanban';

// Start with empty fixed columns
export const initialTasks: Record<ColumnId, Task[]> = {
  todo: [],
  inProgress: [],
  review: [],
  done: [],
};

// Fixed column configuration
export const fixedColumns: { id: ColumnId; title: string; color: string; dotColor: string }[] = [
  { id: 'todo', title: 'To Do', color: '#000000', dotColor: '#000000' },
  { id: 'inProgress', title: 'In Progress', color: '#000000', dotColor: '#000000' },
  { id: 'review', title: 'Review', color: '#000000', dotColor: '#000000' },
  { id: 'done', title: 'Done', color: '#000000', dotColor: '#000000' },
];

// Store custom columns separately
export let customColumns: { id: string; title: string; color: string; dotColor: string }[] = [];

// Helper to create a new custom column
export const createCustomColumn = (title: string) => {
  const id = `custom-${Date.now()}`;
  customColumns.push({
    id,
    title,
    color: '#000000',
    dotColor: '#000000',
  });
  return id;
};