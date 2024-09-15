export type MeetingType = 'course' | 'committee';

export interface MeetingBase {
  type: MeetingType;
  name: string;
}

export interface Course extends MeetingBase {
  type: 'course';
  code: string;
}

export interface Committee extends MeetingBase {
  type: 'committee';
  location: string;
  time: {
    start: Date;
    end: Date;
  };
}

export type Meeting = Course | Committee;
