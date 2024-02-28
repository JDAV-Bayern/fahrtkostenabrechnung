import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function expensesRequired(
  control: AbstractControl
): ValidationErrors | null {
  const v = control.value;
  const check = v.inbound?.length || v.onsite?.length || v.outbound?.length;
  return check ? null : { expensesRequired: true };
}
