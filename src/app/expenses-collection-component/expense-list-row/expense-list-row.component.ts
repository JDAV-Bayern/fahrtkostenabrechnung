import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  IBikeExpense,
  ICarExpense,
  IExpense,
  IPublicTransportPlanExpense,
  ITrainExpense
} from 'src/domain/expense';

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
    this.editRow.emit(this.expense.id);
  }

  deleteMe() {
    this.deleteRow.emit(this.expense.id);
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

  getDetails() {
    let details: string;
    switch (this.expense.type) {
      case 'car':
        const carExpense = this.expense as ICarExpense;
        details = `${carExpense.distance} km, ${carExpense.passengers.length} Mitfahrer*innen`;
        break;
      case 'train':
        const trainExpense = this.expense as ITrainExpense;
        details = `${trainExpense.discountCard === 'BC50' ? 'BahnCard 50' : trainExpense.discountCard === 'BC25' ? 'BahnCard 25' : 'keine BahnCard'}`;
        break;
      case 'plan':
        const planExpense = this.expense as IPublicTransportPlanExpense;
        details = `Abo-Preis: ${planExpense.price} €`;
        break;
      case 'bike':
        const bikeExpense = this.expense as IBikeExpense;
        details = `${bikeExpense.distance} km`;
        break;
      default:
        details = '';
    }
    return details;
  }
}
