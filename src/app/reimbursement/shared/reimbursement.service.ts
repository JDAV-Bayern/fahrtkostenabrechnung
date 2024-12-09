import { Injectable, inject } from '@angular/core';
import { SectionService } from 'src/app/core/section.service';
import { expenseConfig } from 'src/app/expenses/expense.config';
import { ExpenseService } from 'src/app/expenses/shared/expense.service';
import {
  Expense,
  ExpenseType,
  FoodExpense,
  MaterialExpense,
  TransportExpense
} from 'src/domain/expense.model';
import { MeetingType } from 'src/domain/meeting.model';
import { Reimbursement } from 'src/domain/reimbursement.model';

export interface ReimbursementReport {
  categories: Partial<Record<ExpenseType, number>>;
  total: number;
  totalReduced: boolean;
  receiptsRequired: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ReimbursementService {
  private readonly expenseService = inject(ExpenseService);
  private readonly sectionService = inject(SectionService);

  config = expenseConfig.course;

  set meetingType(type: MeetingType) {
    this.config = expenseConfig[type];
    this.expenseService.config = this.config;
  }

  getExpenses(
    type: 'transport',
    reimbursement: Reimbursement
  ): TransportExpense[];
  getExpenses(type: 'food', reimbursement: Reimbursement): FoodExpense[];
  getExpenses(
    type: 'material',
    reimbursement: Reimbursement
  ): MaterialExpense[];
  getExpenses(type: ExpenseType, reimbursement: Reimbursement): Expense[];

  getExpenses(type: ExpenseType, reimbursement: Reimbursement): Expense[] {
    if (type === 'transport') {
      return Object.values(reimbursement.expenses.transport).flat();
    } else {
      return reimbursement.expenses[type];
    }
  }

  getReport(reimbursement: Reimbursement): ReimbursementReport {
    const reducer = (sum: number, expense: Expense) =>
      sum + this.expenseService.getAmount(expense);

    const categories: ReimbursementReport['categories'] = {};
    for (const type of this.config.allowed) {
      categories[type] = this.getExpenses(type, reimbursement).reduce(
        reducer,
        0
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
    const publicExpense = this.getExpenses('transport', reimbursement).some(e =>
      ['public', 'plan'].includes(e.mode)
    );
    const materialExpenses = (categories.material || 0) > 0;
    const receiptsRequired = publicExpense || materialExpenses;

    return { categories, total, totalReduced, receiptsRequired };
  }
}
