import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ExpenseDetailsComponent } from '../shared/expense-details/expense-details.component';
import { Expense } from 'src/domain/expense.model';
import { ExpenseTitlePipe } from '../shared/expense-title.pipe';
import { ExpenseAmountPipe } from '../shared/expense-amount.pipe';

@Component({
  selector: 'app-expense-card',
  templateUrl: './expense-card.component.html',
  styleUrls: ['./expense-card.component.css'],
  imports: [
    CurrencyPipe,
    DatePipe,
    ExpenseTitlePipe,
    ExpenseAmountPipe,
    ExpenseDetailsComponent
  ]
})
export class ExpenseCardComponent {
  @Input({ required: true })
  expense!: Expense;

  @Output()
  editRow = new EventEmitter<void>();

  @Output()
  deleteRow = new EventEmitter<number>();

  editMe() {
    this.editRow.emit();
  }

  deleteMe() {
    this.deleteRow.emit();
  }
}
