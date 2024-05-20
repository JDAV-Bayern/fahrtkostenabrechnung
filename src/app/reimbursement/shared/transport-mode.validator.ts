import { FormArray, ValidatorFn } from '@angular/forms';
import { TransportMode } from 'src/domain/expense.model';

export function allowedTransportModes(allowed: TransportMode[]): ValidatorFn {
  return control => {
    if (control instanceof FormArray) {
      const unallowed = control.controls.find(control => {
        const mode = control.get('mode');
        return mode && !allowed.includes(mode.value);
      });
      return unallowed
        ? { transportModesAllowed: { mode: unallowed.value.mode } }
        : null;
    }
    return null;
  };
}

export function limitedTransportMode(
  limited: TransportMode,
  max: number
): ValidatorFn {
  return control => {
    if (control instanceof FormArray) {
      const planExpenses = control.controls.filter(control => {
        const mode = control.get('mode');
        return mode && mode.value === limited;
      });
      return planExpenses.length > max
        ? { transportModeLimited: { mode: limited } }
        : null;
    }
    return null;
  };
}
