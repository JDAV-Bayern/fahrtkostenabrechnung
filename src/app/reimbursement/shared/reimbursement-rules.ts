import { isAfter, isFuture } from 'date-fns';
import { validateIBAN } from 'ngx-iban-validator';
import { TransportMode } from 'src/domain/expense.model';

/*
 * Pure validation rules of the reimbursement form. They only look at values, so
 * they can be used by the form schema and tested without any forms.
 */

export const PLZ_PATTERN = /^[0-9]{4,5}$/;
export const BIC_PATTERN = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;

const SEPA_CODES =
  /^(BE|BG|DK|DE|EE|FI|FR|GR|GB|IE|IS|IT|HR|LV|LI|LT|LU|MT|MC|NL|NO|AT|PL|PT|RO|SM|SE|CH|SK|SI|ES|CZ|HU|CY)/;
const BIC_REQUIRED = /^(MC|SM|CH)/;

const COURSE_CODE_BY = /^B[0-9]{3,4}(FB|AM|GA)$/;
const COURSE_CODE_DE = /^J[0-9]{3}$/;

export type CourseCodeError = 'federalCourse' | 'unknownCourse';

/** Empty codes are fine here, requiring a code is a separate rule. */
export function courseCodeError(
  code: string | null | undefined,
): CourseCodeError | null {
  if (
    code === null ||
    code === undefined ||
    code.length === 0 ||
    code === 'LJV' ||
    code === 'VERANSTALTUNG' ||
    COURSE_CODE_BY.test(code)
  ) {
    return null;
  }

  return COURSE_CODE_DE.test(code) ? 'federalCourse' : 'unknownCourse';
}

/** Whether the end of the range lies before its start. */
export function isUnorderedDateRange(start: unknown, end: unknown): boolean {
  return start instanceof Date && end instanceof Date && isAfter(start, end);
}

/** Whether the range ends or starts in the future. */
export function isFutureDateRange(start: unknown, end: unknown): boolean {
  return (
    (start instanceof Date && isFuture(start)) ||
    (end instanceof Date && isFuture(end))
  );
}

/** The first expense mode that is not in the list of allowed modes. */
export function firstDisallowedMode(
  expenses: readonly { mode: TransportMode }[],
  allowed: readonly TransportMode[],
): TransportMode | undefined {
  return expenses.find((expense) => !allowed.includes(expense.mode))?.mode;
}

/** Whether there are more than `max` expenses with the given mode. */
export function exceedsModeLimit(
  expenses: readonly { mode: TransportMode }[],
  limited: TransportMode,
  max: number,
): boolean {
  return expenses.filter((expense) => expense.mode === limited).length > max;
}

/** Empty IBANs are fine here, requiring an IBAN is a separate rule. */
export function isInvalidIban(iban: string): boolean {
  // Pass an object: for a plain string validateIBAN returns a (truthy) result
  // object even for valid IBANs, with an object it returns null in that case.
  return validateIBAN({ value: iban }) !== null;
}

/** The BIC is only needed for valid IBANs outside the SEPA area (and a few special cases). */
export function isBicRequired(iban: string): boolean {
  return (
    iban.trim().length > 0 &&
    !isInvalidIban(iban) &&
    (BIC_REQUIRED.test(iban) || !SEPA_CODES.test(iban))
  );
}
