import { TransportMode } from '@/domain/expense.model';
import { Pipe, PipeTransform } from '@angular/core';

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
  name: 'transportMode',
})
export class TransportModePipe implements PipeTransform {
  transform(value: TransportMode): string {
    return formatTransportMode(value);
  }
}
