import { Component, Input } from '@angular/core';
import { IExpense } from 'src/domain/expense';

@Component({
  selector: 'app-expense-list-row',
  templateUrl: './expense-list-row.component.html',
  styleUrls: ['./expense-list-row.component.css']
})
export class ExpenseListRowComponent {
  @Input({ required: true })
  expense!: IExpense;
}
