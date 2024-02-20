import { Injectable } from '@angular/core';
import { jdavRegions, jdavStates, sections } from 'src/data/sections';
import { Section, SectionData } from 'src/domain/section';

@Injectable({
  providedIn: 'root'
})
export class SectionService {
  constructor() {}

  private mapOrganisations(data: SectionData): Section {
    return {
      id: data.id,
      name: data.name,
      jdavState: jdavStates.find(state => state.id === data.jdavStateId)!,
      jdavRegion:
        jdavRegions.find(region => region.id === data.jdavRegionId) || null
    };
  }

  getSections(): Section[] {
    return sections.map(this.mapOrganisations);
  }

  getSection(id: number): Section | undefined {
    const data = sections.find(state => state.id === id);
    if (!data) {
      return undefined;
    }
    return this.mapOrganisations(data);
  }

  exists(section: Section): boolean {
    return sections.some(s => s.id === section.id);
  }

  isBavarian(section: Section): boolean {
    return section.jdavState.id === 2;
  }
}
