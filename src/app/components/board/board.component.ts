import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TaskCardComponent } from '../task-card/task-card.component';
import { Task, KanbanState } from '../../models';
import { DragDropService } from '../../services';
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

  constructor(
    private store: Store<{ kanban: KanbanState }>,
    private dragDropService: DragDropService
  ) {
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
    this.dragDropService.onDrop(event);
  }
} 