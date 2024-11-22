import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Expense, TransportMode } from 'src/domain/expense.model';
import { TransportExpenseModalComponent } from '../transport-expense-modal/transport-expense-modal.component';
import { TransportExpenseCompletion } from 'src/app/reimbursement/shared/reimbursement-control.service';
import { FoodExpenseModalComponent } from '../food-expense-modal/food-expense-modal.component';
import { MaterialExpenseModalComponent } from '../material-expense-modal/material-expense-modal.component';

export interface ExpenseDialogData<T extends Expense> {
  type: T['type'];
  control: FormControl<T>;
  transport?: {
    allowedModes: TransportMode[];
    completion: TransportExpenseCompletion;
  };
}

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
  type: T['type'];
  control: FormControl<T>;
  allowedModes: TransportMode[];
  completion: TransportExpenseCompletion;

  constructor(@Inject(DIALOG_DATA) data: ExpenseDialogData<T>) {
    this.type = data.type;
    this.control = data.control;
    this.allowedModes = data.transport?.allowedModes || [];
    this.completion = data.transport?.completion || {};
  }
}
