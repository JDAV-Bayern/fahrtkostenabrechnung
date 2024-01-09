import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Direction, IExpense, mapTripToReturn, mockCarExpense } from 'src/domain/expense';
import { ReimbursementService } from '../reimbursement.service';
import { MatDialog } from '@angular/material/dialog';
import { AddExpenseModalComponent } from '../add-expense-modal/add-expense-modal.component';

@Component({
  selector: 'app-expenses-collection-component',
  templateUrl: './expenses-collection-component.component.html',
  styleUrls: ['./expenses-collection-component.component.css']
})
export class ExpensesCollectionComponentComponent {
  expensesTo: IExpense[] = [];
  expensesFrom: IExpense[] = [];
  expensesAt: IExpense[] = [];
  constructor(
    private readonly router: Router,
    public dialog: MatDialog,
    private readonly reimbursementService: ReimbursementService) {
    reimbursementService.getReimbursment().expenses.forEach(expense => this.addExpense(expense));
  }
  openAddExpenseDialog(direction: 'to' | 'from' | 'at') {
    const dialogRef = this.dialog.open(AddExpenseModalComponent, {
      id: 'add-expense-modal',
      width: '80%',
    });

    dialogRef.componentInstance.direction = direction;
    dialogRef.componentInstance.expense = {} as IExpense;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addExpense(result);
        this.storeExpenses();
      }
    });
  }
  storeExpenses() {
    this.reimbursementService.setExpenses([...this.expensesTo, ...this.expensesAt, ...this.expensesFrom]);
  }
  addExpense(expense: IExpense) {
    switch (expense.direction) {
      case 'from':
        this.expensesFrom.push(expense);
        return;
      case 'to':
        this.expensesTo.push(expense);
        return;
      case 'at':
        this.expensesAt.push(expense);
    }
  }
  editRow(expenseId: number) {
    console.log("editRowl", expenseId);
    const expense = [...this.expensesTo, ...this.expensesAt, ...this.expensesFrom].find(expense => expense.id === expenseId);
    if (!expense) {
      return;
    }
    console.log("found expense", expenseId);
    const dialogRef = this.dialog.open(AddExpenseModalComponent, {
      id: 'add-expense-modal',
      width: '80%',
    });
    dialogRef.componentInstance.direction = expense.direction;
    dialogRef.componentInstance.expense = expense;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteRow(expenseId);
        this.addExpense(result);
        this.storeExpenses();
      }
    });
  }
  getSum() {
    const reduceSumTotalReimbursement = (list: IExpense[]) => list.reduce((sum: number, expense: IExpense) => sum + expense.totalReimbursement(), 0);
    return reduceSumTotalReimbursement(this.expensesFrom) + reduceSumTotalReimbursement(this.expensesAt) + reduceSumTotalReimbursement(this.expensesTo);
  }
  deleteRow(expenseId: number) {
    this.expensesTo = this.expensesTo.filter(expense => expense.id !== expenseId);
    this.expensesFrom = this.expensesFrom.filter(expense => expense.id !== expenseId);
    this.expensesAt = this.expensesAt.filter(expense => expense.id !== expenseId);
    this.storeExpenses();
  }
  continue() {
    this.router.navigate(['zusammenfassen-und-abschicken']);
  }
  back() {
    this.router.navigate(['kurs-und-personen-infos']);
  }
  addReturnTrip() {
    this.expensesFrom = this.expensesTo.map(mapTripToReturn).reverse();
    this.storeExpenses();
  }
}
