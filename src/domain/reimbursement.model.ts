import { Committee, MeetingType } from './meeting.model';
import {
  TransportExpense,
  FoodExpense,
  MaterialExpense,
  Direction
} from './expense.model';
import { Participant } from './participant.model';

export interface ReimbursementBase {
  type: MeetingType;
  participant: Participant;
  expenses: {
    transport: { [key in Direction]: TransportExpense[] };
    food: FoodExpense[];
    material: MaterialExpense[];
  };
  note: string;
}

export interface CourseReimbursement extends ReimbursementBase {
  type: 'course';
  course: number;
}

export interface CommitteeReimbursement extends ReimbursementBase {
  type: 'committee';
  committee: Committee;
}

export type Reimbursement = CourseReimbursement | CommitteeReimbursement;
