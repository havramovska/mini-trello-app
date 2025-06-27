import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { BoardComponent } from '../board/board.component';
import { AddTaskComponent } from '../add-task/add-task.component';
import { KanbanState, Priority } from '../../models';
import * as KanbanActions from '../../store/kanban.actions';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, BoardComponent, AddTaskComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  constructor(private store: Store<{ kanban: KanbanState }>) {}

  onTaskAdded(taskData: { title: string; priority: Priority }): void {
    this.store.dispatch(KanbanActions.addTask({ 
      title: taskData.title,
      priority: taskData.priority
    }));
  }
} 