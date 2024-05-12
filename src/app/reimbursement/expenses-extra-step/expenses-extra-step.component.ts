import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormCardComponent } from 'src/app/shared/form-card/form-card.component';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { CurrencyPipe, NgIf } from '@angular/common';
import { ReimbursementService } from '../shared/reimbursement.service';
import { ExpenseControlService } from 'src/app/expenses/shared/expense-control.service';
import { ExpenseListComponent } from 'src/app/expenses/expense-list/expense-list.component';
import { FoodExpenseModalComponent } from 'src/app/expenses/food-expense-modal/food-expense-modal.component';
import { MaterialExpenseModalComponent } from 'src/app/expenses/material-expense-modal/material-expense-modal.component';

@Component({
  selector: 'app-expenses-extra-step',
  templateUrl: './expenses-extra-step.component.html',
  styleUrls: ['./expenses-extra-step.component.css'],
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    CurrencyPipe,
    DialogModule,
    FormCardComponent,
    ExpenseListComponent
  ]
})
export class ExpensesExtraStepComponent {
  parentForm;
  foodForm;
  materialForm;

  constructor(
    private reimbursementService: ReimbursementService,
    private reimbursementControlService: ReimbursementControlService,
    private expenseControlService: ExpenseControlService,
    private dialog: Dialog
  ) {
    this.parentForm = reimbursementControlService.expensesStep;
    this.foodForm = reimbursementControlService.foodExpenses;
    this.materialForm = reimbursementControlService.materialExpenses;
  }

  get report() {
    const reimbursment = this.reimbursementControlService.getReimbursement();
    return this.reimbursementService.getReport(reimbursment);
  }

  getOpenFoodDialogFn() {
    return (form?: FormGroup) => {
      if (!form) {
        form = this.expenseControlService.createFoodForm();
      }
      return this.dialog.open<FormGroup>(FoodExpenseModalComponent, {
        data: { form }
      });
    };
  }

  getOpenMaterialDialogFn(form?: FormGroup) {
    return (form?: FormGroup) => {
      if (!form) {
        form = this.expenseControlService.createMaterialForm();
      }
      return this.dialog.open<FormGroup>(MaterialExpenseModalComponent, {
        data: { form }
      });
    };
  }

  completeFood() {
    this.reimbursementControlService.completeFood();
  }
}
