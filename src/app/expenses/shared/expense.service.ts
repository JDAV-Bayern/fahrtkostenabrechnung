import { Injectable } from '@angular/core';
import { Expense } from 'src/domain/expense.model';
import { expenseConfig } from '../expense.config';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  config = expenseConfig.course;

  getAmount(expense: Expense) {
    if (!this.config.allowed.includes(expense.type)) {
      return 0;
    }

    switch (expense.type) {
      case 'transport': {
        if (!this.config.transport) {
          return 0;
        }

        switch (expense.mode) {
          case 'car': {
            const nPax = expense.carTrip.passengers.length;
            const maxPax = this.config.transport.car.length - 1;
            const index = nPax < maxPax ? nPax : maxPax;
            const distanceFactor = this.config.transport.car[index];
            return expense.distance * distanceFactor;
          }
          case 'public': {
            const discountFactor =
              this.config.transport.public[expense.ticket.discount];
            return expense.ticket.price * discountFactor;
          }
          case 'bike': {
            const bikeFactor = this.config.transport.bike;
            return expense.distance * bikeFactor;
          }
          case 'plan': {
            return this.config.transport.plan;
          }
          default: {
            return 0;
          }
        }
      }
      case 'food': {
        if (!this.config.food) {
          return 0;
        }

        let amount = this.config.food[expense.absence];
        const full = this.config.food.intermediate;

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
