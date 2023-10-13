import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IExpense } from 'src/domain/expense';
import { ReimbursementService } from '../reimbursement.service';
import { MatDialog } from '@angular/material/dialog';
import { AddExpenseModalComponent } from '../add-expense-modal/add-expense-modal.component';

@Component({
  selector: 'app-expenses-collection-component',
  templateUrl: './expenses-collection-component.component.html',
  styleUrls: ['./expenses-collection-component.component.css']
})
export class ExpensesCollectionComponentComponent {
  expenses: IExpense[];
  constructor(
    private readonly router: Router,
    public dialog: MatDialog,
    private readonly reimbursementService: ReimbursementService) {
    this.expenses = reimbursementService.getReimbursment().expenses;
  }
  openAddExpenseDialog() {
    const dialogRef = this.dialog.open(AddExpenseModalComponent, {
      width: '80%',
      data: {} // You can pass data to the modal if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle the result after the modal is closed
      if (result) {
        // Add the new expense to your list
      }
    });
    const expense: IExpense = {
      id: '',
      totalReimbursement: function (): number {
        throw new Error('Function not implemented.');
      },
      position: 0,
      direction: 'to'
    };
    this.expenses.push(expense);
  }
  continue() {
    this.router.navigate(['zusammenfassen-und-abschicken']);
  }
  back() {
    this.router.navigate(['kurs-und-personen-infos']);
  }
}
