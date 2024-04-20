import { Pipe, PipeTransform } from '@angular/core';
import {
  Absence,
  CarType,
  DiscountCard,
  Expense,
  Meal,
  TransportMode
} from 'src/domain/expense';
import { ExpenseService } from '../expense.service';

export function formatTransportMode(value: TransportMode) {
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

export function formatAbsence(value: Absence) {
  switch (value) {
    case 'fullDay':
      return 'ganze 24 Stunden';
    case 'travelDay':
      return 'am An- oder Abreisetag';
    case 'workDay':
      return 'mehr als acht Stunden';
  }
}

@Pipe({
  name: 'expenseTitle',
  standalone: true
})
export class ExpenseTypePipe implements PipeTransform {
  transform(value: Expense): string {
    switch (value.type) {
      case 'transport':
        return formatTransportMode(value.mode);
      case 'food':
        return 'Abwesenheit ' + formatAbsence(value.absence);
      case 'material':
        return value.purpose;
    }
  }
}

@Pipe({
  name: 'transportMode',
  standalone: true
})
export class TransportModePipe implements PipeTransform {
  transform(value: TransportMode): string {
    return formatTransportMode(value);
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
  name: 'absence',
  standalone: true
})
export class AbsencePipe implements PipeTransform {
  transform(value: Absence): string {
    return formatAbsence(value);
  }
}

@Pipe({
  name: 'meals',
  standalone: true
})
export class MealsPipe implements PipeTransform {
  transform(value: Meal[]): string[] {
    return value.map(meal => {
      switch (meal) {
        case 'breakfast':
          return 'Frühstück';
        case 'lunch':
          return 'Mittag';
        case 'dinner':
          return 'Abend';
      }
    });
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
