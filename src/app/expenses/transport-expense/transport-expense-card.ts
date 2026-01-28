import { CurrencyPipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { Badge } from 'src/app/shared/ui/badge';
import { Button } from 'src/app/shared/ui/button';
import { Card, CardContent } from 'src/app/shared/ui/card';
import { TransportExpense, TransportMode } from 'src/domain/expense.model';
import { ExpenseAmountPipe } from '../shared/expense-amount.pipe';
import { ExpenseDetailsComponent } from '../shared/expense-details/expense-details.component';
import { ExpenseTitlePipe } from '../shared/expense-title.pipe';

interface ExpenseMeta {
  icon: string;
  color: string;
}

const expenseMeta: Record<TransportMode, ExpenseMeta> = {
  car: {
    icon: 'directions_car',
    color: 'bg-transport-car',
  },
  public: {
    icon: 'train',
    color: 'bg-transport-public',
  },
  bike: {
    icon: 'pedal_bike',
    color: 'bg-transport-bike',
  },
  plan: {
    icon: 'transit_ticket',
    color: 'bg-transport-plan',
  },
};

@Component({
  selector: 'jdav-transport-expense-card',
  templateUrl: './transport-expense-card.html',
  imports: [
    Badge,
    Button,
    CardContent,
    CurrencyPipe,
    ExpenseTitlePipe,
    ExpenseAmountPipe,
    ExpenseDetailsComponent,
  ],
  host: {
    class: 'cursor-grab',
  },
  hostDirectives: [Card],
})
export class TransportExpenseCard {
  readonly expense = input.required<TransportExpense>();
  readonly editRow = output<void>();
  readonly deleteRow = output<void>();

  readonly icon = computed(() => expenseMeta[this.expense().mode].icon);
  readonly color = computed(() => expenseMeta[this.expense().mode].color);
}
