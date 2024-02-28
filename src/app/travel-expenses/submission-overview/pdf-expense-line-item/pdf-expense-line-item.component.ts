import { Component, Input } from '@angular/core';
import {
  Direction,
  IBikeExpense,
  ICarExpense,
  IExpense,
  IPublicTransportPlanExpense,
  ITrainExpense
} from 'src/domain/expense';

@Component({
  selector: 'app-pdf-expense-line-item',
  templateUrl: './pdf-expense-line-item.component.html',
  styleUrls: ['./pdf-expense-line-item.component.css']
})
export class PdfExpenseLineItemComponent {
  @Input({ required: true })
  expense!: IExpense;

  @Input({ required: true })
  index!: number;

  getTitle() {
    const type = this.expense.type;
    switch (type) {
      case 'car':
        const carExpense = this.expense as ICarExpense;
        return `Autofahrt, ${carExpense.passengers.length} Mitfahrer*innen`;
      case 'train':
        const trainExpense = this.expense as ITrainExpense;
        return `Zugfahrt, ${trainExpense.discountCard === 'BC50' ? 'BahnCard 50' : trainExpense.discountCard === 'BC25' ? 'BahnCard 25' : 'keine BahnCard'}`;
      case 'plan':
        const planExpense = this.expense as IPublicTransportPlanExpense;
        return `Öffi Abo, pauschal 12,25 €`;
      case 'bike':
        const bikeExpense = this.expense as IBikeExpense;
        return `Fahrradfahrt`;
      default:
        return '';
    }
  }

  getDetails() {
    const type = this.expense.type;
    switch (type) {
      case 'car':
        const carExpense = this.expense as ICarExpense;
        return `${carExpense.distance}km, Mitfahrer*innen: ${carExpense.passengers.map(p => p.trim()).join(', ')}`;
      case 'train':
        const trainExpense = this.expense as ITrainExpense;
        return `Ticketpreis nach Rabatt ${trainExpense.priceWithDiscount}€`;
      case 'plan':
        return '';
      case 'bike':
        const bikeExpense = this.expense as IBikeExpense;
        return `${bikeExpense.distance} km`;
      default:
        return '';
    }
  }
}
