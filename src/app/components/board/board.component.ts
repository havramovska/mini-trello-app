import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TaskCardComponent } from '../task-card/task-card.component';
import { Task, KanbanState } from '../../models';
import * as KanbanActions from '../../store/kanban.actions';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, TaskCardComponent],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  tasks$: Observable<Task[]>;
  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];

  constructor(private store: Store<{ kanban: KanbanState }>) {
    this.tasks$ = this.store.select(state => state.kanban.tasks);
  }

  ngOnInit(): void {
    this.addInitialTasks();
    this.tasks$.subscribe(tasks => {
      this.todoTasks = this.getTasksByStatus(tasks, 'todo');
      this.inProgressTasks = this.getTasksByStatus(tasks, 'in-progress');
      this.doneTasks = this.getTasksByStatus(tasks, 'done');
    });
  }

  private addInitialTasks(): void {
    this.store.dispatch(KanbanActions.addTask({ title: 'Create Kanban board' }));
    this.store.dispatch(KanbanActions.addTask({ title: 'Implement NgRx store' }));
    this.store.dispatch(KanbanActions.addTask({ title: 'Setup Angular project' }));
  }

  onDeleteTask(taskId: string): void {
    this.store.dispatch(KanbanActions.deleteTask({ taskId }));
  }

  getTasksByStatus(tasks: Task[], status: 'todo' | 'in-progress' | 'done'): Task[] {
    return tasks.filter(task => task.status === status);
  }

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