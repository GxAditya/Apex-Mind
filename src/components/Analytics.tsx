import React from 'react';
import { useSelector } from 'react-redux';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import CalendarHeatmap from 'react-calendar-heatmap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RootState } from '../store';
import { Task } from '../types';

export const Analytics: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.items);

  // Calculate task completion data for the heatmap
  const today = new Date();
  const startDate = subDays(today, 365);
  
  const taskCompletionData = eachDayOfInterval({ start: startDate, end: today }).map(date => {
    const completedTasks = tasks.filter(task => {
      const taskDate = new Date(task.updatedAt);
      return (
        task.status === 'done' &&
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });

    return {
      date: format(date, 'yyyy-MM-dd'),
      count: completedTasks.length,
    };
  });

  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const inProgressTasks = tasks.filter(task => task.status === 'inProgress').length;
  const todoTasks = tasks.filter(task => task.status === 'todo').length;

  // Calculate time tracked per task for the bar chart
  const taskTimeData = tasks
    .filter(task => task.timeTracked > 0)
    .map(task => ({
      name: task.title,
      timeSpent: Math.round(task.timeTracked / 60), // Convert seconds to minutes
    }))
    .sort((a, b) => b.timeSpent - a.timeSpent)
    .slice(0, 5); // Show top 5 tasks

  return (
    <div className="bg-gray-900 p-8 rounded-lg shadow-xl space-y-8">
      <h2 className="text-2xl font-semibold text-cyan-400">Analytics</h2>

      {/* Task Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-gray-400 text-sm">Total Tasks</div>
          <div className="text-2xl font-bold text-white">{totalTasks}</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-gray-400 text-sm">Completed</div>
          <div className="text-2xl font-bold text-green-400">{completedTasks}</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-gray-400 text-sm">In Progress</div>
          <div className="text-2xl font-bold text-yellow-400">{inProgressTasks}</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-gray-400 text-sm">To Do</div>
          <div className="text-2xl font-bold text-cyan-400">{todoTasks}</div>
        </div>
      </div>

      {/* Activity Heatmap */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-white mb-4">Activity Overview</h3>
        <CalendarHeatmap
          startDate={startDate}
          endDate={today}
          values={taskCompletionData}
          classForValue={(value) => {
            if (!value || value.count === 0) return 'color-empty';
            return `color-scale-${Math.min(value.count, 4)}`;
          }}
          titleForValue={(value) => {
            if (!value) return 'No tasks completed';
            return `${value.count} tasks completed on ${value.date}`;
          }}
        />
      </div>

      {/* Time Tracked Chart */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-white mb-4">Time Spent per Task (minutes)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={taskTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#9CA3AF' }}
                tickLine={{ stroke: '#4B5563' }}
              />
              <YAxis
                tick={{ fill: '#9CA3AF' }}
                tickLine={{ stroke: '#4B5563' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#F9FAFB',
                }}
              />
              <Bar dataKey="timeSpent" fill="#22D3EE" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};