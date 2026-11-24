import { CdkDrag, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReimbursementFormService } from 'src/app/reimbursement/shared/reimbursement-form.service';
import { Button } from 'src/app/shared/ui/button';
import {
  Direction,
  TransportExpense,
  TransportMode,
} from 'src/domain/expense.model';
import { ExpenseListComponent } from '../../expenses/expense-list/expense-list.component';
import { ExpenseExtraData } from '../../expenses/expense-modal/expense-modal.component';

@Component({
  selector: 'app-expenses-step',
  templateUrl: './expenses-step.component.html',
  styleUrls: ['./expenses-step.component.css'],
  imports: [
    Button,
    RouterLink,
    CurrencyPipe,
    CdkDropListGroup,
    ExpenseListComponent,
  ],
})
export class ExpensesStepComponent {
  private readonly formService = inject(ReimbursementFormService);

  readonly form = this.formService.form.expenses.transport;

  readonly queryParams = computed(() => ({
    veranstaltung:
      this.formService.model().meeting.type === 'committee'
        ? 'gremium'
        : 'kurs',
  }));

  readonly dialogData = {
    inbound: computed(() => this.getDialogData('inbound')),
    onsite: computed(() => this.getDialogData('onsite')),
    outbound: computed(() => this.getDialogData('outbound')),
  };

  readonly enterPredicates = {
    inbound: this.getPredicateFn('inbound'),
    onsite: this.getPredicateFn('onsite'),
    outbound: this.getPredicateFn('outbound'),
  };

  readonly transportTotal = computed(
    () => this.formService.report().categories.transport ?? 0,
  );

  readonly materialTotal = computed(
    () => this.formService.report().categories.material ?? 0,
  );

  readonly foodEnabled = this.formService.foodEnabled;

  readonly foodTotal = computed(
    () => this.formService.report().categories.food ?? 0,
  );

  readonly total = computed(
    () =>
      this.transportTotal() +
      this.materialTotal() +
      (this.foodEnabled() ? this.foodTotal() : 0),
  );

  private getAllowedModes(direction: Direction) {
    const allowedModes: TransportMode[] = ['car', 'public'];

    if (direction !== 'onsite') {
      allowedModes.push('bike');

      const expenses = this.formService.model().expenses.transport[direction];
      const planExists = expenses.some((expense) => expense.mode === 'plan');

      if (!planExists) {
        allowedModes.push('plan');
      }
    }

    return allowedModes;
  }

  private getDialogData(
    direction: Direction,
  ): ExpenseExtraData<TransportExpense> {
    const allowedModes = this.getAllowedModes(direction);
    const completion = this.formService.completeTransportExpense(direction);
    return { allowedModes, completion };
  }

  private getPredicateFn(direction: Direction) {
    return (item: CdkDrag<TransportExpense>) =>
      this.getAllowedModes(direction).includes(item.data.mode);
  }

  completeReturnTrip() {
    this.formService.completeReturnTrip();
  }
}
