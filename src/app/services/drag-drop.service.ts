import { Injectable, inject } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Store } from '@ngrx/store';
import { Task, KanbanState } from '../models';
import * as KanbanActions from '../store/kanban.actions';

@Injectable({
  providedIn: 'root'
})
export class DragDropService {
  private store = inject(Store<{ kanban: KanbanState }>);

  onDrop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      
      const task = event.container.data[event.currentIndex];
      const newStatus = this.getStatusFromContainerId(event.container.id);
      this.store.dispatch(KanbanActions.updateTaskStatus({ taskId: task.id, status: newStatus }));
    }
  }

  private getStatusFromContainerId(containerId: string): 'todo' | 'in-progress' | 'done' {
    switch (containerId) {
      case 'todo-container':
        return 'todo';
      case 'in-progress-container':
        return 'in-progress';
      case 'done-container':
        return 'done';
      default:
        return 'todo';
    }
  }
} 