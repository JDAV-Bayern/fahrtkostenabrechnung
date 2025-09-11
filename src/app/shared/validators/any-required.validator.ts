import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';

function isEmptyInput(control: AbstractControl): boolean {
  if (control instanceof FormGroup) {
    return Object.values(control.controls).every(isEmptyInput);
  }

  const value = control.value;
  if (value === null || control.disabled) {
    return true;
  }
  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0;
  }
  return false;
}

export const anyRequired: ValidatorFn = (control) => {
  return isEmptyInput(control) ? { anyRequired: true } : null;
};
