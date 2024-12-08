import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  Expense,
  TransportExpense,
  TransportMode
} from 'src/domain/expense.model';
import { TransportExpenseModalComponent } from '../transport-expense-modal/transport-expense-modal.component';
import { TransportExpenseCompletion } from 'src/app/reimbursement/shared/reimbursement-control.service';
import { FoodExpenseModalComponent } from '../food-expense-modal/food-expense-modal.component';
import { MaterialExpenseModalComponent } from '../material-expense-modal/material-expense-modal.component';

export interface ExpenseDialogData<T extends Expense> {
  type: T['type'];
  control: FormControl<T>;
  extra?: ExpenseExtraData<T>;
}

export type ExpenseExtraData<T extends Expense> = T extends TransportExpense
  ? {
      allowedModes: TransportMode[];
      completion: TransportExpenseCompletion;
    }
  : never;

@Component({
  selector: 'app-expense-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TransportExpenseModalComponent,
    FoodExpenseModalComponent,
    MaterialExpenseModalComponent
  ],
  templateUrl: './expense-modal.component.html'
})
export class ExpenseModalComponent<T extends Expense> {
  readonly data = inject<ExpenseDialogData<T>>(DIALOG_DATA);
}
