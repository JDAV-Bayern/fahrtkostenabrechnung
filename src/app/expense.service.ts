import { Injectable } from '@angular/core';
import { Expense } from 'src/domain/expense';
import { Reimbursement } from 'src/domain/reimbursement';
import { SectionService } from './section.service';

export type ReimbursementSummary = {
  transport: number;
  food: number;
  material: number;
  subtotal: number;
  total: number;
  capped: boolean;
  requireReceipts: boolean;
};

const discountFactors = {
  BC50: 1.1,
  BC25: 1.05,
  none: 1
};

const absenceAllowance = {
  fullDay: 28,
  travelDay: 14,
  workDay: 14
};

const mealPrices = {
  breakfast: 5.6,
  lunch: 11.2,
  dinner: 11.2
};

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  constructor(public sectionService: SectionService) {}

  getTransportExpenses(reimbursement: Reimbursement) {
    return Object.values(reimbursement.expenses.transport).flat();
  }

  getSummary(reimbursement: Reimbursement): ReimbursementSummary {
    const reducer = (sum: number, expense: Expense) =>
      sum + this.getAmount(expense);

    const transport = this.getTransportExpenses(reimbursement).reduce(
      reducer,
      0
    );
    const food = reimbursement.expenses.food.reduce(reducer, 0);
    const material = reimbursement.expenses.material.reduce(reducer, 0);
    const subtotal = transport + food + material;

    const sectionId = reimbursement.participant.sectionId;
    const section = this.sectionService.getSection(sectionId);
    const isBavarian = section
      ? this.sectionService.isBavarian(section)
      : false;

    const trainTravel = this.getTransportExpenses(reimbursement).some(e =>
      ['train', 'plan'].includes(e.mode)
    );
    const materialExpenses = material > 0;
    const requireReceipts = trainTravel || materialExpenses;

    const summary: ReimbursementSummary = {
      transport,
      food,
      material,
      subtotal,
      total: subtotal,
      capped: false,
      requireReceipts
    };

    if (!isBavarian && subtotal > 75) {
      summary.total = 75;
      summary.capped = true;
    }

    return summary;
  }

  getAmount(expense: Expense) {
    switch (expense.type) {
      case 'transport':
        switch (expense.mode) {
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
      case 'food':
        let amount = absenceAllowance[expense.absence];
        for (let meal of expense.meals) {
          amount -= mealPrices[meal];
        }
        return amount > 0 ? amount : 0;
      case 'material':
        return expense.amount;
    }
  }
}
