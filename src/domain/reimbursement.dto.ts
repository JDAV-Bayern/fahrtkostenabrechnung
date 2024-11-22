import {
  FoodExpense,
  MaterialExpense,
  TransportExpense
} from './expense.model';
import { Committee, MeetingType } from './meeting.model';
import { ParticipantDto } from './participant.dto';

export interface ReimbursementDto {
  type: MeetingType;
  participant: ParticipantDto;
  transport: TransportExpense[];
  food: FoodExpense[];
  generic: MaterialExpense[];
  note: string;
}

export interface CourseReimbursementDto extends ReimbursementDto {
  type: 'course';
  course: number;
}

export interface CommitteeReimbursementDto extends ReimbursementDto {
  type: 'committee';
  travel_details: Committee;
}
