import { Absence, Discount, ExpenseType } from 'src/domain/expense.model';
import { MeetingType } from 'src/domain/meeting.model';

export interface ExpenseConfig {
  allowed: ExpenseType[];
  transport?: {
    car: number[];
    public: Record<Discount, number>;
    plan: number;
    bike: number;
  };
  food?: Record<Absence, number>;
  maxTotal?: number;
}
export type ExpenseConfigMap = Record<MeetingType, ExpenseConfig>;
