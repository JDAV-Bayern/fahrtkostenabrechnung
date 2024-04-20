import { CdkDrag, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ExpenseService } from 'src/app/expense.service';
import { ReimbursementControlService } from 'src/app/reimbursement-control.service';
import { CurrencyPipe, NgIf } from '@angular/common';
import { ExpenseListComponent } from '../expense/expense-list/expense-list.component';
import { FormCardComponent } from 'src/app/form-card/form-card.component';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import {
  TransportExpenseDialogData,
  TransportExpenseModalComponent
} from '../expense/transport-expense-modal/transport-expense-modal.component';
import { Direction, TransportMode } from 'src/domain/expense';

@Component({
  selector: 'app-expenses-collection',
  templateUrl: './expenses-collection.component.html',
  styleUrls: ['./expenses-collection.component.css'],
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    CurrencyPipe,
    CdkDropListGroup,
    DialogModule,
    FormCardComponent,
    ExpenseListComponent
  ]
})
export class ExpensesCollectionComponent {
  form;

  constructor(
    private readonly controlService: ReimbursementControlService,
    private readonly expenseService: ExpenseService,
    private dialog: Dialog
  ) {
    this.form = this.controlService.transportExpensesStep;
  }

  get nextStep() {
    const meeting = this.controlService.meetingStep.controls.type.value;
    return meeting === 'committee' ? 'auslagen-gremium' : 'zusammenfassung';
  }

  get total() {
    const reimbursement = this.controlService.getReimbursement();
    return this.expenseService.getSummary(reimbursement).transport;
  }

  getAllowedModes(direction: Direction) {
    let allowedModes: TransportMode[] = ['car', 'train'];

    if (direction !== 'onsite') {
      allowedModes.push('bike');

      const expenses = this.controlService.getTransportExpenses(direction);
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
    return (form?: FormGroup) => {
      const modes = this.getAllowedModes(direction);
      const data: TransportExpenseDialogData = {
        form,
        direction,
        allowedModes: modes
      };
      return this.dialog.open<FormGroup>(TransportExpenseModalComponent, {
        data
      });
    };
  }

  getPredicateFn(direction: Direction) {
    return (item: CdkDrag<FormGroup>) => {
      const modes = this.getAllowedModes(direction);
      return modes.includes(item.data.value.type);
    };
  }

  completeReturnTrip() {
    this.controlService.completeReturnTrip();
  }
}
