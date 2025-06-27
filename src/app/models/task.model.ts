import { Priority } from './priority.model';

export interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  priority?: Priority;
  loadingPriority: boolean;
  errorPriority?: string;
} 