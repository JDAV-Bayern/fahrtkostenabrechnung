import { AbstractControl, ValidatorFn } from '@angular/forms';
import { Interval, isAfter, isFuture } from 'date-fns';

export type DateRangeFormValue = {
  startDate: Date | null;
  startTime: number;
  endDate: Date | null;
  endTime: number;
};

export function toInterval(control: AbstractControl): Interval | null {
  const startDate = control.get('startDate');
  const startTime = control.get('startTime');
  const endDate = control.get('endDate');
  const endTime = control.get('endTime');

  if (startDate && startTime && endDate && endTime) {
    if (startDate.value instanceof Date && endDate.value instanceof Date) {
      if (
        typeof startTime.value === 'number' &&
        typeof endTime.value === 'number'
      ) {
        return {
          start: new Date(startDate.value.getTime() + startTime.value),
          end: new Date(endDate.value.getTime() + endTime.value)
        };
      }
    }
  }

  return null;
}

export const pastDateRange: ValidatorFn = control => {
  const start = control.get('startDate');
  const end = control.get('endDate');

  const startIsFuture = start && start.value && isFuture(start.value);
  const endIsFuture = end && end.value && isFuture(end.value);

  return startIsFuture || endIsFuture ? { dateRangePast: true } : null;
};

export const orderedDateRange: ValidatorFn = control => {
  const i = toInterval(control);
  return i && isAfter(i.start, i.end) ? { dateRangeOrder: true } : null;
};
