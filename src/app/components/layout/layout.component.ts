import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BoardComponent } from '../board/board.component';
import { KanbanState, Priority } from '../../models';
import * as KanbanActions from '../../store/kanban.actions';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, FormsModule, BoardComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  newTaskTitle = '';
  selectedPriority: Priority = 'Medium';
  showAddForm = false;
  
  priorities: Priority[] = ['High', 'Medium', 'Low'];

  constructor(private store: Store<{ kanban: KanbanState }>) {}

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.newTaskTitle = '';
      this.selectedPriority = 'Medium';
    }
  }

  addTask(): void {
    if (this.newTaskTitle.trim()) {
      this.store.dispatch(KanbanActions.addTask({ 
        title: this.newTaskTitle.trim(),
        priority: this.selectedPriority
      }));
      this.newTaskTitle = '';
      this.selectedPriority = 'Medium';
      this.showAddForm = false;
    }
  }

  cancelAdd(): void {
    this.newTaskTitle = '';
    this.selectedPriority = 'Medium';
    this.showAddForm = false;
  }
} 