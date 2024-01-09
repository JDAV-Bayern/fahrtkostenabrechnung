import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IExpense } from 'src/domain/expense';

@Component({
  selector: 'app-expense-list-row',
  templateUrl: './expense-list-row.component.html',
  styleUrls: ['./expense-list-row.component.css']
})
export class ExpenseListRowComponent {
  @Output()
  deleteRow = new EventEmitter<number>();

  @Output()
  editRow = new EventEmitter<number>();

  @Input({ required: true })
  expense!: IExpense;

  editMe() {
    console.log(`emmited edit event for ${this.expense.id}`)
    this.editRow.emit(this.expense.id);
  }

  deleteMe() {
    console.log(`emmited delete event for ${this.expense.id}`)
    this.deleteRow.emit(this.expense.id)
  }

  getTitle() {
    let title: string;
    switch (this.expense.type) {
      case 'car':
        title = 'Autofahrt';
        break;
      case 'train':
        title = 'Zugfahrt';
        break;
      case 'plan':
        title = 'Fahrt mit ÖPNV-Abo';
        break;
      case 'bike':
        title = 'Fahrradfahrt';
        break;
      default:
        title = '';
    }
    return title;
  }


}
