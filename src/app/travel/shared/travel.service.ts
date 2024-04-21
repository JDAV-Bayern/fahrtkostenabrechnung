import { Injectable } from '@angular/core';
import { SectionService } from 'src/app/core/section.service';
import { ExpenseConfig, expenseConfig } from 'src/app/expenses/expense.config';
import { ExpenseService } from 'src/app/expenses/shared/expense.service';
import { Expense } from 'src/domain/expense.model';
import { MeetingType } from 'src/domain/meeting.model';
import { Travel } from 'src/domain/travel.model';

export type TravelSummary = {
  transport: number;
  food: number;
  material: number;
  subtotal: number;
  total: number;
  totalReduced: boolean;
  receiptsRequired: boolean;
};

@Injectable({
  providedIn: 'root'
})
export class TravelService {
  config = expenseConfig.course;

  constructor(
    private expenseService: ExpenseService,
    private sectionService: SectionService
  ) {}

  set meetingType(type: MeetingType) {
    this.config = expenseConfig[type];
    this.expenseService.config = this.config;
  }

  getTransportExpenses(travel: Travel) {
    return Object.values(travel.expenses.transport).flat();
  }

  getSummary(travel: Travel): TravelSummary {
    const reducer = (sum: number, expense: Expense) =>
      sum + this.expenseService.getAmount(expense);

    const transport = this.getTransportExpenses(travel).reduce(reducer, 0);
    const food = travel.expenses.food.reduce(reducer, 0);
    const material = travel.expenses.material.reduce(reducer, 0);
    const subtotal = transport + food + material;

    const trainTravel = this.getTransportExpenses(travel).some(e =>
      ['train', 'plan'].includes(e.mode)
    );
    const materialExpenses = material > 0;
    const receiptsRequired = trainTravel || materialExpenses;

    const summary: TravelSummary = {
      transport,
      food,
      material,
      subtotal,
      total: subtotal,
      totalReduced: false,
      receiptsRequired
    };

    if (this.config.maxTotal && subtotal > this.config.maxTotal) {
      const sectionId = travel.participant.sectionId;
      const section = this.sectionService.getSection(sectionId);
      const isBavarian = section
        ? this.sectionService.isBavarian(section)
        : false;

      if (!isBavarian) {
        summary.total = this.config.maxTotal;
        summary.totalReduced = true;
      }
    }

    return summary;
  }
}
