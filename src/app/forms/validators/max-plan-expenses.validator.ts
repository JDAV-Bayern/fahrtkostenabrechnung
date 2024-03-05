import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Expense } from 'src/domain/expense';

export function maxPlanExpenses(
  control: AbstractControl
): ValidationErrors | null {
  const v = control.value;
  if (!Array.isArray(v)) {
    return null;
  }
  const check = v.filter(expense => expense.type === 'plan').length <= 1;
  return check ? null : { maxPlanExpenses: true };
}
