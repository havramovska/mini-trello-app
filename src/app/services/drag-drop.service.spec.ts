import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { DragDropService } from './drag-drop.service';
import { Task } from '../models';
import * as KanbanActions from '../store/kanban.actions';

describe('DragDropService', () => {
  let service: DragDropService;
  let store: MockStore;

  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Test Task 1',
      status: 'todo',
      loadingPriority: false
    },
    {
      id: '2',
      title: 'Test Task 2',
      status: 'in-progress',
      loadingPriority: false
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DragDropService,
        provideMockStore({
          initialState: {
            kanban: {
              tasks: mockTasks
            }
          }
        })
      ]
    });

    service = TestBed.inject(DragDropService);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('onDrop', () => {
    it('should handle same container drop (reordering)', () => {
      const todoTasks = mockTasks.map(task => ({ ...task }));
    
      const containerRef = { data: todoTasks, id: 'todo-container' };
    
      const mockEvent = {
        previousContainer: containerRef,
        container: containerRef,
        previousIndex: 0,
        currentIndex: 1
      } as CdkDragDrop<Task[]>;
    
      spyOn(store, 'dispatch');
      
      service.onDrop(mockEvent);
    
      expect(store.dispatch).not.toHaveBeenCalled();
    });    

    it('should handle different container drop (status change)', () => {
      const todoTasks = [mockTasks[0]];
      const inProgressTasks = [mockTasks[1]];

      const mockEvent = {
        previousContainer: { data: todoTasks, id: 'todo-container' },
        container: { data: inProgressTasks, id: 'in-progress-container' },
        previousIndex: 0,
        currentIndex: 0
      } as CdkDragDrop<Task[]>;

      spyOn(store, 'dispatch');
      
      service.onDrop(mockEvent);

      expect(store.dispatch).toHaveBeenCalledWith(
        KanbanActions.updateTaskStatus({ taskId: '1', status: 'in-progress' })
      );
    });
  });

  describe('getStatusFromContainerId', () => {
    it('should return correct status for todo container', () => {
      const result = service['getStatusFromContainerId']('todo-container');
      expect(result).toBe('todo');
    });

    it('should return correct status for in-progress container', () => {
      const result = service['getStatusFromContainerId']('in-progress-container');
      expect(result).toBe('in-progress');
    });

    it('should return correct status for done container', () => {
      const result = service['getStatusFromContainerId']('done-container');
      expect(result).toBe('done');
    });

    it('should return todo as default for unknown container', () => {
      const result = service['getStatusFromContainerId']('unknown-container');
      expect(result).toBe('todo');
    });
  });
}); 