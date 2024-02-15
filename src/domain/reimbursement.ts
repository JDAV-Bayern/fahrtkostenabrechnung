import { ICourseDetails } from './course-details';
import { IExpense } from './expense';
import { IParticipantDetails } from './participant-details';

export interface IReimbursement {
  id: number;
  formDate: Date;
  courseDetails: ICourseDetails;
  participantDetails: IParticipantDetails;
  expenses: {
    to: IExpense[];
    at: IExpense[];
    from: IExpense[];
  };
  note: string;
}
