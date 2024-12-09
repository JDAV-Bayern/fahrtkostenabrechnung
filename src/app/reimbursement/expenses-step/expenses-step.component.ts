import { CdkDrag, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';
import { CurrencyPipe } from '@angular/common';
import { FormCardComponent } from 'src/app/shared/form-card/form-card.component';
import { DialogModule } from '@angular/cdk/dialog';
import {
  Direction,
  TransportExpense,
  TransportMode
} from 'src/domain/expense.model';
import { ReimbursementService } from '../shared/reimbursement.service';
import { ExpenseListComponent } from 'src/app/expenses/expense-list/expense-list.component';
import { RouterLink } from '@angular/router';
import { ExpenseExtraData } from 'src/app/expenses/expense-modal/expense-modal.component';

@Component({
  selector: 'app-expenses-step',
  templateUrl: './expenses-step.component.html',
  styleUrls: ['./expenses-step.component.css'],
  imports: [
    RouterLink,
    ReactiveFormsModule,
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
      case 'assembly':
        return { veranstaltung: 'ljv' };
      case 'committee':
        return { veranstaltung: 'gremium' };
    }
  }

  get nextStep() {
    return this.meetingType === 'committee'
      ? 'auslagen-gremium'
      : 'zusammenfassung';
  }

  get total() {
    const reimbursement = this.reimbursementControlService.getReimbursement();
    const report = this.reimbursementService.getReport(reimbursement);
    return report.categories.transport;
  }

  getAllowedModes(direction: Direction) {
    const allowedModes: TransportMode[] = ['car', 'public'];

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

  getDialogData(direction: Direction): ExpenseExtraData<TransportExpense> {
    const allowedModes = this.getAllowedModes(direction);
    const completion =
      this.reimbursementControlService.completeTransportExpense(direction);
    return { allowedModes, completion };
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
