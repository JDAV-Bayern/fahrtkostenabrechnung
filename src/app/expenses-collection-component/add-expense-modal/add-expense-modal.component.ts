import { Component, Input } from '@angular/core';
import {
  CarExpense,
  ExpenseType,
  IExpense,
  IPublicTransportPlanExpense,
  TrainExpense
} from '../../../domain/expense';

@Component({
  selector: 'app-add-expense-modal',
  templateUrl: './add-expense-modal.component.html',
  styleUrls: ['./add-expense-modal.component.css']
})
export class AddExpenseModalComponent {
  @Input({ required: true })
  direction!: 'from' | 'to' | 'at';

  @Input({ required: true })
  expense!: IExpense;

  constructor() {}
  chooseCarExpense() {
    this.expense.type = 'car';
  }
  chooseTrainExpense() {
    this.expense.type = 'train';
  }
  choosePlanExpense() {
    this.expense.type = 'plan';
  }
  chooseBikeExpense() {
    this.expense.type = 'bike';
  }
}
