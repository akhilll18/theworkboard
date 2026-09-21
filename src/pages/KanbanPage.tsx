// src/pages/KanbanPage.tsx
import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { KanbanBoard } from '../components/Kanban/KanbanBoard';
import { AddTaskModal } from '../components/Kanban/AddTaskModal';
import { TaskDetailModal } from '../components/Kanban/TaskDetailModal';
import { Task, ColumnId } from '../types/kanban';
import { initialTasks } from '../data/kanbanData';
import { useToast } from '../context/ToastContext';
import { format } from 'date-fns';

export const CREATE_TASK_EVENT = 'create-task';

export function KanbanPage() {
  const { showToast } = useToast();
  const [tasks, setTasks] = useState<Record<ColumnId, Task[]>>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [addTaskColumn, setAddTaskColumn] = useState<ColumnId>('todo');
  const [detailOpen, setDetailOpen] = useState(false);
  const [customColumnList, setCustomColumnList] = useState<any[]>([]);

  useEffect(() => {
    const handleCreateTask = (event: Event) => {
      const customEvent = event as CustomEvent;
      const columnId = customEvent.detail?.columnId || 'todo';
      const columnTitle = customEvent.detail?.columnTitle || 'New List';

      const newColumnId = `custom-${Date.now()}`;
      setTasks((prev) => ({
        ...prev,
        [newColumnId]: [],
      }));

      setCustomColumnList((prev) => [
        ...prev,
        { id: newColumnId, title: columnTitle, color: '#000000', dotColor: '#000000' },
      ]);

      // ✅ TOAST: Column created
      showToast(
        'Column has been created',
        `"${columnTitle}" was added to your board`,
        'success'
      );
    };

    window.addEventListener(CREATE_TASK_EVENT, handleCreateTask);
    return () => window.removeEventListener(CREATE_TASK_EVENT, handleCreateTask);
  }, [showToast]);

  const handleAddTask = (columnId: ColumnId) => {
    setAddTaskColumn(columnId);
    setAddTaskOpen(true);
  };

  const handleTaskAdd = (newTask: Task) => {
    setTasks((prev) => ({
      ...prev,
      [newTask.columnId]: [...(prev[newTask.columnId] || []), newTask],
    }));
    setAddTaskOpen(false);

    // ✅ TOAST: Task created
    showToast(
      'Task has been created',
      `"${newTask.title}" · ${format(new Date(), 'EEEE, MMMM do')} at ${format(new Date(), 'h:mm a')}`,
      'success'
    );
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setDetailOpen(true);
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks((prev) => {
      const newTasks = { ...prev };
      Object.keys(newTasks).forEach((key) => {
        newTasks[key as ColumnId] = (newTasks[key as ColumnId] || []).filter(
          (t) => t.id !== updatedTask.id
        );
      });
      newTasks[updatedTask.columnId] = [
        ...(newTasks[updatedTask.columnId] || []),
        updatedTask,
      ];
      return newTasks;
    });
    setSelectedTask(updatedTask);
  };

  const handleTaskDelete = (taskId: string) => {
    const taskToDelete = Object.values(tasks)
      .flat()
      .find((t) => t.id === taskId);

    setTasks((prev) => {
      const newTasks = { ...prev };
      Object.keys(newTasks).forEach((key) => {
        newTasks[key as ColumnId] = (newTasks[key as ColumnId] || []).filter(
          (t) => t.id !== taskId
        );
      });
      return newTasks;
    });
    setDetailOpen(false);
    setSelectedTask(null);

    // ✅ TOAST: Task deleted
    showToast(
      'Task has been deleted',
      taskToDelete ? `"${taskToDelete.title}" was removed` : undefined,
      'info'
    );
  };

  return (
    <Box>
      <KanbanBoard
        onTaskClick={handleTaskClick}
        onAddTask={handleAddTask}
        tasks={tasks}
        customColumns={customColumnList}
      />

      <AddTaskModal
        open={addTaskOpen}
        onClose={() => setAddTaskOpen(false)}
        columnId={addTaskColumn}
        onAdd={handleTaskAdd}
      />

      <TaskDetailModal
        open={detailOpen}
        task={selectedTask}
        onClose={() => {
          setDetailOpen(false);
          setSelectedTask(null);
        }}
        onUpdate={handleTaskUpdate}
        onDelete={handleTaskDelete}
      />
    </Box>
  );
}