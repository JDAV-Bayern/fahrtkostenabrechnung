import { Meeting } from './meeting.model';
import {
  TransportExpense,
  FoodExpense,
  MaterialExpense,
  Direction
} from './expense.model';
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
