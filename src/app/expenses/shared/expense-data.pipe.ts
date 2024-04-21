import { Pipe, PipeTransform } from '@angular/core';
import { Absence, Meal } from 'src/domain/expense.model';

export function formatAbsence(value: string): string | null {
  switch (value) {
    case 'fullDay':
      return 'ganze 24 Stunden';
    case 'travelDay':
      return 'am An- oder Abreisetag';
    case 'workDay':
      return 'mehr als acht Stunden';
    default:
      return null;
  }
}

export function formatMeal(value: string): string | null {
  switch (value) {
    case 'breakfast':
      return 'Frühstück';
    case 'lunch':
      return 'Mittag';
    case 'dinner':
      return 'Abend';
    default:
      return null;
  }
}

@Pipe({
  name: 'discountCard',
  standalone: true
})
export class DiscountCardPipe implements PipeTransform {
  transform(value: string): string | null {
    switch (value) {
      case 'none':
        return 'Keine BahnCard';
      case 'BC25':
        return 'BahnCard 25';
      case 'BC50':
        return 'BahnCard 50';
      default:
        return null;
    }
  }
}

@Pipe({
  name: 'carType',
  standalone: true
})
export class CarTypePipe implements PipeTransform {
  transform(value: string): string | null {
    switch (value) {
      case 'combustion':
        return 'Verbrenner';
      case 'electric':
        return 'Elektro';
      case 'plug-in-hybrid':
        return 'Plug-In Hybrid';
      default:
        return null;
    }
  }
}

@Pipe({
  name: 'absence',
  standalone: true
})
export class AbsencePipe implements PipeTransform {
  transform(value: string): string | null {
    return formatAbsence(value);
  }
}

@Pipe({
  name: 'meals',
  standalone: true
})
export class MealsPipe implements PipeTransform {
  transform(value: string): string | null;
  transform(value: string[]): (string | null)[];

  transform(value: string | string[]) {
    if (typeof value === 'string') {
      return formatMeal(value);
    } else {
      return value.map(meal => formatMeal(meal));
    }
  }
}
