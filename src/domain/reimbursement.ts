import { ICourse } from './course';
import { IExpense } from './expense';
import { IParticipant } from './participant';

export interface IReimbursement {
  course: ICourse;
  participant: IParticipant;
  expenses: {
    inbound: IExpense[];
    onsite: IExpense[];
    outbound: IExpense[];
  };
  note: string;
}
