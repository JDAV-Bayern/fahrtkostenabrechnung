import { Pipe, PipeTransform } from '@angular/core';
import {
  CarType,
  DiscountCard,
  Expense,
  ExpenseType
} from 'src/domain/expense';
import { ExpenseService } from '../expense.service';

@Pipe({
  name: 'expenseType',
  standalone: true
})
export class ExpenseTypePipe implements PipeTransform {
  transform(value: ExpenseType): string {
    switch (value) {
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
}

@Pipe({
  name: 'discountCard',
  standalone: true
})
export class DiscountCardPipe implements PipeTransform {
  transform(value: DiscountCard): string {
    switch (value) {
      case 'none':
        return 'Keine BahnCard';
      case 'BC25':
        return 'BahnCard 25';
      case 'BC50':
        return 'BahnCard 50';
    }
  }
}

@Pipe({
  name: 'carType',
  standalone: true
})
export class CarTypePipe implements PipeTransform {
  transform(value: CarType): string {
    switch (value) {
      case 'combustion':
        return 'Verbrenner';
      case 'electric':
        return 'Elektro';
      case 'plug-in-hybrid':
        return 'Plug-In Hybrid';
    }
  }
}

@Pipe({
  name: 'expenseAmount',
  standalone: true
})
export class ExpenseAmountPipe implements PipeTransform {
  constructor(public expenseService: ExpenseService) {}

  transform(value: Expense): number {
    return this.expenseService.getAmount(value);
  }
}
