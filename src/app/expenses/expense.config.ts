import { Absence, Discount, ExpenseType, Meal } from 'src/domain/expense.model';
import { MeetingType } from 'src/domain/meeting.model';

export type ExpenseConfig = Record<
  MeetingType,
  {
    allowed: ExpenseType[];
    transport?: {
      car: number[];
      public: Record<Discount, number>;
      plan: number;
      bike: number;
    };
    food?: {
      allowance: Record<Absence, number>;
      meals: Record<Meal, number>;
    };
    maxTotal?: number;
  }
>;

export const expenseConfig: ExpenseConfig = {
  course: {
    allowed: ['transport'],
    transport: {
      car: [0.05, 0.1, 0.15, 0.2, 0.25, 0.3],
      public: {
        none: 1,
        BC25: 1.05,
        BC50: 1.1
      },
      plan: 14.5,
      bike: 0.13
    },
    maxTotal: 75
  },
  assembly: {
    allowed: ['transport'],
    transport: {
      car: [0.05, 0.1, 0.15, 0.2, 0.25, 0.3],
      public: {
        none: 1,
        BC25: 1.05,
        BC50: 1.1
      },
      plan: 14.5,
      bike: 0.13
    }
  },
  committee: {
    allowed: ['transport', 'food', 'material'],
    transport: {
      car: [0.2, 0.27, 0.3],
      public: {
        // for committee reimbursement, the discount is not handled by the form
        none: 1,
        BC25: 1,
        BC50: 1
      },
      plan: 14.5,
      bike: 0.13
    },
    food: {
      allowance: {
        fullDay: 28,
        travelDay: 14,
        workDay: 14
      },
      meals: {
        breakfast: 5.6,
        lunch: 11.2,
        dinner: 11.2
      }
    }
  }
};
