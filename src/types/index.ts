export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'inProgress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  completedAt?: string;
  labels: string[];
  subtasks: SubTask[];
  timeTracked: number; // in seconds
  dailyTimeTracked: { [date: string]: number }; // Track time per day
  createdAt: string;
  updatedAt: string;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Timer {
  duration: number; // in seconds
  isRunning: boolean;
  startTime?: string;
  taskId?: string;
  timeElapsed: number; // in seconds
}

export interface ThemeState {
  isDarkMode: boolean;
}