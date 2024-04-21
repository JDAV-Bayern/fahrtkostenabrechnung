import { Injectable } from '@angular/core';
import { Expense } from 'src/domain/expense.model';
import { ExpenseConfig, expenseConfig } from '../expense.config';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  config: ExpenseConfig = expenseConfig.course;

  getAmount(expense: Expense) {
    switch (expense.type) {
      case 'transport':
        if (!this.config.transport) {
          return 0;
        }

        switch (expense.mode) {
          case 'car':
            const nPax = expense.passengers.length;
            const maxPax = this.config.transport.car.length - 1;
            const index = nPax < maxPax ? nPax : maxPax;
            const carFactor = this.config.transport.car[index];
            return expense.distance * carFactor;
          case 'train':
            const trainFactor =
              this.config.transport.train[expense.discountCard];
            return expense.price * trainFactor;
          case 'bike':
            const bikeFactor = this.config.transport.bike;
            return expense.distance * bikeFactor;
          case 'plan':
            return this.config.transport.plan;
        }
      case 'food':
        if (!this.config.food) {
          return 0;
        }

        let amount = this.config.food.allowance[expense.absence];
        for (let meal of expense.meals) {
          amount -= this.config.food.meals[meal];
        }

        return amount > 0 ? amount : 0;
      case 'material':
        return expense.amount;
    }
  }
}
