import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { Play, Pause, RotateCcw, Clock, Infinity } from 'lucide-react';
import { RootState } from '../store';
import { startTimer, stopTimer, resetTimer, setDuration, setInfiniteMode } from '../store/slices/timerSlice';
import { updateTaskTimeTracked } from '../store/slices/tasksSlice';

export const Timer: React.FC = () => {
  const dispatch = useDispatch();
  const { duration, isRunning, startTime, taskId, isInfinite, customDuration } = useSelector((state: RootState) => state.timer);
  const tasks = useSelector((state: RootState) => state.tasks.items);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>(taskId);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);

  const selectedTask = tasks.find(task => task.id === selectedTaskId);

  useEffect(() => {
    let interval: number;

    if (isRunning && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const start = new Date(startTime);
        const elapsed = Math.floor((now.getTime() - start.getTime()) / 1000);

        // Update time tracked every minute
        if (selectedTaskId && (!lastUpdateTime || (now.getTime() - lastUpdateTime.getTime()) >= 60000)) {
          const timeToAdd = lastUpdateTime 
            ? Math.floor((now.getTime() - lastUpdateTime.getTime()) / 1000)
            : 60;
          dispatch(updateTaskTimeTracked({ id: selectedTaskId, timeToAdd }));
          setLastUpdateTime(now);
        }

        if (!isInfinite) {
          const remaining = Math.max(0, duration - elapsed);
          setTimeLeft(remaining);
          if (remaining === 0) {
            dispatch(stopTimer());
            setLastUpdateTime(null);
          }
        } else {
          setTimeLeft(elapsed);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, startTime, duration, dispatch, isInfinite, selectedTaskId, lastUpdateTime]);

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return hrs > 0 
      ? `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      : `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    if (isRunning) {
      dispatch(stopTimer());
      setLastUpdateTime(null);
    } else {
      dispatch(startTimer(selectedTaskId));
      setLastUpdateTime(new Date());
    }
  };

  const handleReset = () => {
    dispatch(resetTimer());
    setTimeLeft(isInfinite ? 0 : duration);
    setLastUpdateTime(null);
  };

  const handleDurationChange = (mins: number) => {
    dispatch(setDuration(mins * 60));
    setTimeLeft(mins * 60);
    dispatch(setInfiniteMode(false));
  };

  const toggleInfinite = () => {
    const newInfiniteState = !isInfinite;
    dispatch(setInfiniteMode(newInfiniteState));
    if (newInfiniteState) {
      setTimeLeft(0);
    } else {
      dispatch(setDuration(customDuration * 60));
      setTimeLeft(customDuration * 60);
    }
  };

  return (
    <div className="bg-gray-900 p-8 rounded-lg shadow-xl">
      <h2 className="text-2xl font-semibold text-cyan-400 mb-6">Focus Time</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">Select Task</label>
        <select
          value={selectedTaskId || ''}
          onChange={(e) => setSelectedTaskId(e.target.value || undefined)}
          className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <option value="">No task selected</option>
          {tasks.map(task => (
            <option key={task.id} value={task.id}>{task.title}</option>
          ))}
        </select>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Duration (minutes)</label>
          <input
            type="number"
            min="1"
            value={customDuration}
            onChange={(e) => handleDurationChange(parseInt(e.target.value) || 25)}
            disabled={isInfinite || isRunning}
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Timer Mode</label>
          <button
            onClick={toggleInfinite}
            disabled={isRunning}
            className={`w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              isInfinite 
                ? 'bg-cyan-400 text-gray-900 hover:bg-cyan-300' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            } disabled:opacity-50`}
          >
            <Infinity size={20} />
            {isInfinite ? 'Set Limit' : 'No Limit'}
          </button>
        </div>
      </div>

      <div className="text-7xl font-mono text-cyan-400 mb-8 text-center">
        {isInfinite && !isRunning ? '--:--' : formatTime(timeLeft)}
      </div>

      {selectedTask && (
        <div className="mb-6 text-center text-gray-300">
          Working on: <span className="text-cyan-400">{selectedTask.title}</span>
        </div>
      )}

      <div className="flex justify-center gap-4">
        <button
          onClick={handleStartStop}
          disabled={!selectedTaskId}
          className="bg-cyan-400 text-gray-900 p-3 rounded-full hover:bg-cyan-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button
          onClick={handleReset}
          disabled={!selectedTaskId}
          className="bg-gray-700 text-cyan-400 p-3 rounded-full hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  );
};