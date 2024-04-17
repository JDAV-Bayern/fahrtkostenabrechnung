import { Injectable } from '@angular/core';
import { Expense } from 'src/domain/expense';
import { Reimbursement } from 'src/domain/reimbursement';
import { SectionService } from './section.service';

export type ReimbursementSummary = {
  total: number;
  capped: boolean;
  uncappedTotal: number;
};

const discountFactors = {
  BC50: 1.1,
  BC25: 1.05,
  none: 1
};

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  constructor(public sectionService: SectionService) {}

  getAllExpenses(reimbursement: Reimbursement) {
    const expenses = reimbursement.expenses;
    return [...expenses.outbound, ...expenses.onsite, ...expenses.inbound];
  }

  getSummary(reimbursement: Reimbursement): ReimbursementSummary {
    const reducer = (sum: number, expense: Expense) =>
      sum + this.getAmount(expense);
    const total = this.getAllExpenses(reimbursement).reduce(reducer, 0);

    const sectionId = reimbursement.participant.sectionId;
    const section = this.sectionService.getSection(sectionId);
    const isBavarian = section
      ? this.sectionService.isBavarian(section)
      : false;

    if (!isBavarian && total > 75) {
      return { total: 75, capped: true, uncappedTotal: total };
    } else {
      return { total, capped: false, uncappedTotal: total };
    }
  }

  getAmount(expense: Expense) {
    switch (expense.type) {
      case 'car':
        const nPassengers = expense.passengers.length + 1;
        return expense.distance * Math.min(nPassengers, 6) * 0.05;
      case 'train':
        return expense.price * discountFactors[expense.discountCard];
      case 'bike':
        return expense.distance * 0.13;
      case 'plan':
        return 12.25;
    }
  }
}
