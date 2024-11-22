import { CdkDrag, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { FormCardComponent } from 'src/app/shared/form-card/form-card.component';
import { DialogModule } from '@angular/cdk/dialog';
import { Direction, TransportMode } from 'src/domain/expense.model';
import {
  ReimbursementReport,
  ReimbursementService
} from '../shared/reimbursement.service';
import { ExpenseListComponent } from 'src/app/expenses/expense-list/expense-list.component';
import { RouterLink } from '@angular/router';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-expenses-step',
  templateUrl: './expenses-step.component.html',
  styleUrls: ['./expenses-step.component.css'],
  imports: [
    RouterLink,
    ReactiveFormsModule,
    AsyncPipe,
    CurrencyPipe,
    CdkDropListGroup,
    DialogModule,
    FormCardComponent,
    ExpenseListComponent
  ]
})
export class ExpensesStepComponent {
  private readonly reimbursementService = inject(ReimbursementService);
  private readonly reimbursementControlService = inject(
    ReimbursementControlService
  );

  form = this.reimbursementControlService.transportExpensesStep;
  report$ = this.reimbursementControlService.reimbursement$.pipe(
    switchMap(reimbursement =>
      this.reimbursementService.getReport(reimbursement)
    )
  );

  get meetingType() {
    return this.reimbursementControlService.meetingStep.controls.type.value;
  }

  get inbound() {
    return this.form.controls.inbound;
  }

  get onsite() {
    return this.form.controls.onsite;
  }

  get outbound() {
    return this.form.controls.outbound;
  }

  get queryParams() {
    switch (this.meetingType) {
      case 'course':
        return { veranstaltung: 'kurs' };
      case 'committee':
        return { veranstaltung: 'gremium' };
    }
  }

  get nextStep() {
    return this.meetingType === 'committee'
      ? 'auslagen-gremium'
      : 'zusammenfassung';
  }

  getAllowedModes(direction: Direction) {
    let allowedModes: TransportMode[] = ['car', 'public'];

    if (direction !== 'onsite') {
      allowedModes.push('bike');

      const expenses =
        this.reimbursementControlService.getTransportExpenses(direction);
      const planExists = expenses.value.some(
        expense => expense.mode === 'plan'
      );

      if (!planExists) {
        allowedModes.push('plan');
      }
    }

    return allowedModes;
  }

  getOpenDialogFn(direction: Direction) {
    return () => {
      const allowedModes = this.getAllowedModes(direction);
      const completion =
        this.reimbursementControlService.completeTransportExpense(direction);

      return {
        transport: {
          allowedModes,
          completion
        }
      };
    };
  }

  getPredicateFn(direction: Direction) {
    return (item: CdkDrag<FormGroup>) => {
      const modes = this.getAllowedModes(direction);
      return modes.includes(item.data.value.mode);
    };
  }

  completeReturnTrip() {
    this.reimbursementControlService.completeReturnTrip();
  }
}
