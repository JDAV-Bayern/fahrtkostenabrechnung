import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ExpenseListComponent } from 'src/app/expenses/expense-list/expense-list.component';
import { FoodExpenseCardComponent } from 'src/app/expenses/food-expense-card/food-expense-card.component';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';
import { Button } from 'src/app/shared/ui/button';
import { ReimbursementService } from '../../shared/reimbursement.service';

@Component({
  selector: 'jdav-expenses-extra-step',
  templateUrl: './expenses-extra-step.html',
  imports: [
    Button,
    ReactiveFormsModule,
    CurrencyPipe,
    ExpenseListComponent,
    FoodExpenseCardComponent,
  ],
})
export class ExpensesExtraStep {
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
