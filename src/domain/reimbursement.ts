import { Course } from './course';
import { Expense } from './expense';
import { Participant } from './participant';

export interface Reimbursement {
  course: Course;
  participant: Participant;
  expenses: {
    inbound: Expense[];
    onsite: Expense[];
    outbound: Expense[];
  };
  note: string;
}
