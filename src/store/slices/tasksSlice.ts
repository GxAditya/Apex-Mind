import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { format } from 'date-fns';
import { Task } from '../../types';

interface TasksState {
  items: Task[];
}

const initialState: TasksState = {
  items: [],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.items.push({
        ...action.payload,
        dailyTimeTracked: {},
        timeTracked: 0,
      });
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.items.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = {
          ...action.payload,
          dailyTimeTracked: state.items[index].dailyTimeTracked || {},
        };
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(task => task.id !== action.payload);
    },
    updateTaskStatus: (state, action: PayloadAction<{ id: string; status: Task['status'] }>) => {
      const task = state.items.find(task => task.id === action.payload.id);
      if (task) {
        task.status = action.payload.status;
        task.updatedAt = new Date().toISOString();
        if (action.payload.status === 'done') {
          task.completedAt = new Date().toISOString();
        } else {
          task.completedAt = undefined;
        }
      }
    },
    updateTaskTimeTracked: (state, action: PayloadAction<{ id: string; timeToAdd: number }>) => {
      const task = state.items.find(task => task.id === action.payload.id);
      if (task) {
        const today = format(new Date(), 'yyyy-MM-dd');
        if (!task.dailyTimeTracked) {
          task.dailyTimeTracked = {};
        }
        task.dailyTimeTracked[today] = (task.dailyTimeTracked[today] || 0) + action.payload.timeToAdd;
        task.timeTracked = task.dailyTimeTracked[today];
      }
    },
    resetDailyTracking: (state) => {
      const today = format(new Date(), 'yyyy-MM-dd');
      state.items.forEach(task => {
        if (!task.dailyTimeTracked) {
          task.dailyTimeTracked = {};
        }
        task.timeTracked = task.dailyTimeTracked[today] || 0;
      });
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskTimeTracked,
  resetDailyTracking,
} = tasksSlice.actions;

export default tasksSlice.reducer;