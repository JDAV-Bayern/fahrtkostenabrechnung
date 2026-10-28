import { TestBed } from '@angular/core/testing';
import { PlzService } from './plz.service';

describe('PlzService', () => {
  let service: PlzService;

  beforeEach(() => {
    service = TestBed.inject(PlzService);
  });

  describe('search', () => {
    it('should return nothing for prefixes of up to 3 characters', () => {
      expect(service.search('')).toEqual([]);
      expect(service.search('8')).toEqual([]);
      expect(service.search('857')).toEqual([]);
    });

    it('should find places by prefix', () => {
      const result = service.search('85748');
      expect(result).toContainEqual({
        plz: '85748',
        city: 'Garching bei München',
      });
    });

    it('should only return postcodes starting with the prefix', () => {
      const result = service.search('8574');
      expect(result.length).toBeGreaterThan(0);
      expect(result.every((r) => r.plz.startsWith('8574'))).toBe(true);
    });

    it('should return nothing for unknown prefixes', () => {
      expect(service.search('00000')).toEqual([]);
    });
  });

  describe('exists', () => {
    it('should accept known combinations', () => {
      expect(service.exists('85748', 'Garching bei München')).toBe(true);
    });

    it('should reject a known postcode with a different city', () => {
      expect(service.exists('85748', 'Aachen')).toBe(false);
    });

    it('should reject a known city with a different postcode', () => {
      expect(service.exists('00000', 'Garching bei München')).toBe(false);
    });

    it('should reject empty values', () => {
      expect(service.exists('', '')).toBe(false);
    });
  });
});
