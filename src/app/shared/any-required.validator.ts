import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

function isEmptyInput(control: AbstractControl): boolean {
  if (control instanceof FormGroup) {
    return Object.values(control.controls).every(isEmptyInput);
  }

  const value = control.value;
  if (value === null) {
    return true;
  }
  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0;
  }
  return false;
}

export function anyRequired(control: AbstractControl): ValidationErrors | null {
  return !isEmptyInput(control) ? null : { anyRequired: true };
}
