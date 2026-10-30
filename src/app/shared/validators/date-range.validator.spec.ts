import { FormControl, FormGroup } from '@angular/forms';
import { addDays, subDays } from 'date-fns';
import { orderedDateRange, pastDateRange } from './date-range.validator';

const range = (start: unknown, end: unknown) =>
  new FormGroup({
    start: new FormControl(start),
    end: new FormControl(end),
  });

describe('pastDateRange', () => {
  const past = subDays(new Date(), 2);
  const future = addDays(new Date(), 2);

  it('should accept dates in the past', () => {
    expect(pastDateRange(range(subDays(past, 1), past))).toBeNull();
  });

  it('should reject a start date in the future', () => {
    expect(pastDateRange(range(future, null))).toEqual({
      dateRangePast: true,
    });
  });

  it('should reject an end date in the future', () => {
    expect(pastDateRange(range(past, future))).toEqual({
      dateRangePast: true,
    });
  });

  it('should accept empty values', () => {
    expect(pastDateRange(range(null, null))).toBeNull();
  });

  it('should ignore values that are not dates', () => {
    expect(pastDateRange(range('2999-01-01', undefined))).toBeNull();
  });

  it('should ignore controls without start and end', () => {
    expect(pastDateRange(new FormGroup({}))).toBeNull();
  });
});

describe('orderedDateRange', () => {
  const start = new Date(2025, 0, 1);
  const end = new Date(2025, 0, 3);

  it('should accept an end date after the start date', () => {
    expect(orderedDateRange(range(start, end))).toBeNull();
  });

  it('should accept identical dates', () => {
    expect(orderedDateRange(range(start, new Date(start)))).toBeNull();
  });

  it('should reject an end date before the start date', () => {
    expect(orderedDateRange(range(end, start))).toEqual({
      dateRangeOrder: true,
    });
  });

  it('should accept ranges with a missing date', () => {
    expect(orderedDateRange(range(start, null))).toBeNull();
    expect(orderedDateRange(range(null, end))).toBeNull();
    expect(orderedDateRange(range(null, null))).toBeNull();
  });

  it('should ignore controls without start and end', () => {
    expect(orderedDateRange(new FormGroup({}))).toBeNull();
  });
});
