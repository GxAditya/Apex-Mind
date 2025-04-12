import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { format } from 'date-fns';
import { Plus, Check, Clock, Tag, Timer } from 'lucide-react';
import { RootState } from '../store';
import { addTask, updateTaskStatus, resetDailyTracking } from '../store/slices/tasksSlice';
import { Task } from '../types';

export const TaskList: React.FC = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.items);
  const timer = useSelector((state: RootState) => state.timer);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [lastResetDate, setLastResetDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  // Check for day change and reset daily tracking
  useEffect(() => {
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    if (currentDate !== lastResetDate) {
      dispatch(resetDailyTracking());
      setLastResetDate(currentDate);
    }
  }, [dispatch, lastResetDate]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle,
      status: 'todo',
      priority: 'medium',
      labels: [],
      subtasks: [],
      timeTracked: 0,
      dailyTimeTracked: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch(addTask(newTask));
    setNewTaskTitle('');
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId as Task['status'];
    
    dispatch(updateTaskStatus({ id: taskId, status: newStatus }));
  };

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  const getTaskTimeTracked = (taskId: string): number => {
    const task = tasks.find(t => t.id === taskId);
    if (!task?.dailyTimeTracked) return 0;
    
    const today = format(new Date(), 'yyyy-MM-dd');
    let totalTime = task.dailyTimeTracked[today] || 0;

    if (timer.isRunning && timer.taskId === taskId && timer.startTime) {
      const now = new Date().getTime();
      const start = new Date(timer.startTime).getTime();
      const currentSessionTime = Math.floor((now - start) / 1000);
      totalTime += currentSessionTime;
    }

    return totalTime;
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-semibold text-cyan-400 mb-6">Tasks</h2>
      
      <form onSubmit={handleAddTask} className="mb-6 flex gap-2">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
        <button
          type="submit"
          className="bg-cyan-400 text-gray-900 px-4 py-2 rounded-lg hover:bg-cyan-300 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add Task
        </button>
      </form>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-3 gap-4">
          {(['todo', 'inProgress', 'done'] as const).map((status) => (
            <div key={status} className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                {status === 'todo' && <Clock size={20} className="text-cyan-400" />}
                {status === 'inProgress' && <Tag size={20} className="text-yellow-400" />}
                {status === 'done' && <Check size={20} className="text-green-400" />}
                {status === 'todo' ? 'To Do' : status === 'inProgress' ? 'In Progress' : 'Done'}
                <span className="ml-2 text-sm text-gray-400">
                  {getTasksByStatus(status).length}
                </span>
              </h3>

              <Droppable droppableId={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-2"
                  >
                    {getTasksByStatus(status).map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-gray-700 p-3 rounded-lg"
                          >
                            <h4 className="text-white">{task.title}</h4>
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                              <Timer size={14} />
                              {formatTime(getTaskTimeTracked(task.id))}
                            </div>
                            {task.labels.length > 0 && (
                              <div className="flex gap-1 mt-2">
                                {task.labels.map((label) => (
                                  <span
                                    key={label}
                                    className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded"
                                  >
                                    {label}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};