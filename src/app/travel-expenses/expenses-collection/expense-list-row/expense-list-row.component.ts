import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddExpenseModalComponent } from '../add-expense-modal/add-expense-modal.component';
import { FormGroup } from '@angular/forms';
import {
  ExpenseForm,
  ReimbursementControlService
} from 'src/app/reimbursement-control.service';
import { ExpenseService } from 'src/app/expense.service';

@Component({
  selector: 'app-expense-list-row',
  templateUrl: './expense-list-row.component.html',
  styleUrls: ['./expense-list-row.component.css']
})
export class ExpenseListRowComponent {
  @Output()
  deleteRow = new EventEmitter<number>();

  @Input({ required: true })
  form!: FormGroup<ExpenseForm>;

  @Input({ required: true })
  index!: number;

  constructor(
    private expenseService: ExpenseService,
    private controlService: ReimbursementControlService,
    private readonly dialog: MatDialog
  ) {}

  get expense() {
    return this.controlService.getExpense(this.form.getRawValue());
  }

  editMe() {
    this.dialog.open(AddExpenseModalComponent, {
      data: { form: this.form, showPlan: false },
      width: '80%'
    });
  }

  deleteMe() {
    this.deleteRow.emit(this.index);
  }

  getTitle() {
    return this.expenseService.getName(this.expense);
  }

  getAmount() {
    return this.expenseService.getAmount(this.expense).toFixed(2);
  }

  getDetails() {
    return this.expenseService.getDescription(this.expense);
  }
}
