import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import {
  AddExpenseModalComponent,
  ExpenseDialogData
} from '../add-expense-modal/add-expense-modal.component';
import { FormGroup } from '@angular/forms';
import { ReimbursementControlService } from 'src/app/reimbursement-control.service';
import { ExpenseForm } from 'src/app/reimbursement-forms';
import { CurrencyPipe } from '@angular/common';
import { ExpenseAmountPipe, ExpenseTypePipe } from 'src/app/pipes/expense.pipe';
import { ExpenseDetailsComponent } from '../../expense-details/expense-details.component';

@Component({
  selector: 'app-expense-list-row',
  templateUrl: './expense-list-row.component.html',
  styleUrls: ['./expense-list-row.component.css'],
  standalone: true,
  imports: [
    CurrencyPipe,
    DialogModule,
    ExpenseTypePipe,
    ExpenseAmountPipe,
    ExpenseDetailsComponent
  ]
})
export class ExpenseListRowComponent {
  @Output()
  deleteRow = new EventEmitter<number>();

  @Input({ required: true })
  form!: FormGroup<ExpenseForm>;

  @Input({ required: true })
  index!: number;

  constructor(
    private controlService: ReimbursementControlService,
    private readonly dialog: Dialog
  ) {}

  get expense() {
    return this.controlService.getExpense(this.form.getRawValue());
  }

  editMe() {
    const data: ExpenseDialogData = { form: this.form, showPlan: false };
    this.dialog.open(AddExpenseModalComponent, { data });
  }

  deleteMe() {
    this.deleteRow.emit(this.index);
  }
}
