// src/lib/utils.ts

/**
 * Utility function to merge class names
 * Useful for conditional styling in MUI components
 */
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format time to readable string
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, length: number = 50): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * Generate random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Check if string is empty or whitespace
 */
export function isEmptyString(str: string | null | undefined): boolean {
  return !str || str.trim().length === 0;
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Group array by key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((acc, item) => {
    const group = String(item[key]);
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

/**
 * Get color based on status
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'todo': '#0052CC',
    'in-progress': '#FFAB00',
    'review': '#00B8D9',
    'done': '#36B37E',
    'backlog': '#5E6C84',
    'blocked': '#FF5630',
  };
  return colors[status.toLowerCase()] || '#5E6C84';
}

/**
 * Get priority color
 */
export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    'highest': '#FF5630',
    'high': '#FF8B00',
    'medium': '#FFAB00',
    'low': '#36B37E',
    'lowest': '#5E6C84',
  };
  return colors[priority.toLowerCase()] || '#5E6C84';
}