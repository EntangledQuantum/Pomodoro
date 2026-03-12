import { useState } from 'react';
import { useAppStore } from '../store';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';

export function Projects() {
  const { projects, addProject, deleteProject, updateProject } = useAppStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectColor, setNewProjectColor] = useState('#3b82f6'); // Default blue
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      addProject({
        name: newProjectName.trim(),
        color: newProjectColor,
      });
      setNewProjectName('');
      setIsAdding(false);
    }
  };

  const handleUpdateProject = (id: string) => {
    if (editName.trim()) {
      updateProject(id, { name: editName.trim() });
      setEditingId(null);
    }
  };

  return (
    <div className="w-full max-w-md bg-white/5 p-6 rounded-xl backdrop-blur-md border border-white/10 mt-8 animate-in slide-in-from-bottom-8 duration-500">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Projects</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
          title="Add Project"
        >
          {isAdding ? <X size={18} className="text-white" /> : <Plus size={18} className="text-white" />}
        </button>
      </div>

      {isAdding && (
        <div className="flex gap-2 mb-4 bg-black/20 p-3 rounded-lg border border-white/5">
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="Project name..."
            className="flex-1 bg-transparent border-none focus:outline-none text-white placeholder:text-white/40"
            onKeyDown={(e) => e.key === 'Enter' && handleAddProject()}
            autoFocus
          />
          <input
            type="color"
            value={newProjectColor}
            onChange={(e) => setNewProjectColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer bg-transparent border-none p-0"
            title="Choose project color"
          />
          <button
            onClick={handleAddProject}
            className="p-2 bg-indigo-500 rounded-md hover:bg-indigo-600 transition-colors"
          >
            <Check size={16} className="text-white" />
          </button>
        </div>
      )}

      {Object.keys(projects).length === 0 && !isAdding ? (
        <p className="text-white/50 text-sm text-center py-4">No projects yet. Create one!</p>
      ) : (
        <ul className="space-y-2">
          {Object.values(projects).map((project) => (
            <li
              key={project.id}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 group hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                {editingId === project.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 bg-black/30 border-none focus:outline-none text-white px-2 py-1 rounded"
                    onKeyDown={(e) => e.key === 'Enter' && handleUpdateProject(project.id)}
                    onBlur={() => handleUpdateProject(project.id)}
                    autoFocus
                  />
                ) : (
                  <span className="text-white/90 font-medium">{project.name}</span>
                )}
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {editingId !== project.id && (
                  <button
                    onClick={() => {
                      setEditingId(project.id);
                      setEditName(project.name);
                    }}
                    className="p-1.5 text-white/50 hover:text-white transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                )}
                <button
                  onClick={() => deleteProject(project.id)}
                  className="p-1.5 text-red-400/70 hover:text-red-400 transition-colors"
                  title="Delete Project"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
