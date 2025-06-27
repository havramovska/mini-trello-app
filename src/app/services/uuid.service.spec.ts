import { TestBed } from '@angular/core/testing';
import { UuidService } from './uuid.service';

describe('UuidService', () => {
  let service: UuidService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UuidService]
    });
    service = TestBed.inject(UuidService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('generateUUID', () => {
    it('should generate a UUID string', () => {
      const uuid = service.generateUUID();
      expect(typeof uuid).toBe('string');
      expect(uuid.length).toBeGreaterThan(0);
    });

    it('should generate unique UUIDs', () => {
      const uuid1 = service.generateUUID();
      const uuid2 = service.generateUUID();
      const uuid3 = service.generateUUID();

      expect(uuid1).not.toBe(uuid2);
      expect(uuid2).not.toBe(uuid3);
      expect(uuid1).not.toBe(uuid3);
    });

    it('should generate UUIDs in correct format', () => {
      const uuid = service.generateUUID();
      // UUID format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuidRegex.test(uuid)).toBe(true);
    });

    it('should generate multiple UUIDs without conflicts', () => {
      const uuids = new Set<string>();
      const count = 1000;

      for (let i = 0; i < count; i++) {
        const uuid = service.generateUUID();
        expect(uuids.has(uuid)).toBe(false);
        uuids.add(uuid);
      }

      expect(uuids.size).toBe(count);
    });
  });
}); 