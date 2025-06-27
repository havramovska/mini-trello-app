import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Priority } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PriorityService {
  
  getPriority(taskId: string): Observable<Priority> {
    const priorities: Priority[] = ['High', 'Medium', 'Low'];
    const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
    
    // Simulate API call with 1 second delay
    return of(randomPriority).pipe(
      delay(1000)
    );
  }
} 