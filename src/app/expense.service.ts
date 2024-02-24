import { Injectable } from '@angular/core';
import {
  BikeExpense,
  CarExpense,
  Expense,
  TrainExpense
} from 'src/domain/expense';
import { Reimbursement } from 'src/domain/reimbursement';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private readonly discounts = {
    BC50: {
      factor: 1.1,
      name: 'BahnCard 50'
    },
    BC25: {
      factor: 1.05,
      name: 'BahnCard 25'
    },
    none: {
      factor: 1,
      name: 'keine BahnCard'
    }
  };

  constructor() {}

  getAllExpenses(reimbursement: Reimbursement) {
    const expenses = reimbursement.expenses;
    return [...expenses.outbound, ...expenses.onsite, ...expenses.inbound];
  }

  getTotal(reimbursement: Reimbursement) {
    const reducer = (sum: number, expense: Expense) =>
      sum + this.getAmount(expense);
    return this.getAllExpenses(reimbursement).reduce(reducer, 0);
  }

  getAmount(expense: Expense) {
    switch (expense.type) {
      case 'car':
        const carExpense = expense as CarExpense;
        const nPassengers = carExpense.passengers.length + 1;
        return carExpense.distance * Math.min(nPassengers, 6) * 0.05;
      case 'train':
        const trainExpense = expense as TrainExpense;
        return (
          trainExpense.price * this.discounts[trainExpense.discountCard].factor
        );
      case 'bike':
        const bikeExpense = expense as BikeExpense;
        return bikeExpense.distance * 0.13;
      case 'plan':
        return 12.25;
    }
  }

  getName(expense: Expense) {
    switch (expense.type) {
      case 'car':
        return 'Autofahrt';
      case 'train':
        return 'Zugfahrt';
      case 'plan':
        return 'Fahrt mit ÖPNV-Abo';
      case 'bike':
        return 'Fahrradfahrt';
    }
  }

  getDescription(expense: Expense) {
    switch (expense.type) {
      case 'car':
        const carExpense = expense as CarExpense;
        const nPassengers = carExpense.passengers.length;
        const passengers = carExpense.passengers.join(', ');
        return `${carExpense.distance} km, ${nPassengers} Mitfahrer*innen: ${passengers}`;
      case 'train':
        const trainExpense = expense as TrainExpense;
        const discount = this.discounts[trainExpense.discountCard].name;
        return `Ticketpreis ${trainExpense.price} ${discount}`;
      case 'bike':
        const bikeExpense = expense as BikeExpense;
        return `${bikeExpense.distance} km`;
      case 'plan':
        return 'pauschal 12,25 €';
    }
  }
}
