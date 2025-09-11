import { Pipe, PipeTransform } from '@angular/core';
import { Direction } from 'src/domain/expense.model';

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
