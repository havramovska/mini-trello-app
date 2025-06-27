import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, switchMap } from 'rxjs/operators';
import * as KanbanActions from './kanban.actions';
import { UuidService, PriorityService } from '../services';

@Injectable()
export class KanbanEffects {
  private actions$ = inject(Actions);
  private uuidService = inject(UuidService);
  private priorityService = inject(PriorityService);

  addTask$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(KanbanActions.addTask),
      switchMap(({ title, priority }) => {
        const taskId = this.uuidService.generateUUID();
        return of(KanbanActions.addTaskWithId({ title, taskId, priority }));
      })
    );
  });

  addTaskWithId$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(KanbanActions.addTaskWithId),
      mergeMap(({ taskId, priority }) => {
        if (priority) {
          return of(KanbanActions.fetchPrioritySuccess({ taskId, priority }));
        }
        return [KanbanActions.fetchPriority({ taskId })];
      })
    );
  });

  fetchPriority$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(KanbanActions.fetchPriority),
      mergeMap(({ taskId }) => 
        this.priorityService.getPriority(taskId).pipe(
          map(priority => KanbanActions.fetchPrioritySuccess({ taskId, priority })),
          catchError(error => of(KanbanActions.fetchPriorityFailure({ 
            taskId, 
            error: error.message || 'Failed to fetch priority' 
          })))
        )
      )
    );
  });
} 