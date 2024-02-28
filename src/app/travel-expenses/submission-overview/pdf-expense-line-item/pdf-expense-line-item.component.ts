import { Component, Input } from '@angular/core';
import { ExpenseService } from 'src/app/expense.service';
import { Expense } from 'src/domain/expense';

@Component({
  selector: 'app-pdf-expense-line-item',
  templateUrl: './pdf-expense-line-item.component.html',
  styleUrls: ['./pdf-expense-line-item.component.css']
})
export class PdfExpenseLineItemComponent {
  @Input({ required: true })
  expense!: Expense;

  @Input({ required: true })
  index!: number;

  constructor(private expenseService: ExpenseService) {}

  getCosts() {
    return this.expenseService.getAmount(this.expense).toFixed(2);
  }

  getTitle() {
    return this.expenseService.getName(this.expense);
  }

  getDetails() {
    return this.expenseService.getDescription(this.expense);
  }
}
