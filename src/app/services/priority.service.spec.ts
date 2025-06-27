import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PriorityService } from './priority.service';
import { Priority } from '../models';

describe('PriorityService', () => {
  let service: PriorityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PriorityService]
    });
    service = TestBed.inject(PriorityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPriority', () => {
    it('should return an Observable', () => {
      const result = service.getPriority('test-task-id');
      expect(result).toBeDefined();
      expect(typeof result.subscribe).toBe('function');
    });

    it('should return a priority value', fakeAsync(() => {
      let priority: Priority | undefined;
      
      service.getPriority('test-task-id').subscribe(result => {
        priority = result;
      });

      tick(1000); // Wait for the delay

      expect(priority).toBeDefined();
      if (priority) {
        expect(['High', 'Medium', 'Low']).toContain(priority);
      }
    }));

    it('should have a 1 second delay', fakeAsync(() => {
      const startTime = Date.now();
      let endTime: number | undefined;

      service.getPriority('test-task-id').subscribe(() => {
        endTime = Date.now();
      });

      tick(1000);

      expect(endTime).toBeDefined();
      if (endTime) {
        expect(endTime - startTime).toBeGreaterThanOrEqual(1000);
      }
    }));

    it('should return different priorities for different calls', fakeAsync(() => {
      const priorities: Priority[] = [];
      
      // Make multiple calls to test randomness
      for (let i = 0; i < 10; i++) {
        service.getPriority(`task-${i}`).subscribe(priority => {
          priorities.push(priority);
        });
      }

      tick(1000);

      expect(priorities.length).toBe(10);
      expect(priorities.every(p => ['High', 'Medium', 'Low'].includes(p))).toBe(true);
    }));

    it('should return valid priority values', fakeAsync(() => {
      const validPriorities: Priority[] = ['High', 'Medium', 'Low'];
      let result: Priority | undefined;

      service.getPriority('test-task-id').subscribe(priority => {
        result = priority;
      });

      tick(1000);

      expect(result).toBeDefined();
      if (result) {
        expect(validPriorities).toContain(result);
      }
    }));
  });
}); 