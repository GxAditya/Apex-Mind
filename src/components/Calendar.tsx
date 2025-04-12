import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, isAfter, startOfDay } from 'date-fns';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { RootState } from '../store';
import { Task } from '../types';
import { deleteTask } from '../store/slices/tasksSlice';

export const Calendar: React.FC = () => {
  const dispatch = useDispatch();
  const [currentDate, setCurrentDate] = useState(new Date());
  const tasks = useSelector((state: RootState) => state.tasks.items);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Clean up old completed tasks
  React.useEffect(() => {
    const today = startOfDay(new Date());
    tasks.forEach(task => {
      if (task.status === 'done' && task.completedAt) {
        const completionDate = new Date(task.completedAt);
        if (isAfter(today, completionDate)) {
          dispatch(deleteTask(task.id));
        }
      }
    });
  }, [tasks, dispatch]);

  const getTasksForDate = (date: Date): Task[] => {
    return tasks.filter(task => {
      if (task.status === 'done' && task.completedAt) {
        const completionDate = new Date(task.completedAt);
        return (
          completionDate.getDate() === date.getDate() &&
          completionDate.getMonth() === date.getMonth() &&
          completionDate.getFullYear() === date.getFullYear()
        );
      }
      if (task.dueDate) {
        const taskDate = new Date(task.dueDate);
        return (
          taskDate.getDate() === date.getDate() &&
          taskDate.getMonth() === date.getMonth() &&
          taskDate.getFullYear() === date.getFullYear()
        );
      }
      return false;
    });
  };

  const previousMonth = () => {
    setCurrentDate(date => new Date(date.getFullYear(), date.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(date => new Date(date.getFullYear(), date.getMonth() + 1));
  };

  return (
    <div className="bg-gray-900 p-8 rounded-lg shadow-xl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-cyan-400">Calendar</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={previousMonth}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft className="text-gray-400" />
          </button>
          <span className="text-xl font-medium text-white">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ChevronRight className="text-gray-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const dayTasks = getTasksForDate(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          
          return (
            <div
              key={day.toISOString()}
              className={`
                min-h-[100px] p-2 rounded-lg border border-gray-800
                ${isCurrentMonth ? 'bg-gray-800' : 'bg-gray-900 opacity-50'}
                ${isToday(day) ? 'ring-2 ring-cyan-400' : ''}
              `}
            >
              <div className="text-sm font-medium mb-2">
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {dayTasks.map(task => (
                  <div
                    key={task.id}
                    className={`text-xs p-1 rounded flex items-center gap-1 ${
                      task.status === 'done' 
                        ? 'bg-green-900/50 text-green-300'
                        : 'bg-gray-700 text-white'
                    }`}
                  >
                    {task.status === 'done' && <CheckCircle2 size={12} className="text-green-400" />}
                    <span className="truncate">{task.title}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};