import { AbstractControl, ValidationErrors } from '@angular/forms';

const SEPA_CODES =
  /^(BE|BG|DK|DE|EE|FI|FR|GR|GB|IE|IS|IT|HR|LV|LI|LT|LU|MT|MC|NL|NO|AT|PL|PT|RO|SM|SE|CH|SK|SI|ES|CZ|HU|CY)/;
const BIC_REQUIRED = /^(MC|SM|CH)/;

export function validateBankAccount(
  control: AbstractControl
): ValidationErrors | null {
  const ibanControl = control.get('iban');
  const bic = control.get('bic')?.value;

  if (ibanControl?.valid && isBICRequired(ibanControl.value) && !bic) {
    return { bicRequired: true };
  }

  return null;
}

export function isBICRequired(iban: string): boolean {
  return Boolean(iban.match(BIC_REQUIRED) || !iban.match(SEPA_CODES));
}
