import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormCardComponent } from 'src/app/form-card/form-card.component';
import { ReimbursementControlService } from 'src/app/reimbursement-control.service';
import { ExpenseListComponent } from '../expense/expense-list/expense-list.component';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { FoodExpenseModalComponent } from '../expense/food-expense-modal/food-expense-modal.component';
import { MaterialExpenseModalComponent } from '../expense/material-expense-modal/material-expense-modal.component';
import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule
} from '@danielmoncada/angular-datetime-picker';
import { ExpenseService } from 'src/app/expense.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-committee-expenses',
  templateUrl: './committee-expenses.component.html',
  styleUrls: ['./committee-expenses.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CurrencyPipe,
    DialogModule,
    FormCardComponent,
    ExpenseListComponent,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ]
})
export class CommitteeExpensesComponent {
  parentForm;
  foodForm;
  materialForm;

  constructor(
    private controlService: ReimbursementControlService,
    private expenseService: ExpenseService,
    private dialog: Dialog
  ) {
    this.parentForm = controlService.form.controls.expenses;
    this.foodForm = controlService.foodExpensesStep;
    this.materialForm = controlService.materialExpensesStep;
  }

  get summary() {
    const reimbursment = this.controlService.getReimbursement();
    return this.expenseService.getSummary(reimbursment);
  }

  getOpenFoodDialogFn() {
    return (form?: FormGroup) =>
      this.dialog.open<FormGroup>(FoodExpenseModalComponent, {
        data: { form }
      });
  }

  getOpenMaterialDialogFn(form?: FormGroup) {
    return (form?: FormGroup) =>
      this.dialog.open<FormGroup>(MaterialExpenseModalComponent, {
        data: { form }
      });
  }
}
