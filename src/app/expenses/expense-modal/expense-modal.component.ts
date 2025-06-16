import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TransportExpenseCompletion } from 'src/app/reimbursement/shared/reimbursement-control.service';
import {
  Expense,
  TransportExpense,
  TransportMode
} from 'src/domain/expense.model';
import { MaterialExpenseModalComponent } from '../material-expense-modal/material-expense-modal.component';
import { TransportExpenseModalComponent } from '../transport-expense-modal/transport-expense-modal.component';

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
  imports: [
    ReactiveFormsModule,
    TransportExpenseModalComponent,
    MaterialExpenseModalComponent
  ],
  templateUrl: './expense-modal.component.html'
})
export class ExpenseModalComponent<T extends Expense> {
  readonly data = inject<ExpenseDialogData<T>>(DIALOG_DATA);
}
