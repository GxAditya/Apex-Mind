import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Timer } from '../../types';

interface TimerState extends Timer {
  isInfinite: boolean;
  customDuration: number;
}

const initialState: TimerState = {
  duration: 1500, // 25 minutes in seconds
  isRunning: false,
  startTime: undefined,
  taskId: undefined,
  timeElapsed: 0,
  isInfinite: false,
  customDuration: 25,
};

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    startTimer: (state, action: PayloadAction<string | undefined>) => {
      state.isRunning = true;
      state.startTime = new Date().toISOString();
      state.taskId = action.payload;
    },
    stopTimer: (state) => {
      state.isRunning = false;
      if (state.startTime) {
        const elapsed = Math.floor((new Date().getTime() - new Date(state.startTime).getTime()) / 1000);
        state.timeElapsed += elapsed;
      }
      state.startTime = undefined;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
      state.customDuration = Math.floor(action.payload / 60);
    },
    resetTimer: (state) => {
      state.isRunning = false;
      state.startTime = undefined;
      state.taskId = undefined;
      state.timeElapsed = 0;
    },
    setInfiniteMode: (state, action: PayloadAction<boolean>) => {
      state.isInfinite = action.payload;
    },
  },
});

export const { startTimer, stopTimer, setDuration, resetTimer, setInfiniteMode } = timerSlice.actions;
export default timerSlice.reducer;