import { createReducer, on } from '@ngrx/store';
import { KanbanState } from '../models';
import * as KanbanActions from './kanban.actions';

export const initialState: KanbanState = {
  tasks: []
};

function findTaskIndex(tasks: any[], taskId: string): number {
  return tasks.findIndex(task => task.id === taskId);
}

export const kanbanReducer = createReducer(
  initialState,
  
  on(KanbanActions.addTaskWithId, (state, { title, taskId }) => ({
    ...state,
    tasks: [
      ...state.tasks,
      {
        id: taskId,
        title,
        status: 'todo' as const,
        loadingPriority: true
      }
    ]
  })),
  
  on(KanbanActions.updateTask, (state, { taskId, title }) => ({
    ...state,
    tasks: state.tasks.map(task =>
      task.id === taskId ? { ...task, title } : task
    )
  })),
  
  on(KanbanActions.updateTaskStatus, (state, { taskId, status }) => ({
    ...state,
    tasks: state.tasks.map(task =>
      task.id === taskId ? { ...task, status } : task
    )
  })),
  
  on(KanbanActions.deleteTask, (state, { taskId }) => ({
    ...state,
    tasks: state.tasks.filter(task => task.id !== taskId)
  })),
  
  on(KanbanActions.fetchPriority, (state, { taskId }) => ({
    ...state,
    tasks: state.tasks.map(task =>
      task.id === taskId 
        ? { ...task, loadingPriority: true, errorPriority: undefined }
        : task
    )
  })),
  
  on(KanbanActions.fetchPrioritySuccess, (state, { taskId, priority }) => ({
    ...state,
    tasks: state.tasks.map(task =>
      task.id === taskId 
        ? { ...task, priority, loadingPriority: false, errorPriority: undefined }
        : task
    )
  })),
  
  on(KanbanActions.fetchPriorityFailure, (state, { taskId, error }) => ({
    ...state,
    tasks: state.tasks.map(task =>
      task.id === taskId 
        ? { ...task, loadingPriority: false, errorPriority: error }
        : task
    )
  }))
); 