import { Meeting } from './meeting.model';
import {
  TransportExpense,
  FoodExpense,
  MaterialExpense,
  Direction
} from './expense.model';
import { Participant } from './participant.model';

export interface Travel {
  meeting: Meeting;
  participant: Participant;
  expenses: {
    transport: { [key in Direction]: TransportExpense[] };
    food: FoodExpense[];
    material: MaterialExpense[];
  };
  note: string;
}
