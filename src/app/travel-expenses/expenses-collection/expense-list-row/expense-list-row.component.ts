import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddExpenseModalComponent } from '../add-expense-modal/add-expense-modal.component';
import { FormGroup } from '@angular/forms';
import { ReimbursementControlService } from 'src/app/reimbursement-control.service';
import { ExpenseService } from 'src/app/expense.service';
import { ExpenseType } from 'src/domain/expense';

@Component({
  selector: 'app-expense-list-row',
  templateUrl: './expense-list-row.component.html',
  styleUrls: ['./expense-list-row.component.css']
})
export class ExpenseListRowComponent {
  @Output()
  deleteRow = new EventEmitter<number>();

  @Input({ required: true })
  form!: FormGroup;

  @Input({ required: true })
  index!: number;

  constructor(
    private expenseService: ExpenseService,
    private controlService: ReimbursementControlService,
    private readonly dialog: MatDialog
  ) {}

  get expense() {
    return this.controlService.getExpense(this.form.value);
  }

  editMe() {
    this.dialog
      .open(AddExpenseModalComponent, {
        data: { form: this.form },
        width: '80%'
      })
      .afterClosed()
      .subscribe(() => this.controlService.saveForm());
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
