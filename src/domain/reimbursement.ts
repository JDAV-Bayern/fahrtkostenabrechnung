import { Course } from './course';
import { Direction, Expense } from './expense';
import { Participant } from './participant';

export interface Reimbursement {
  course: Course;
  participant: Participant;
  expenses: { [key in Direction]: Expense[] };
  note: string;
}
