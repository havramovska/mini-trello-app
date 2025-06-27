import { kanbanReducer, initialState } from './kanban.reducer';
import * as KanbanActions from './kanban.actions';
import { Task, Priority } from '../models';

describe('KanbanReducer', () => {
  it('should return the initial state', () => {
    const action = {} as any;
    const result = kanbanReducer(initialState, action);
    expect(result).toEqual(initialState);
  });

  describe('addTaskWithId', () => {
    it('should add a new task to the state', () => {
      const taskId = 'test-uuid';
      const title = 'Test Task';
      const action = KanbanActions.addTaskWithId({ title, taskId });

      const result = kanbanReducer(initialState, action);

      expect(result.tasks.length).toBe(1);
      expect(result.tasks[0]).toEqual({
        id: taskId,
        title,
        status: 'todo',
        priority: undefined,
        loadingPriority: true,
        errorPriority: undefined
      });
    });

    it('should add a task with priority when provided', () => {
      const taskId = 'test-uuid';
      const title = 'Test Task';
      const priority: Priority = 'High';
      const action = KanbanActions.addTaskWithId({ title, taskId, priority });

      const result = kanbanReducer(initialState, action);

      expect(result.tasks.length).toBe(1);
      expect(result.tasks[0]).toEqual({
        id: taskId,
        title,
        status: 'todo',
        priority,
        loadingPriority: false,
        errorPriority: undefined
      });
    });

    it('should add multiple tasks to the state', () => {
      const state = {
        tasks: [{
          id: '1',
          title: 'Existing Task',
          status: 'todo' as const,
          loadingPriority: false
        }]
      };

      const taskId = 'test-uuid';
      const title = 'New Task';
      const action = KanbanActions.addTaskWithId({ title, taskId });

      const result = kanbanReducer(state, action);

      expect(result.tasks.length).toBe(2);
      expect(result.tasks[1].title).toBe('New Task');
    });
  });

  describe('updateTask', () => {
    it('should update task title', () => {
      const existingTask: Task = {
        id: '1',
        title: 'Old Title',
        status: 'todo',
        loadingPriority: false
      };

      const state = { tasks: [existingTask] };
      const action = KanbanActions.updateTask({ taskId: '1', title: 'New Title' });

      const result = kanbanReducer(state, action);

      expect(result.tasks[0].title).toBe('New Title');
      expect(result.tasks[0].status).toBe('todo'); // Other properties unchanged
    });

    it('should not update other tasks', () => {
      const task1: Task = {
        id: '1',
        title: 'Task 1',
        status: 'todo',
        loadingPriority: false
      };
      const task2: Task = {
        id: '2',
        title: 'Task 2',
        status: 'in-progress',
        loadingPriority: false
      };

      const state = { tasks: [task1, task2] };
      const action = KanbanActions.updateTask({ taskId: '1', title: 'Updated Task 1' });

      const result = kanbanReducer(state, action);

      expect(result.tasks[0].title).toBe('Updated Task 1');
      expect(result.tasks[1].title).toBe('Task 2'); // Unchanged
    });
  });

  describe('updateTaskStatus', () => {
    it('should update task status', () => {
      const existingTask: Task = {
        id: '1',
        title: 'Test Task',
        status: 'todo',
        loadingPriority: false
      };

      const state = { tasks: [existingTask] };
      const action = KanbanActions.updateTaskStatus({ taskId: '1', status: 'in-progress' });

      const result = kanbanReducer(state, action);

      expect(result.tasks[0].status).toBe('in-progress');
      expect(result.tasks[0].title).toBe('Test Task'); // Other properties unchanged
    });
  });

  describe('deleteTask', () => {
    it('should remove task from state', () => {
      const task1: Task = {
        id: '1',
        title: 'Task 1',
        status: 'todo',
        loadingPriority: false
      };
      const task2: Task = {
        id: '2',
        title: 'Task 2',
        status: 'in-progress',
        loadingPriority: false
      };

      const state = { tasks: [task1, task2] };
      const action = KanbanActions.deleteTask({ taskId: '1' });

      const result = kanbanReducer(state, action);

      expect(result.tasks.length).toBe(1);
      expect(result.tasks[0].id).toBe('2');
    });

    it('should handle deleting non-existent task', () => {
      const existingTask: Task = {
        id: '1',
        title: 'Test Task',
        status: 'todo',
        loadingPriority: false
      };

      const state = { tasks: [existingTask] };
      const action = KanbanActions.deleteTask({ taskId: 'non-existent' });

      const result = kanbanReducer(state, action);

      expect(result.tasks.length).toBe(1); // No change
    });
  });

  describe('fetchPriority', () => {
    it('should set loadingPriority to true and clear errorPriority', () => {
      const existingTask: Task = {
        id: '1',
        title: 'Test Task',
        status: 'todo',
        loadingPriority: false,
        errorPriority: 'Previous error'
      };

      const state = { tasks: [existingTask] };
      const action = KanbanActions.fetchPriority({ taskId: '1' });

      const result = kanbanReducer(state, action);

      expect(result.tasks[0].loadingPriority).toBe(true);
      expect(result.tasks[0].errorPriority).toBeUndefined();
    });
  });

  describe('fetchPrioritySuccess', () => {
    it('should update task with priority and set loading to false', () => {
      const existingTask: Task = {
        id: '1',
        title: 'Test Task',
        status: 'todo',
        loadingPriority: true
      };

      const state = { tasks: [existingTask] };
      const priority: Priority = 'High';
      const action = KanbanActions.fetchPrioritySuccess({ taskId: '1', priority });

      const result = kanbanReducer(state, action);

      expect(result.tasks[0].priority).toBe(priority);
      expect(result.tasks[0].loadingPriority).toBe(false);
      expect(result.tasks[0].errorPriority).toBeUndefined();
    });
  });

  describe('fetchPriorityFailure', () => {
    it('should set error message and set loading to false', () => {
      const existingTask: Task = {
        id: '1',
        title: 'Test Task',
        status: 'todo',
        loadingPriority: true
      };

      const state = { tasks: [existingTask] };
      const errorMessage = 'Failed to fetch priority';
      const action = KanbanActions.fetchPriorityFailure({ taskId: '1', error: errorMessage });

      const result = kanbanReducer(state, action);

      expect(result.tasks[0].errorPriority).toBe(errorMessage);
      expect(result.tasks[0].loadingPriority).toBe(false);
    });
  });
}); 