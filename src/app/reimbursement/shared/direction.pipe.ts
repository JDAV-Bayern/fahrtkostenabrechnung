import { Direction } from '@/domain/expense.model';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'direction',
})
export class DirectionPipe implements PipeTransform {
  transform(value: Direction): string {
    switch (value) {
      case 'inbound':
        return 'Hinfahrt';
      case 'onsite':
        return 'Vor Ort';
      case 'outbound':
        return 'Rückfahrt';
    }
  }
}
