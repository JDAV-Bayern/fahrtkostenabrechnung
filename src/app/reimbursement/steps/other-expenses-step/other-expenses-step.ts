import { CurrencyPipe } from '@angular/common';
import {
  booleanAttribute,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ExpenseListComponent } from 'src/app/expenses/expense-list/expense-list.component';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';

@Component({
  selector: 'jdav-other-expenses-step',
  templateUrl: './other-expenses-step.html',
  imports: [ReactiveFormsModule, CurrencyPipe, ExpenseListComponent],
})
export class OtherExpensesStep {
  private readonly controlService = inject(ReimbursementControlService);

  readonly showExplanation = input(false, { transform: booleanAttribute });

  form = this.controlService.otherExpensesStep;
  private formValue = toSignal(this.form.valueChanges, { initialValue: [] });
  total = computed(() =>
    this.formValue().reduce((sum, expense) => sum + expense.amount, 0),
  );
}
