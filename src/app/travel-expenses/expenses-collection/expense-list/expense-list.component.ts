import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReimbursementService } from 'src/app/reimbursement.service';
import { Direction, ICarExpense, IExpense } from 'src/domain/expense';
import { AddExpenseModalComponent } from '../add-expense-modal/add-expense-modal.component';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css']
})
export class ExpenseListComponent {
  @Input({ required: true })
  direction!: Direction;

  @Input({ required: true })
  heading!: string;

  expenses: IExpense[] = [];

  constructor(
    public dialog: MatDialog,
    private readonly reimbursementService: ReimbursementService
  ) {}

  ngOnInit() {
    this.expenses = this.reimbursementService.getExpenses(this.direction);
  }

  openAddExpenseDialog() {
    const dialogRef = this.dialog.open(AddExpenseModalComponent, {
      id: 'add-expense-modal',
      width: 'min(95vw, 700px)'
    });

    const lastExpense = this.getLastExpense();
    const startLocation = lastExpense?.endLocation;
    const carType = this.reimbursementService.getCarTypeCompletion();

    dialogRef.componentInstance.expense = {
      startLocation,
      ...(carType ? { carType } : {})
    } as IExpense;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addExpense(result);
      }
    });
  }

  getLastExpense() {
    const lastToExpense = this.reimbursementService.getDestinationCompletion();
    return this.expenses[this.expenses.length - 1] || lastToExpense;
  }

  storeExpenses() {
    this.reimbursementService.setExpenses(this.expenses, this.direction);
    this.reimbursementService.saveExpenses();
  }

  addExpense(expense: IExpense) {
    this.expenses.push(expense);
    this.storeExpenses();
  }

  editRow(expenseId: number) {
    const expense = this.expenses.find(expense => expense.id === expenseId);
    if (!expense) {
      return;
    }
    const dialogRef = this.dialog.open(AddExpenseModalComponent, {
      id: 'add-expense-modal',
      width: '80%'
    });
    dialogRef.componentInstance.expense = expense;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteRow(expenseId);
        this.addExpense(result);
      }
    });
  }

  deleteRow(expenseId: number) {
    this.expenses = this.expenses.filter(expense => expense.id !== expenseId);
    this.storeExpenses();
  }

  addReturnTrip() {
    this.expenses = this.reimbursementService.getReturnTripCompletion();
    this.storeExpenses();
  }
}
