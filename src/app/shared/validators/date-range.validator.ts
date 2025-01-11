import { ValidatorFn } from '@angular/forms';
import { interval, Interval, isAfter, isFuture, isValid } from 'date-fns';
import { MeetingForm } from 'src/app/reimbursement/shared/meeting-form';

export function toInterval(form: MeetingForm['time']): Interval | null {
  const start = form.controls.start.value;
  const end = form.controls.end.value;

  if (start && end && isValid(start) && isValid(end)) {
    return interval(start, end);
  }

  return null;
}

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
