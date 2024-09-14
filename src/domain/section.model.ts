import { Observable } from 'rxjs';

export enum FederationLevel {
  NATIONAL,
  STATE,
  DISTRICT
}

export interface FederationDto {
  id: number;
  type: number;
  name: string;
  parent: number | null;
}

export interface Federation {
  id: number;
  type: FederationLevel;
  name: string;
  parent$: Observable<Federation> | null;
  sections$: Observable<Section[]>;
}

export interface SectionDto {
  id: number;
  number: number;
  name: string;
  state: number;
  district: number | null;
}

export interface Section {
  id: number;
  number: number;
  name: string;
  state$: Observable<Federation>;
  district$: Observable<Federation> | null;
}
