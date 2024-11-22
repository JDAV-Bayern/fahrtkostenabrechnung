import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormCardComponent } from 'src/app/shared/form-card/form-card.component';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';
import { DialogModule } from '@angular/cdk/dialog';
import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import {
  ReimbursementReport,
  ReimbursementService
} from '../shared/reimbursement.service';
import { ExpenseListComponent } from 'src/app/expenses/expense-list/expense-list.component';
import { toInterval } from 'src/app/shared/validators/date-range.validator';
import { getFoodOptions } from '../shared/food.validator';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-expenses-extra-step',
  templateUrl: './expenses-extra-step.component.html',
  styleUrls: ['./expenses-extra-step.component.css'],
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    CurrencyPipe,
    DatePipe,
    DialogModule,
    FormCardComponent,
    ExpenseListComponent
  ]
})
export class ExpensesExtraStepComponent {
  private readonly reimbursementService = inject(ReimbursementService);
  private readonly reimbursementControlService = inject(
    ReimbursementControlService
  );

  rootForm = this.reimbursementControlService.form;
  parentForm = this.reimbursementControlService.expensesStep;
  foodForm = this.reimbursementControlService.foodExpenses;
  materialForm = this.reimbursementControlService.materialExpenses;

  report$ = this.reimbursementControlService.reimbursement$.pipe(
    switchMap(reimbursement =>
      this.reimbursementService.getReport(reimbursement)
    )
  );

  get foodOptions() {
    const time =
      this.rootForm.controls.meeting.controls.committee.controls.time;
    const interval = toInterval(time);
    const foodOpts = interval ? getFoodOptions(interval) : [];
    return foodOpts;
  }

  completeFood() {
    this.reimbursementControlService.completeFood();
  }
}
