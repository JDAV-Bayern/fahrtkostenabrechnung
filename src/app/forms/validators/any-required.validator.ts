import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

function isEmptyInputValue(value: any): boolean {
  return (
    value === null ||
    ((typeof value === 'string' || Array.isArray(value)) && value.length === 0)
  );
}

export function anyRequired(control: AbstractControl): ValidationErrors | null {
  let check;

  if (control instanceof FormGroup) {
    check = Object.values(control.value).some(v => !isEmptyInputValue(v));
  } else {
    check = !isEmptyInputValue(control.value);
  }

  return check ? null : { anyRequired: true };
}
