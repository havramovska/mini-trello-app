export interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  priority?: 'High' | 'Medium' | 'Low';
  loadingPriority: boolean;
  errorPriority?: string;
} 