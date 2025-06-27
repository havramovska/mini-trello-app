import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, delay, switchMap } from 'rxjs/operators';
import * as KanbanActions from './kanban.actions';
import { UuidService } from '../services/uuid.service';

@Injectable()
export class KanbanEffects {

  constructor(
    private actions$: Actions,
    private uuidService: UuidService
  ) {}

  addTask$ = createEffect(() => this.actions$.pipe(
    ofType(KanbanActions.addTask),
    switchMap(({ title }) => {
      const taskId = this.uuidService.generateUUID();
      return of(KanbanActions.addTaskWithId({ title, taskId }));
    })
  ));

  fetchPriority$ = createEffect(() => this.actions$.pipe(
    ofType(KanbanActions.fetchPriority),
    mergeMap(({ taskId }) => {
      return of(null).pipe(
        delay(1000),
        map(() => {
          const priorities: ('High' | 'Medium' | 'Low')[] = ['High', 'Medium', 'Low'];
          const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
          
          if (Math.random() < 0.1) {
            throw new Error('AI service temporarily unavailable');
          }
          
          return KanbanActions.fetchPrioritySuccess({ taskId, priority: randomPriority });
        }),
        catchError(error => of(KanbanActions.fetchPriorityFailure({ 
          taskId, 
          error: error.message || 'Failed to fetch priority' 
        })))
      );
    })
  ));
} 