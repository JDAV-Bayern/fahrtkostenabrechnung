import { ICourseDetails } from './course-details';
import { IExpense } from './expense';
import { IParticipantDetails } from './participant-details';

export interface IReimbursement {
  id: string;
  formDate: Date;
  courseDetails: ICourseDetails;
  participantDetails: IParticipantDetails;
  expenses: IExpense[];
  note: string;
}
