import { Pipe, PipeTransform } from '@angular/core';
import { TransportMode } from 'src/domain/expense.model';

export function formatTransportMode(value: TransportMode) {
  switch (value) {
    case 'car':
      return 'Autofahrt';
    case 'public':
      return 'Fahrt mit ÖPNV';
    case 'plan':
      return 'Fahrt mit ÖPNV-Abo';
    case 'bike':
      return 'Fahrradfahrt';
  }
}

@Pipe({
  name: 'transportMode'
})
export class TransportModePipe implements PipeTransform {
  transform(value: TransportMode): string {
    return formatTransportMode(value);
  }
}
