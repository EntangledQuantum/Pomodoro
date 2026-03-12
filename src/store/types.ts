export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  projectId: string | null;
  title: string;
  description: string;
  completed: boolean;
  subtasks: SubTask[];
  tags: string[];
  createdAt: number;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  createdAt: number;
}

export type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export interface TimerState {
  mode: TimerMode;
  timeLeft: number;
  isRunning: boolean;
  activeTaskId: string | null;
}

export interface Settings {
  workDuration: number; // in minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  mongoDbUrl: string;
  mongoDbApiKey: string;
  clusterName: string;
  databaseName: string;
}

export interface AppState {
  projects: Record<string, Project>;
  tasks: Task[];
  timer: TimerState;
  settings: Settings;
  
  // Actions
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  addSubtask: (taskId: string, subtaskTitle: string) => void;
  toggleSubtaskCompletion: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;

  setTimerMode: (mode: TimerMode) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tickTimer: () => void;
  setActiveTask: (taskId: string | null) => void;

  updateSettings: (settings: Partial<Settings>) => void;
  
  // Replace all state (for sync)
  replaceState: (newState: Partial<AppState>) => void;
}
