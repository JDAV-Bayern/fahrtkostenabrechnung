import {
  Direction,
  FoodExpense,
  MaterialExpense,
  TransportExpense
} from './expense.model';
import { Committee, MeetingType } from './meeting.model';
import { Participant } from './participant.model';

export interface ReimbursementBase {
  type: MeetingType;
  participant: Participant;
  expenses: {
    transport: Record<Direction, TransportExpense[]>;
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
