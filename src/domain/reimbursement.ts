import { Meeting } from './meeting';
import { Direction, Expense } from './expense';
import { Participant } from './participant';

export interface Reimbursement {
  meeting: Meeting;
  participant: Participant;
  expenses: { [key in Direction]: Expense[] };
  note: string;
}
