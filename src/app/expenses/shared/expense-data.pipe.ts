import { Pipe, PipeTransform } from '@angular/core';
import { FoodExpense } from 'src/domain/expense.model';

export function formatAbsence(value: string | null | undefined): string | null {
  switch (value) {
    case 'arrival':
      return 'Anreisetag';
    case 'return':
      return 'Rückreisetag';
    case 'intermediate':
      return 'Zwischentag';
    case 'single':
      return 'Abwesenheit von mehr als 8 Stunden';
    default:
      return null;
  }
}

@Pipe({
  name: 'discount'
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
  name: 'engineType'
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
  name: 'absence'
})
export class AbsencePipe implements PipeTransform {
  transform(value: string | null | undefined): string | null {
    return formatAbsence(value);
  }
}

@Pipe({
  name: 'meals'
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
