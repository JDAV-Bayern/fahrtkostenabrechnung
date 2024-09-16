import { Observable } from 'rxjs';
import { Federation } from './section.model';

export type MeetingType = 'course' | 'committee';

export interface Meeting {
  name: string;
  location: string;
  startDate: Date;
  endDate: Date;
}

export enum CourseType {
  BASIC = 'GA',
  CONTINUING = 'FB',
  ADVANCED = 'AM',
  ASSEMBLY = 'JV',
  SPECIAL = 'SV'
}

export interface CourseDto {
  id: number;
  number: string;
  type: CourseType;
  name: string;
  start_date: string;
  end_date: string;
  location: string;
  // year: number;
  federation: number;
}

export interface Course extends Meeting {
  id: number;
  number: string;
  type: CourseType;
  // year$: Observable<CourseYear>;
  federation$: Observable<Federation>;
}

export type Committee = Meeting;
