import { TestBed } from '@angular/core/testing';
import { jdavStates, sections } from 'src/data/sections';
import { SectionService } from './section.service';

// Achensee is a Bavarian section in the region München,
// Aulendorf belongs to Baden-Württemberg and has no region.
const BAVARIAN_SECTION_ID = 1002;
const OTHER_SECTION_ID = 1020;

describe('SectionService', () => {
  let service: SectionService;

  beforeEach(() => {
    service = TestBed.inject(SectionService);
  });

  describe('getSection', () => {
    it('should resolve state and region', () => {
      expect(service.getSection(BAVARIAN_SECTION_ID)).toEqual({
        id: BAVARIAN_SECTION_ID,
        name: 'Achensee',
        jdavState: { id: 2, name: 'Bayern' },
        jdavRegion: { id: 1, name: 'München' },
      });
    });

    it('should return a null region for sections without region', () => {
      expect(service.getSection(OTHER_SECTION_ID)?.jdavRegion).toBeNull();
    });

    it('should return undefined for unknown ids', () => {
      expect(service.getSection(-1)).toBeUndefined();
    });
  });

  describe('getSections', () => {
    it('should return all sections', () => {
      expect(service.getSections()).toHaveLength(sections.length);
    });
  });

  describe('getJdavState', () => {
    it('should list the sections of the state', () => {
      const state = service.getJdavState(2);
      expect(state?.name).toBe('Bayern');
      expect(state?.sections).toContainEqual({
        id: BAVARIAN_SECTION_ID,
        name: 'Achensee',
      });
      expect(state?.sections).not.toContainEqual(
        expect.objectContaining({ id: OTHER_SECTION_ID }),
      );
    });

    it('should return undefined for unknown ids', () => {
      expect(service.getJdavState(-1)).toBeUndefined();
    });
  });

  describe('getJdavStates', () => {
    it('should return all states', () => {
      expect(service.getJdavStates()).toHaveLength(jdavStates.length);
    });
  });

  describe('isBavarian', () => {
    it('should be true for Bavarian sections', () => {
      const section = service.getSection(BAVARIAN_SECTION_ID)!;
      expect(service.isBavarian(section)).toBe(true);
    });

    it('should be false for other sections', () => {
      const section = service.getSection(OTHER_SECTION_ID)!;
      expect(service.isBavarian(section)).toBe(false);
    });
  });
});
