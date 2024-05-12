import { Injectable } from '@angular/core';
import { jdavRegions, jdavStates, sections } from 'src/data/sections';
import {
  JdavOrganisation,
  JdavState,
  Section,
  SectionData
} from 'src/domain/section.model';

function matchId(id: number) {
  return (o: { id: number }) => o.id === id;
}

function mapStateData(data: JdavOrganisation): JdavState {
  const children = sections
    .filter(section => section.jdavStateId === data.id)
    .map(child => ({ id: child.id, name: child.name }));
  return {
    id: data.id,
    name: data.name,
    sections: children
  };
}

function mapSectionData(data: SectionData): Section {
  const regionId = data.jdavRegionId;
  return {
    id: data.id,
    name: data.name,
    jdavState: jdavStates.find(matchId(data.jdavStateId))!,
    jdavRegion: regionId ? jdavRegions.find(matchId(regionId))! : null
  };
}

@Injectable({
  providedIn: 'root'
})
export class SectionService {
  getJdavStates(): JdavState[] {
    return jdavStates.map(mapStateData);
  }

  getJdavState(id: number): JdavState | undefined {
    const data = jdavStates.find(matchId(id));
    if (!data) {
      return undefined;
    }
    return mapStateData(data);
  }

  getSections(): Section[] {
    return sections.map(mapSectionData);
  }

  getSection(id: number): Section | undefined {
    const data = sections.find(matchId(id));
    if (!data) {
      return undefined;
    }
    return mapSectionData(data);
  }

  isBavarian(section: Section): boolean {
    return section.jdavState.id === 2;
  }
}
