import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Settings, Moon, Clock, ListTodo, Calendar as CalendarIcon, BookOpen, BarChart3 } from 'lucide-react';
import { store, persistor } from './store';
import { Timer } from './components/Timer';
import { TaskList } from './components/TaskList';
import { Calendar } from './components/Calendar';
import { Notes } from './components/Notes';
import { Analytics } from './components/Analytics';

type Section = 'tasks' | 'timer' | 'calendar' | 'notes' | 'analytics';

function App() {
  const [activeSection, setActiveSection] = useState<Section>('tasks');

  const renderSection = () => {
    switch (activeSection) {
      case 'tasks':
        return <TaskList />;
      case 'timer':
        return <Timer />;
      case 'calendar':
        return <Calendar />;
      case 'notes':
        return <Notes />;
      case 'analytics':
        return <Analytics />;
      default:
        return null;
    }
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="min-h-screen bg-gray-950 text-white">
          <header className="bg-gray-900 p-4">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold text-cyan-400">Apex Mind</h1>
              <div className="flex gap-4">
                <button className="text-gray-400 hover:text-white transition-colors">
                  <Settings size={24} />
                </button>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <Moon size={24} />
                </button>
              </div>
            </div>
          </header>

          <div className="container mx-auto py-8 px-4 flex gap-8">
            {/* Sidebar Navigation */}
            <nav className="w-64 bg-gray-900 p-4 rounded-lg h-[calc(100vh-8rem)] sticky top-8">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveSection('tasks')}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                      activeSection === 'tasks' ? 'bg-cyan-400 text-gray-900' : 'text-gray-400 hover:bg-gray-800'
                    }`}
                  >
                    <ListTodo size={20} />
                    Tasks
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection('timer')}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                      activeSection === 'timer' ? 'bg-cyan-400 text-gray-900' : 'text-gray-400 hover:bg-gray-800'
                    }`}
                  >
                    <Clock size={20} />
                    Timer
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection('calendar')}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                      activeSection === 'calendar' ? 'bg-cyan-400 text-gray-900' : 'text-gray-400 hover:bg-gray-800'
                    }`}
                  >
                    <CalendarIcon size={20} />
                    Calendar
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection('notes')}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                      activeSection === 'notes' ? 'bg-cyan-400 text-gray-900' : 'text-gray-400 hover:bg-gray-800'
                    }`}
                  >
                    <BookOpen size={20} />
                    Notes
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection('analytics')}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                      activeSection === 'analytics' ? 'bg-cyan-400 text-gray-900' : 'text-gray-400 hover:bg-gray-800'
                    }`}
                  >
                    <BarChart3 size={20} />
                    Analytics
                  </button>
                </li>
              </ul>
            </nav>

            {/* Main Content */}
            <main className="flex-1">
              {renderSection()}
            </main>
          </div>
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;