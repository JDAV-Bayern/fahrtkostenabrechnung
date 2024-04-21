import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'join',
  standalone: true
})
export class JoinPipe implements PipeTransform {
  transform(value: any[]): unknown {
    return value.join(', ');
  }
}
