import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormCardComponent } from 'src/app/shared/form-card/form-card.component';
import { TravelControlService } from 'src/app/travel/shared/travel-control.service';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule
} from '@danielmoncada/angular-datetime-picker';
import { CurrencyPipe } from '@angular/common';
import { TravelService } from '../shared/travel.service';
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
    ReactiveFormsModule,
    CurrencyPipe,
    DialogModule,
    FormCardComponent,
    ExpenseListComponent,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ]
})
export class ExpensesExtraStepComponent {
  parentForm;
  foodForm;
  materialForm;

  constructor(
    private travelService: TravelService,
    private travelControlService: TravelControlService,
    private expenseControlService: ExpenseControlService,
    private dialog: Dialog
  ) {
    this.parentForm = travelControlService.form.controls.expenses;
    this.foodForm = travelControlService.foodExpensesStep;
    this.materialForm = travelControlService.materialExpensesStep;
  }

  get summary() {
    const reimbursment = this.travelControlService.getTravel();
    return this.travelService.getSummary(reimbursment);
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
        form = this.expenseControlService.createFoodForm();
      }
      return this.dialog.open<FormGroup>(MaterialExpenseModalComponent, {
        data: { form }
      });
    };
  }
}
