import { ValidatorFn } from '@angular/forms';
import { isAfter, isFuture } from 'date-fns';

export const pastDateRange: ValidatorFn = control => {
  const start = control.get('start')?.value;
  const end = control.get('end')?.value;

  const startIsFuture = start instanceof Date && isFuture(start);
  const endIsFuture = end instanceof Date && isFuture(end);

  return startIsFuture || endIsFuture ? { dateRangePast: true } : null;
};

export const orderedDateRange: ValidatorFn = control => {
  const start = control.get('start')?.value;
  const end = control.get('end')?.value;

  const isUnordered =
    start instanceof Date && end instanceof Date && isAfter(start, end);

  return isUnordered ? { dateRangeOrder: true } : null;
};
