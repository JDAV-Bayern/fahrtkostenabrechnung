import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  Direction,
  ICarExpense,
  IExpense,
  mapTripToReturn,
  mockCarExpense
} from 'src/domain/expense';
import { ReimbursementService } from '../reimbursement.service';
import { MatDialog } from '@angular/material/dialog';
import { AddExpenseModalComponent } from './add-expense-modal/add-expense-modal.component';

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
    private readonly reimbursementService: ReimbursementService
  ) {
    reimbursementService
      .getReimbursment()
      .expenses.forEach(expense => this.addExpense(expense));
  }
  openAddExpenseDialog(direction: 'to' | 'from' | 'at') {
    const dialogRef = this.dialog.open(AddExpenseModalComponent, {
      id: 'add-expense-modal',
      width: 'min(95vw, 700px)'
    });

    const lastExpense = this.getLastExpense(direction);
    const startLocation = lastExpense?.endLocation;
    const carType = this.getCarType();

    dialogRef.componentInstance.direction = direction;
    dialogRef.componentInstance.expense = {
      startLocation,
      ...(carType ? { carType } : {})
    } as IExpense;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addExpense(result);
        this.storeExpenses();
      }
    });
  }
  getCarType() {
    return (
      this.getAllExpenses().find(expense => 'carType' in expense) as ICarExpense
    )?.carType;
  }
  getLastExpense(direction: 'to' | 'from' | 'at') {
    const lastToExpense = this.expensesTo[this.expensesTo.length - 1];
    if (direction === 'to') {
      return lastToExpense;
    }
    if (direction === 'at') {
      return this.expensesAt[this.expensesAt.length - 1] || lastToExpense;
    }
    return this.expensesFrom[this.expensesFrom.length - 1] || lastToExpense;
  }
  getAllExpenses() {
    return [...this.expensesTo, ...this.expensesAt, ...this.expensesFrom];
  }
  storeExpenses() {
    this.reimbursementService.setExpenses(this.getAllExpenses());
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
    const expense = [
      ...this.expensesTo,
      ...this.expensesAt,
      ...this.expensesFrom
    ].find(expense => expense.id === expenseId);
    if (!expense) {
      return;
    }
    const dialogRef = this.dialog.open(AddExpenseModalComponent, {
      id: 'add-expense-modal',
      width: '80%'
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
    const reduceSumTotalReimbursement = (list: IExpense[]) =>
      list.reduce(
        (sum: number, expense: IExpense) => sum + expense.totalReimbursement(),
        0
      );
    return (
      reduceSumTotalReimbursement(this.expensesFrom) +
      reduceSumTotalReimbursement(this.expensesAt) +
      reduceSumTotalReimbursement(this.expensesTo)
    );
  }
  deleteRow(expenseId: number) {
    this.expensesTo = this.expensesTo.filter(
      expense => expense.id !== expenseId
    );
    this.expensesFrom = this.expensesFrom.filter(
      expense => expense.id !== expenseId
    );
    this.expensesAt = this.expensesAt.filter(
      expense => expense.id !== expenseId
    );
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
