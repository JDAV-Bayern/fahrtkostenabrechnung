import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'join',
})
export class JoinPipe implements PipeTransform {
  transform(value: null | undefined): null;
  transform(value: unknown[]): string;
  transform(value: unknown[] | null | undefined): string | null {
    if (!value) {
      return null;
    }
    return (value as unknown[]).join(', ');
  }
}
