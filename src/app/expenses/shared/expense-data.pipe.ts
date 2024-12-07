import { Pipe, PipeTransform } from '@angular/core';
import { FoodExpense } from 'src/domain/expense.model';

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

@Pipe({
  name: 'discount',
  standalone: true
})
export class DiscountPipe implements PipeTransform {
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
  name: 'engineType',
  standalone: true
})
export class EngineTypePipe implements PipeTransform {
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
  transform(value: FoodExpense): (string | null)[] {
    return [
      ...(value.breakfast ? ['Frühstück'] : []),
      ...(value.lunch ? ['Mittag'] : []),
      ...(value.dinner ? ['Abend'] : [])
    ];
  }
}
