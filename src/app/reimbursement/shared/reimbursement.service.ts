import { inject, Injectable } from '@angular/core';
import {
  closestIndexTo,
  differenceInHours,
  eachDayOfInterval,
  Interval,
  isValid,
  startOfDay,
} from 'date-fns';
import { SectionService } from 'src/app/core/section.service';
import {
  Absence,
  Expense,
  ExpenseType,
  FoodExpense,
  MaterialExpense,
  TransportExpense,
} from 'src/domain/expense.model';
import { MeetingType } from 'src/domain/meeting.model';
import { Reimbursement } from 'src/domain/reimbursement.model';
import { ExpenseConfig } from '../expenses/expense.config';
import { ExpenseConfigService } from '../expenses/shared/expense-config.service';
import { ExpenseService } from '../expenses/shared/expense.service';

const createFoodExpense = (date: Date, absence: Absence): FoodExpense => ({
  type: 'food',
  date,
  absence,
  breakfast: false,
  lunch: false,
  dinner: false,
});

export interface ReimbursementReport {
  categories: Partial<Record<ExpenseType, number>>;
  total: number;
  totalReduced: boolean;
  receiptsRequired: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ReimbursementService {
  private readonly expenseService = inject(ExpenseService);
  private readonly expenseConfigService = inject(ExpenseConfigService);
  private readonly sectionService = inject(SectionService);

  config?: ExpenseConfig;

  constructor() {
    this.setMeetingType('course');
  }

  set meetingType(type: MeetingType) {
    this.setMeetingType(type);
  }

  private setMeetingType(type: MeetingType) {
    this.expenseConfigService.getConfig(type).subscribe((config) => {
      this.config = config;
      this.expenseService.config = config;
    });
  }

  getExpenses(
    type: 'transport',
    reimbursement: Reimbursement,
  ): TransportExpense[];
  getExpenses(type: 'food', reimbursement: Reimbursement): FoodExpense[];
  getExpenses(
    type: 'material',
    reimbursement: Reimbursement,
  ): MaterialExpense[];
  getExpenses(type: ExpenseType, reimbursement: Reimbursement): Expense[];

  getExpenses(type: ExpenseType, reimbursement: Reimbursement): Expense[] {
    if (type === 'transport') {
      return Object.values(reimbursement.expenses.transport).flat();
    } else {
      return reimbursement.expenses[type];
    }
  }

  getFoodExpenses(time: Interval, isOvernight: boolean): FoodExpense[] {
    if (!isValid(time.start) || !isValid(time.end)) {
      return [];
    }

    // too short
    if (differenceInHours(time.end, time.start) < 8) {
      return [];
    }

    const dates = eachDayOfInterval(time);

    // single day
    if (dates.length === 1) {
      return [createFoodExpense(dates[0], 'single')];
    }

    if (dates.length === 2 && !isOvernight) {
      const midnight = startOfDay(time.end);
      const short = closestIndexTo(midnight, [time.start, time.end]) ?? 0;
      const long = 1 - short;

      return [createFoodExpense(dates[long], 'single')];
    }

    // add all days
    const expenses = dates.map((date) =>
      createFoodExpense(date, 'intermediate'),
    );
    expenses[0].absence = 'arrival';
    expenses[expenses.length - 1].absence = 'return';

    return expenses;
  }

  getReport(reimbursement: Reimbursement): ReimbursementReport {
    if (!this.config) {
      return {
        categories: {},
        total: 0,
        totalReduced: false,
        receiptsRequired: false,
      };
    }

    const reducer = (sum: number, expense: Expense) =>
      sum + this.expenseService.getAmount(expense);

    const categories: ReimbursementReport['categories'] = {};
    for (const type of this.config.allowed) {
      categories[type] = this.getExpenses(type, reimbursement).reduce(
        reducer,
        0,
      );
    }

    // check if total is reduced
    let total = Object.values(categories).reduce((sum, item) => sum + item, 0);
    let totalReduced = false;

    if (this.config.maxTotal && total > this.config.maxTotal) {
      const sectionId = reimbursement.participant.sectionId;
      const section = this.sectionService.getSection(sectionId);
      const isBavarian = section
        ? this.sectionService.isBavarian(section)
        : false;

      if (!isBavarian) {
        total = this.config.maxTotal;
        totalReduced = true;
      }
    }

    // check if receipt is required
    const publicExpense = this.getExpenses('transport', reimbursement).some(
      (e) => ['public', 'plan'].includes(e.mode),
    );
    const materialExpenses = (categories.material || 0) > 0;
    const receiptsRequired = publicExpense || materialExpenses;

    return { categories, total, totalReduced, receiptsRequired };
  }
}
