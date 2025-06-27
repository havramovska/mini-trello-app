import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent {
  @Input() title: string = '';
  @Input() priority?: 'High' | 'Medium' | 'Low';
  @Input() status: 'todo' | 'in-progress' | 'done' = 'todo';
} 