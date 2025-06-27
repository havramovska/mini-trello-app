import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ActionsSubject } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import { KanbanEffects } from './kanban.effects';
import { UuidService, PriorityService } from '../services';
import * as KanbanActions from './kanban.actions';
import { Priority } from '../models';

describe('KanbanEffects', () => {
  let effects: KanbanEffects;
  let actions$: ActionsSubject;
  let store: MockStore;
  let uuidService: jasmine.SpyObj<UuidService>;
  let priorityService: jasmine.SpyObj<PriorityService>;

  beforeEach(() => {
    const uuidSpy = jasmine.createSpyObj('UuidService', ['generateUUID']);
    const prioritySpy = jasmine.createSpyObj('PriorityService', ['getPriority']);

    TestBed.configureTestingModule({
      providers: [
        KanbanEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          initialState: {
            kanban: {
              tasks: []
            }
          }
        }),
        { provide: UuidService, useValue: uuidSpy },
        { provide: PriorityService, useValue: prioritySpy }
      ]
    });

    effects = TestBed.inject(KanbanEffects);
    actions$ = TestBed.inject(ActionsSubject);
    store = TestBed.inject(MockStore);
    uuidService = TestBed.inject(UuidService) as jasmine.SpyObj<UuidService>;
    priorityService = TestBed.inject(PriorityService) as jasmine.SpyObj<PriorityService>;
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('addTask$', () => {
    it('should dispatch addTaskWithId when addTask is dispatched', (done) => {
      const taskId = 'test-uuid';
      const title = 'Test Task';
      uuidService.generateUUID.and.returnValue(taskId);

      effects.addTask$.subscribe(action => {
        expect(action).toEqual(KanbanActions.addTaskWithId({ title, taskId, priority: undefined }));
        done();
      });

      actions$.next(KanbanActions.addTask({ title }));
    });

    it('should dispatch addTaskWithId with priority when provided', (done) => {
      const taskId = 'test-uuid';
      const title = 'Test Task';
      const priority: Priority = 'High';
      uuidService.generateUUID.and.returnValue(taskId);

      effects.addTask$.subscribe(action => {
        expect(action).toEqual(KanbanActions.addTaskWithId({ title, taskId, priority }));
        done();
      });

      actions$.next(KanbanActions.addTask({ title, priority }));
    });
  });

  describe('addTaskWithId$', () => {
    it('should dispatch fetchPriority when no priority is provided', (done) => {
      const taskId = 'test-uuid';
      const title = 'Test Task';

      effects.addTaskWithId$.subscribe(action => {
        expect(action).toEqual(KanbanActions.fetchPriority({ taskId }));
        done();
      });

      actions$.next(KanbanActions.addTaskWithId({ title, taskId }));
    });

    it('should dispatch fetchPrioritySuccess when priority is provided', (done) => {
      const taskId = 'test-uuid';
      const title = 'Test Task';
      const priority: Priority = 'High';

      effects.addTaskWithId$.subscribe(action => {
        expect(action).toEqual(KanbanActions.fetchPrioritySuccess({ taskId, priority }));
        done();
      });

      actions$.next(KanbanActions.addTaskWithId({ title, taskId, priority }));
    });
  });

  describe('fetchPriority$', () => {
    it('should dispatch fetchPrioritySuccess on successful API call', (done) => {
      const taskId = 'test-uuid';
      const priority: Priority = 'Medium';
      priorityService.getPriority.and.returnValue(of(priority));

      effects.fetchPriority$.subscribe(action => {
        expect(action).toEqual(KanbanActions.fetchPrioritySuccess({ taskId, priority }));
        done();
      });

      actions$.next(KanbanActions.fetchPriority({ taskId }));
    });

    it('should dispatch fetchPriorityFailure on API error', (done) => {
      const taskId = 'test-uuid';
      const errorMessage = 'API Error';
      priorityService.getPriority.and.returnValue(throwError(() => new Error(errorMessage)));

      effects.fetchPriority$.subscribe(action => {
        expect(action).toEqual(KanbanActions.fetchPriorityFailure({ 
          taskId, 
          error: errorMessage 
        }));
        done();
      });

      actions$.next(KanbanActions.fetchPriority({ taskId }));
    });

    it('should dispatch fetchPriorityFailure with default error message when no error message', (done) => {
      const taskId = 'test-uuid';
      priorityService.getPriority.and.returnValue(throwError(() => new Error()));

      effects.fetchPriority$.subscribe(action => {
        expect(action).toEqual(KanbanActions.fetchPriorityFailure({ 
          taskId, 
          error: 'Failed to fetch priority' 
        }));
        done();
      });

      actions$.next(KanbanActions.fetchPriority({ taskId }));
    });
  });
}); 