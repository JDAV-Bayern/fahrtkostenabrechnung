export interface JdavOrganisation {
  id: number;
  name: string;
}

export interface JdavState extends JdavOrganisation {
  sections: JdavOrganisation[];
}

export interface Section extends JdavOrganisation {
  jdavState: JdavOrganisation;
  jdavRegion: JdavOrganisation | null;
}

export interface SectionData {
  id: number;
  name: string;
  stateId: number;
  jdavStateId: number;
  jdavRegionId: number | null;
}
