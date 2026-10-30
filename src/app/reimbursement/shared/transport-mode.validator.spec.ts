import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { TransportMode } from 'src/domain/expense.model';
import {
  allowedTransportModes,
  limitedTransportMode,
} from './transport-mode.validator';

const expenses = (...modes: TransportMode[]) =>
  new FormArray(
    modes.map((mode) => new FormGroup({ mode: new FormControl(mode) })),
  );

describe('allowedTransportModes', () => {
  const validator = allowedTransportModes(['car', 'public']);

  it('should accept an empty list', () => {
    expect(validator(expenses())).toBeNull();
  });

  it('should accept only allowed modes', () => {
    expect(validator(expenses('car', 'public', 'car'))).toBeNull();
  });

  it('should return the first mode that is not allowed', () => {
    expect(validator(expenses('car', 'bike', 'plan'))).toEqual({
      transportModesAllowed: { mode: 'bike' },
    });
  });

  it('should ignore children without a mode control', () => {
    const array = new FormArray([new FormGroup({})]);
    expect(validator(array)).toBeNull();
  });

  it('should ignore controls that are not a form array', () => {
    expect(validator(new FormControl('bike'))).toBeNull();
    expect(validator(new FormGroup({}))).toBeNull();
  });
});

describe('limitedTransportMode', () => {
  const validator = limitedTransportMode('plan', 1);

  it('should accept an empty list', () => {
    expect(validator(expenses())).toBeNull();
  });

  it('should accept as many limited expenses as allowed', () => {
    expect(validator(expenses('plan'))).toBeNull();
    expect(validator(expenses('car', 'plan', 'public'))).toBeNull();
  });

  it('should not limit other modes', () => {
    expect(validator(expenses('car', 'car', 'car'))).toBeNull();
  });

  it('should return an error when the limit is exceeded', () => {
    expect(validator(expenses('plan', 'car', 'plan'))).toEqual({
      transportModeLimited: { mode: 'plan' },
    });
  });

  it('should ignore children without a mode control', () => {
    const array = new FormArray([new FormGroup({}), new FormGroup({})]);
    expect(validator(array)).toBeNull();
  });

  it('should ignore controls that are not a form array', () => {
    expect(validator(new FormControl('plan'))).toBeNull();
  });
});
