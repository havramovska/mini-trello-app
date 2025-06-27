import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { Task } from '../../models';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, CdkDrag],
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Output() deleteTask = new EventEmitter<string>();

  getStatusDisplayName(status: 'todo' | 'in-progress' | 'done'): string {
    switch (status) {
      case 'todo':
        return '📋 Todo';
      case 'in-progress':
        return '⚡ In Progress';
      case 'done':
        return '✅ Done';
      default:
        return status;
    }
  }
} 