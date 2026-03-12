import { useState } from 'react';
import { useAppStore } from '../store';
import { Plus, Trash2, CheckCircle, Circle, Folder } from 'lucide-react';

export function Tasks() {
  const { tasks, projects, addTask, deleteTask, toggleTaskCompletion } = useAppStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const tasksList = Object.values(tasks);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask({
        title: newTaskTitle.trim(),
        description: '',
        projectId: selectedProjectId,
        completed: false,
        subtasks: [],
        tags: [],
      });
      setNewTaskTitle('');
      setIsAdding(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white/5 p-6 rounded-xl backdrop-blur-md border border-white/10 mt-8 animate-in slide-in-from-bottom-8 duration-500">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Tasks</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
          title="Add Task"
        >
          {isAdding ? <Plus size={18} className="text-white rotate-45 transform" /> : <Plus size={18} className="text-white" />}
        </button>
      </div>

      {isAdding && (
        <div className="flex flex-col gap-3 mb-4 bg-black/20 p-4 rounded-lg border border-white/5">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full bg-transparent border-none focus:outline-none text-white text-lg placeholder:text-white/40 mb-2"
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            autoFocus
          />
          <div className="flex justify-between items-center">
             <div className="flex items-center gap-2 text-sm text-white/60">
                <Folder size={14} />
                <select
                  value={selectedProjectId || ''}
                  onChange={(e) => setSelectedProjectId(e.target.value || null)}
                  className="bg-transparent border-none focus:outline-none text-white/80 cursor-pointer appearance-none outline-none"
                >
                  <option value="" className="text-black">No Project</option>
                  {Object.values(projects).map(p => (
                    <option key={p.id} value={p.id} className="text-black">{p.name}</option>
                  ))}
                </select>
             </div>
             <button
               onClick={handleAddTask}
               className="px-4 py-1.5 bg-indigo-500 rounded-md hover:bg-indigo-600 transition-colors text-white font-medium text-sm"
             >
               Add Task
             </button>
          </div>
        </div>
      )}

      {tasksList.length === 0 && !isAdding ? (
        <p className="text-white/50 text-sm text-center py-4">You have no tasks. Add one to get started!</p>
      ) : (
        <ul className="space-y-3">
          {tasksList.map((task) => {
            const project = task.projectId ? projects[task.projectId] : undefined;
            return (
              <li
                key={task.id}
                className={`flex flex-col p-4 bg-white/5 rounded-lg border border-white/5 group hover:bg-white/10 transition-all ${
                  task.completed ? 'opacity-50' : 'opacity-100'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <button
                    onClick={() => toggleTaskCompletion(task.id)}
                    className="mt-0.5 text-white/70 hover:text-green-400 transition-colors flex-shrink-0"
                  >
                    {task.completed ? <CheckCircle size={20} className="text-green-400" /> : <Circle size={20} />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className={`text-white/90 font-medium break-words ${task.completed ? 'line-through text-white/50' : ''}`}>
                      {task.title}
                    </p>
                    {project && (
                      <div className="flex items-center gap-1.5 mt-2">
                         <div className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color }} />
                         <span className="text-xs font-medium text-white/60 uppercase tracking-wider">{project.name}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 text-red-400/70 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete Task"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
