import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { ExpenseAmountPipe, ExpenseTypePipe } from 'src/app/pipes/expense.pipe';
import { ExpenseDetailsComponent } from '../expense-details/expense-details.component';
import { Expense } from 'src/domain/expense';

@Component({
  selector: 'app-expense-card',
  templateUrl: './expense-card.component.html',
  styleUrls: ['./expense-card.component.css'],
  standalone: true,
  imports: [
    NgIf,
    CurrencyPipe,
    DatePipe,
    ExpenseTypePipe,
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
