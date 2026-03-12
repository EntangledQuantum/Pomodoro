import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { AppState, TimerMode, Task } from './types';

const INITIAL_SETTINGS = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  mongoDbUrl: '',
  mongoDbApiKey: '',
  clusterName: 'Cluster0',
  databaseName: 'zenfocus',
};

const getDurationForMode = (mode: TimerMode, settings: typeof INITIAL_SETTINGS) => {
  switch (mode) {
    case 'work': return settings.workDuration * 60;
    case 'shortBreak': return settings.shortBreakDuration * 60;
    case 'longBreak': return settings.longBreakDuration * 60;
  }
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      projects: [],
      tasks: {},
      tasksByProject: { 'null': [] },
      timer: {
        mode: 'work',
        timeLeft: INITIAL_SETTINGS.workDuration * 60,
        isRunning: false,
        activeTaskId: null,
      },
      settings: INITIAL_SETTINGS,

      // -- Projects --
      addProject: (project) => set((state) => ({
        projects: [...state.projects, { ...project, id: uuidv4(), createdAt: Date.now() }]
      })),
      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p)
      })),
      deleteProject: (id) => set((state) => {
        let newTasks = state.tasks;
        const projectTasks = state.tasksByProject[id] || [];
        if (projectTasks.length > 0) {
          newTasks = { ...state.tasks };
          for (let i = 0; i < projectTasks.length; i++) {
            const taskId = projectTasks[i];
            if (newTasks[taskId]) {
              newTasks[taskId] = { ...newTasks[taskId], projectId: null };
            }
          }
        }

        const newTasksByProject = { ...state.tasksByProject };
        const orphanTasks = newTasksByProject['null'] || [];
        if (state.tasksByProject[id] && state.tasksByProject[id].length > 0) {
           newTasksByProject['null'] = [...orphanTasks, ...state.tasksByProject[id]];
        }
        delete newTasksByProject[id];

        return {
          projects: state.projects.filter(p => p.id !== id),
          tasks: newTasks,
          tasksByProject: newTasksByProject
        };
      }),

      // -- Tasks --
      addTask: (task) => set((state) => {
        const id = uuidv4();
        const pId = task.projectId || 'null';
        const projectTasks = state.tasksByProject[pId] || [];

        return {
          tasks: {
            ...state.tasks,
            [id]: { ...task, id, createdAt: Date.now(), subtasks: task.subtasks || [], tags: task.tags || [], completed: false }
          },
          tasksByProject: {
            ...state.tasksByProject,
            [pId]: [...projectTasks, id]
          }
        };
      }),
      updateTask: (id, updates) => set((state) => {
        if (!state.tasks[id]) return state;

        const oldTask = state.tasks[id];
        const newTasksByProject = { ...state.tasksByProject };

        // Handle project reassignment
        if (updates.projectId !== undefined && updates.projectId !== oldTask.projectId) {
          const oldPId = oldTask.projectId || 'null';
          const newPId = updates.projectId || 'null';

          if (newTasksByProject[oldPId]) {
            newTasksByProject[oldPId] = newTasksByProject[oldPId].filter(tId => tId !== id);
          }
          newTasksByProject[newPId] = [...(newTasksByProject[newPId] || []), id];
        }

        return {
          tasks: {
            ...state.tasks,
            [id]: { ...oldTask, ...updates }
          },
          tasksByProject: newTasksByProject
        };
      }),
      deleteTask: (id) => set((state) => {
        if (!state.tasks[id]) return state;

        const pId = state.tasks[id].projectId || 'null';
        const newTasksByProject = { ...state.tasksByProject };
        if (newTasksByProject[pId]) {
           newTasksByProject[pId] = newTasksByProject[pId].filter(tId => tId !== id);
        }

        const newTasks = { ...state.tasks };
        delete newTasks[id];

        return {
          tasks: newTasks,
          tasksByProject: newTasksByProject,
          timer: state.timer.activeTaskId === id ? { ...state.timer, activeTaskId: null } : state.timer
        };
      }),
      toggleTaskCompletion: (id) => set((state) => {
        if (!state.tasks[id]) return state;
        return {
          tasks: {
            ...state.tasks,
            [id]: { ...state.tasks[id], completed: !state.tasks[id].completed }
          }
        };
      }),
      
      // -- Subtasks --
      addSubtask: (taskId, title) => set((state) => {
        if (!state.tasks[taskId]) return state;
        return {
          tasks: {
            ...state.tasks,
            [taskId]: {
              ...state.tasks[taskId],
              subtasks: [...state.tasks[taskId].subtasks, { id: uuidv4(), title, completed: false }]
            }
          }
        };
      }),
      toggleSubtaskCompletion: (taskId, subtaskId) => set((state) => {
        if (!state.tasks[taskId]) return state;

        const task = state.tasks[taskId];
        const subtaskIndex = task.subtasks.findIndex(st => st.id === subtaskId);
        if (subtaskIndex === -1) return state;

        const newSubtasks = [...task.subtasks];
        newSubtasks[subtaskIndex] = { ...newSubtasks[subtaskIndex], completed: !newSubtasks[subtaskIndex].completed };

        return {
          tasks: {
            ...state.tasks,
            [taskId]: {
              ...task,
              subtasks: newSubtasks
            }
          }
        };
      }),
      deleteSubtask: (taskId, subtaskId) => set((state) => {
        if (!state.tasks[taskId]) return state;
        return {
          tasks: {
            ...state.tasks,
            [taskId]: {
              ...state.tasks[taskId],
              subtasks: state.tasks[taskId].subtasks.filter(st => st.id !== subtaskId)
            }
          }
        };
      }),

      // -- Timer --
      setTimerMode: (mode) => set((state) => ({
        timer: {
          ...state.timer,
          mode,
          timeLeft: getDurationForMode(mode, state.settings),
          isRunning: false
        }
      })),
      startTimer: () => set((state) => ({
        timer: { ...state.timer, isRunning: true }
      })),
      pauseTimer: () => set((state) => ({
        timer: { ...state.timer, isRunning: false }
      })),
      resetTimer: () => set((state) => ({
        timer: {
          ...state.timer,
          isRunning: false,
          timeLeft: getDurationForMode(state.timer.mode, state.settings)
        }
      })),
      tickTimer: () => set((state) => {
        const newTimeLeft = Math.max(0, state.timer.timeLeft - 1);
        if (newTimeLeft === 0) {
          // Timer finished
          return {
            timer: { ...state.timer, isRunning: false, timeLeft: 0 }
          };
        }
        return {
          timer: { ...state.timer, timeLeft: newTimeLeft }
        };
      }),
      setActiveTask: (taskId) => set((state) => ({
        timer: { ...state.timer, activeTaskId: taskId }
      })),

      // -- Settings --
      updateSettings: (newSettings) => set((state) => {
        const updated = { ...state.settings, ...newSettings };
        return {
          settings: updated,
          // Update current timer if it's not running
          timer: !state.timer.isRunning ? {
            ...state.timer,
            timeLeft: getDurationForMode(state.timer.mode, updated)
          } : state.timer
        };
      }),

      // -- Sync --
      replaceState: (newState) => set((state) => {
        let newTasksByProject = state.tasksByProject;
        let newTasks = newState.tasks || state.tasks;

        if (newState.tasks) {
          // Handle case where remote synced data is still an array
          if (Array.isArray(newState.tasks)) {
            newTasks = {};
            (newState.tasks as Task[]).forEach((t) => { newTasks[t.id] = t; });
          }

          // Rebuild index
          newTasksByProject = { 'null': [] };
          Object.values(newTasks as Record<string, Task>).forEach((task) => {
            const pId = task.projectId || 'null';
            if (!newTasksByProject[pId]) newTasksByProject[pId] = [];
            newTasksByProject[pId].push(task.id);
          });
        }
        return {
          projects: newState.projects || state.projects,
          tasks: newTasks as Record<string, Task>,
          tasksByProject: newTasksByProject,
          settings: newState.settings || state.settings,
        };
      }),
    }),
    {
      name: 'zen-focus-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as Partial<AppState>;
        if (version === 0) {
          // Migrate tasks from Array to Record, build tasksByProject index
          const oldTasks = state.tasks || [];
          const newTasks: Record<string, Task> = {};
          const newTasksByProject: Record<string, string[]> = { 'null': [] };

          if (Array.isArray(oldTasks)) {
            oldTasks.forEach((task: Task) => {
              newTasks[task.id] = task;
              const pId = task.projectId || 'null';
              if (!newTasksByProject[pId]) newTasksByProject[pId] = [];
              newTasksByProject[pId].push(task.id);
            });
          } else {
            // Already an object but version was 0 (e.g. somehow)
            Object.values(oldTasks as Record<string, Task>).forEach((task: Task) => {
              newTasks[task.id] = task;
              const pId = task.projectId || 'null';
              if (!newTasksByProject[pId]) newTasksByProject[pId] = [];
              newTasksByProject[pId].push(task.id);
            });
          }

          state.tasks = newTasks;
          state.tasksByProject = newTasksByProject;
        }
        return state;
      },
      partialize: (state) => ({
        projects: state.projects,
        tasks: state.tasks,
        tasksByProject: state.tasksByProject,
        settings: state.settings,
        // Optional: you can choose not to persist timer state so it resets on app open
      }),
    }
  )
);
