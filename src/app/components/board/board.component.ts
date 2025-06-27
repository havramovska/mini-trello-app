import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskCardComponent } from '../task-card/task-card.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, TaskCardComponent],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {
  todoTasks = [
    { title: 'Create Kanban board', priority: 'High' as const }
  ];
  
  inProgressTasks = [
    { title: 'Implement NgRx store', priority: 'Medium' as const }
  ];
  
  doneTasks = [
    { title: 'Setup Angular project', priority: 'Low' as const }
  ];
} 