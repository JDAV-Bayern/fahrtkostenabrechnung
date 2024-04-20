import { Meeting } from './meeting';
import {
  TransportExpense,
  FoodExpense,
  MaterialExpense,
  Direction
} from './expense';
import { Participant } from './participant';

export interface Reimbursement {
  meeting: Meeting;
  participant: Participant;
  expenses: {
    transport: { [key in Direction]: TransportExpense[] };
    food: FoodExpense[];
    material: MaterialExpense[];
  };
  note: string;
}
