import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
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
import { ReimbursementDto } from 'src/domain/reimbursement.dto';
import { Reimbursement } from 'src/domain/reimbursement.model';

export type ReimbursementReport = {
  categories: Partial<Record<ExpenseType, number>>;
  total: number;
  totalReduced: boolean;
  receiptsRequired: boolean;
};

@Injectable({
  providedIn: 'root'
})
export class ReimbursementService {
  private readonly http = inject(HttpClient);
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

  getReport(reimbursement: Reimbursement): Observable<ReimbursementReport> {
    const reducer = (sum: number, expense: Expense) =>
      sum + this.expenseService.getAmount(expense);

    const categories: ReimbursementReport['categories'] = {};
    for (let type of this.config.allowed) {
      categories[type] = this.getExpenses(type, reimbursement).reduce(
        reducer,
        0
      );
    }

    const sectionId = reimbursement.participant.sectionId;
    const section$ = this.sectionService.getSection(sectionId);

    return section$.pipe(
      switchMap(section => this.sectionService.isBavarian(section)),
      map(isBavarian => {
        let total = Object.values(categories).reduce(
          (sum, item) => sum + item,
          0
        );
        let totalReduced = false;

        // check if total is reduced
        if (
          !isBavarian &&
          this.config.maxTotal &&
          total > this.config.maxTotal
        ) {
          total = this.config.maxTotal;
          totalReduced = true;
        }

        // check if receipt is required
        const publicExpense = this.getExpenses('transport', reimbursement).some(
          e => ['public', 'plan'].includes(e.mode)
        );
        const materialExpenses = (categories.material || 0) > 0;
        const receiptsRequired = publicExpense || materialExpenses;

        return { categories, total, totalReduced, receiptsRequired };
      })
    );
  }

  save(reimbursement: Reimbursement) {
    this.http
      .post<ReimbursementDto>('/api/reimbursements', {
        ...reimbursement,
        participant: {
          given_name: reimbursement.participant.givenName,
          family_name: reimbursement.participant.familyName,
          section_id: reimbursement.participant.sectionId,
          email: reimbursement.participant.email,
          address: {
            line1: reimbursement.participant.address.line1,
            postal_code: reimbursement.participant.address.postalCode,
            locality: reimbursement.participant.address.locality,
            country_id: reimbursement.participant.address.countryId
          },
          bank_account: reimbursement.participant.bankAccount
        },
        transport: [
          ...reimbursement.expenses.transport.inbound.map(e => ({
            ...e,
            direction: 'inbound'
          })),
          ...reimbursement.expenses.transport.onsite.map(e => ({
            ...e,
            direction: 'onsite'
          })),
          ...reimbursement.expenses.transport.outbound.map(e => ({
            ...e,
            direction: 'outbound'
          }))
        ],
        food: reimbursement.expenses.food,
        material: reimbursement.expenses.material
      })
      .subscribe(console.log);
  }
}
