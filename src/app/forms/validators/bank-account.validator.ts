import { AbstractControl, ValidationErrors } from '@angular/forms';

export function validateBankAccount(
  control: AbstractControl
): ValidationErrors | null {
  const ibanControl = control.get('iban');
  const bic = control.get('bic')?.value;

  if (ibanControl?.valid && !ibanControl.value.startsWith('DE') && !bic) {
    return { bicRequired: true };
  }

  return null;
}
