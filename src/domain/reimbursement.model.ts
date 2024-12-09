import {
  Direction,
  FoodExpense,
  MaterialExpense,
  TransportExpense
} from './expense.model';
import { Meeting } from './meeting.model';
import { Participant } from './participant.model';

export interface Reimbursement {
  meeting: Meeting;
  participant: Participant;
  expenses: {
    transport: Record<Direction, TransportExpense[]>;
    food: FoodExpense[];
    material: MaterialExpense[];
  };
  note: string;
}
