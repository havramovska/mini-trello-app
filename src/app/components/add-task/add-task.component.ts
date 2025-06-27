import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Priority } from '../../models';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent {
  newTaskTitle = '';
  selectedPriority: Priority = 'Medium';
  showAddForm = false;
  
  priorities: Priority[] = ['High', 'Medium', 'Low'];

  @Output() taskAdded = new EventEmitter<{ title: string; priority: Priority }>();

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.resetForm();
    }
  }

  addTask(): void {
    if (this.newTaskTitle.trim()) {
      this.taskAdded.emit({
        title: this.newTaskTitle.trim(),
        priority: this.selectedPriority
      });
      this.resetForm();
      this.showAddForm = false;
    }
  }

  cancelAdd(): void {
    this.resetForm();
    this.showAddForm = false;
  }

  private resetForm(): void {
    this.newTaskTitle = '';
    this.selectedPriority = 'Medium';
  }
} 