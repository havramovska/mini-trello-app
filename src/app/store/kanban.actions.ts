import { createAction, props } from '@ngrx/store';
import { Task, Priority } from '../models';

export const addTask = createAction(
  '[Kanban] Add Task',
  props<{ title: string; priority?: Priority }>()
);

export const addTaskWithId = createAction(
  '[Kanban] Add Task With ID',
  props<{ title: string; taskId: string; priority?: Priority }>()
);

export const updateTask = createAction(
  '[Kanban] Update Task',
  props<{ taskId: string; title: string }>()
);

export const updateTaskStatus = createAction(
  '[Kanban] Update Task Status',
  props<{ taskId: string; status: 'todo' | 'in-progress' | 'done' }>()
);

export const deleteTask = createAction(
  '[Kanban] Delete Task',
  props<{ taskId: string }>()
);

export const fetchPriority = createAction(
  '[Kanban] Fetch Priority',
  props<{ taskId: string }>()
);

export const fetchPrioritySuccess = createAction(
  '[Kanban] Fetch Priority Success',
  props<{ taskId: string; priority: Priority }>()
);

export const fetchPriorityFailure = createAction(
  '[Kanban] Fetch Priority Failure',
  props<{ taskId: string; error: string }>()
); 