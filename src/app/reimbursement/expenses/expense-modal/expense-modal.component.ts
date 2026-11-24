import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { TransportExpenseCompletion } from 'src/app/reimbursement/shared/reimbursement-form.service';
import {
  Expense,
  MaterialExpense,
  TransportExpense,
  TransportMode,
} from 'src/domain/expense.model';
import { MaterialExpenseModalComponent } from '../material-expense-modal/material-expense-modal.component';
import { TransportExpenseModalComponent } from '../transport-expense-modal/transport-expense-modal.component';

/**
 * What a dialog needs to create or edit an expense. The dialog is closed with
 * the new or changed expense, or without a result if it was cancelled.
 */
export type ExpenseDialogData =
  | {
      type: 'transport';
      expense?: TransportExpense;
      extra?: ExpenseExtraData<TransportExpense>;
    }
  | { type: 'material'; expense?: MaterialExpense };

export type ExpenseExtraData<T extends Expense> = T extends TransportExpense
  ? {
      allowedModes: TransportMode[];
      completion: TransportExpenseCompletion;
    }
  : never;

@Component({
  selector: 'app-expense-modal',
  imports: [TransportExpenseModalComponent, MaterialExpenseModalComponent],
  templateUrl: './expense-modal.component.html',
})
export class ExpenseModalComponent {
  readonly data = inject<ExpenseDialogData>(DIALOG_DATA);
}
