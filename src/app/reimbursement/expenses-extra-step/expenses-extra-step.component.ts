import { DialogModule } from '@angular/cdk/dialog';
import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ExpenseListComponent } from 'src/app/expenses/expense-list/expense-list.component';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';
import { FormCardComponent } from 'src/app/shared/form-card/form-card.component';
import { FoodExpenseCardComponent } from '../../expenses/food-expense-card/food-expense-card.component';
import { ReimbursementService } from '../shared/reimbursement.service';

@Component({
  selector: 'app-expenses-extra-step',
  templateUrl: './expenses-extra-step.component.html',
  styleUrls: ['./expenses-extra-step.component.css'],
  imports: [
    ReactiveFormsModule,
    CurrencyPipe,
    DialogModule,
    FormCardComponent,
    ExpenseListComponent,
    FoodExpenseCardComponent
  ]
})
export class ExpensesExtraStepComponent {
  private readonly reimbursementService = inject(ReimbursementService);
  private readonly reimbursementControlService = inject(
    ReimbursementControlService
  );

  parentForm = this.reimbursementControlService.expensesStep;
  foodForm = this.reimbursementControlService.foodExpenses;
  materialForm = this.reimbursementControlService.materialExpenses;

  get report() {
    const reimbursment = this.reimbursementControlService.getReimbursement();
    return this.reimbursementService.getReport(reimbursment);
  }
}
