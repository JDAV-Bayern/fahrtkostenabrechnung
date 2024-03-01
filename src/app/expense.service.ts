import { Injectable } from '@angular/core';
import {
  BikeExpense,
  CarExpense,
  Expense,
  TrainExpense
} from 'src/domain/expense';
import { Reimbursement } from 'src/domain/reimbursement';

const discountFactors = {
  BC50: 1.1,
  BC25: 1.05,
  none: 1
};

const discountLabels = {
  BC50: 'BahnCard 50',
  BC25: 'BahnCard 25',
  none: 'keine BahnCard'
};

const carTypeLabels = {
  combustion: 'Verbrenner',
  electric: 'Elektro',
  'plug-in-hybrid': 'Plug-In Hybrid'
};

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
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
        const factor = discountFactors[trainExpense.discountCard];
        return trainExpense.price * factor;
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
        const carType = carTypeLabels[carExpense.carType];
        const nPax = carExpense.passengers.length;
        const pax = carExpense.passengers.join(', ');
        return (
          `${carExpense.distance} km, ${carType}` +
          (nPax > 0 ? `, ${nPax} Mitfahrer*innen: ${pax}` : '')
        );
      case 'train':
        const trainExpense = expense as TrainExpense;
        const discount = discountLabels[trainExpense.discountCard];
        return trainExpense.discountCard !== 'none'
          ? `${trainExpense.price} € mit ${discount}`
          : discount;
      case 'bike':
        const bikeExpense = expense as BikeExpense;
        return `${bikeExpense.distance} km`;
      case 'plan':
        return 'pauschal 12,25 €';
    }
  }
}
