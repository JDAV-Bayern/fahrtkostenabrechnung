export type MeetingType = 'course' | 'assembly' | 'committee';

export interface MeetingBase {
  type: MeetingType;
  name: string;
}

export interface Course extends MeetingBase {
  type: 'course';
  code: string;
}

export interface Assembly extends MeetingBase {
  type: 'assembly';
}

export interface Committee extends MeetingBase {
  type: 'committee';
  location: string;
  period: [Date, Date];
}

export type Meeting = Course | Assembly | Committee;
