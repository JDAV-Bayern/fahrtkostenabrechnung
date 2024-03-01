import { Injectable } from '@angular/core';
import { Expense } from 'src/domain/expense';
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
        const nPassengers = expense.passengers.length + 1;
        return expense.distance * Math.min(nPassengers, 6) * 0.05;
      case 'train':
        return expense.price * discountFactors[expense.discountCard];
      case 'bike':
        return expense.distance * 0.13;
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
        const nPax = expense.passengers.length;
        const pax = expense.passengers.join(', ');
        return (
          `${expense.distance} km, ${carTypeLabels[expense.carType]}` +
          (nPax > 0 ? `, ${nPax} Mitfahrer*innen: ${pax}` : '')
        );
      case 'train':
        const discount = discountLabels[expense.discountCard];
        return expense.discountCard !== 'none'
          ? `${expense.price} € mit ${discount}`
          : discount;
      case 'bike':
        return `${expense.distance} km`;
      case 'plan':
        return 'pauschal 12,25 €';
    }
  }
}
