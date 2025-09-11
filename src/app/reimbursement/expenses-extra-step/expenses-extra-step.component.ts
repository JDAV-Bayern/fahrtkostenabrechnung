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
    FormCardComponent,
    ExpenseListComponent,
    FoodExpenseCardComponent,
  ],
})
export class ExpensesExtraStepComponent {
  private readonly reimbursementService = inject(ReimbursementService);
  private readonly controlService = inject(ReimbursementControlService);

  parentForm = this.controlService.expensesStep;
  foodForm = this.controlService.foodExpenses;
  materialForm = this.controlService.materialExpenses;

  get report() {
    const reimbursment = this.controlService.getReimbursement();
    return this.reimbursementService.getReport(reimbursment);
  }

  get isFoodEnabled() {
    return this.controlService.foodSettings.controls.isEnabled;
  }
}
