// src/types/kanban.ts
export type Priority = 'low' | 'medium' | 'high';
export type ColumnId = 'todo' | 'inProgress' | 'review' | 'done' | string;

export interface Assignee {
  name: string;
  avatar: string;
}

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  file?: File;
  url?: string;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
}

// Card options
export interface CardOptions {
  priority?: Priority | string;
  status?: string;
  risk?: string;
  effort?: string;
}

export interface Task {
  id: string;
  code: string;
  title: string;
  description: string;
  priority: Priority;
  assignees: Assignee[];
  startDate?: string;
  endDate?: string;
  dueDate?: string;
  gracePeriod?: number;
  cardColor?: string;
  estimate: string;
  labels: string[];
  attachments: Attachment[];
  comments: Comment[];
  subtasks: Subtask[];
  progress: number;
  columnId: ColumnId;
  // New card options
  cardOptions?: CardOptions;
  isCustomColumn?: boolean; // Flag to identify cards in custom columns
}

export interface Column {
  id: ColumnId;
  title: string;
  color: string;
  tasks: Task[];
  isCustom?: boolean; // Flag for user-created columns
}