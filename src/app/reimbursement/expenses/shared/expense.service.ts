import { Injectable, inject, signal } from '@angular/core';
import { Expense } from 'src/domain/expense.model';
import { MeetingType } from 'src/domain/meeting.model';
import { ExpenseConfig } from '../expense.config';
import { ExpenseConfigService } from './expense-config.service';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private readonly expenseConfigService = inject(ExpenseConfigService);

  config = signal<ExpenseConfig | undefined>(undefined);

  constructor() {
    this.setMeetingType('course');
  }

  setMeetingType(type: MeetingType) {
    this.expenseConfigService.getConfig(type).subscribe((config) => {
      this.config.set(config);
    });
  }

  getAmount(expense: Expense) {
    const config = this.config();

    if (!config) {
      return 0;
    }

    if (!config.allowed.includes(expense.type)) {
      return 0;
    }

    switch (expense.type) {
      case 'transport': {
        if (!config.transport) {
          return 0;
        }

        switch (expense.mode) {
          case 'car': {
            const nPax = expense.carTrip.passengers.length;
            const maxPax = config.transport.car.length - 1;
            const index = nPax < maxPax ? nPax : maxPax;
            const distanceFactor = config.transport.car[index];
            return expense.distance * distanceFactor;
          }
          case 'public': {
            const discountFactor =
              config.transport.public[expense.ticket.discount];
            return expense.ticket.price * discountFactor;
          }
          case 'bike': {
            const bikeFactor = config.transport.bike;
            return expense.distance * bikeFactor;
          }
          case 'plan': {
            return config.transport.plan;
          }
          default: {
            return 0;
          }
        }
      }
      case 'food': {
        if (!config.food) {
          return 0;
        }

        let amount = config.food[expense.absence];
        const full = config.food.intermediate;

        amount -= expense.breakfast ? full * 0.2 : 0;
        amount -= expense.lunch ? full * 0.4 : 0;
        amount -= expense.dinner ? full * 0.4 : 0;

        return amount > 0 ? amount : 0;
      }
      case 'material': {
        return expense.amount;
      }
    }
  }
}
