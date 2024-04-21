import { CdkDrag, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TravelControlService } from 'src/app/travel/shared/travel-control.service';
import { CurrencyPipe, NgIf } from '@angular/common';
import { FormCardComponent } from 'src/app/shared/form-card/form-card.component';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { Direction, TransportMode } from 'src/domain/expense.model';
import { TravelService } from '../shared/travel.service';
import { TransportExpenseForm } from 'src/app/expenses/shared/expense-form';
import { ExpenseControlService } from 'src/app/expenses/shared/expense-control.service';
import { ExpenseListComponent } from 'src/app/expenses/expense-list/expense-list.component';
import { TransportExpenseDialogData, TransportExpenseModalComponent } from 'src/app/expenses/transport-expense-modal/transport-expense-modal.component';

@Component({
  selector: 'app-expenses-step',
  templateUrl: './expenses-step.component.html',
  styleUrls: ['./expenses-step.component.css'],
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
export class ExpensesStepComponent {
  form;

  constructor(
    private readonly travelService: TravelService,
    private readonly travelControlService: TravelControlService,
    private readonly expenseControlService: ExpenseControlService,
    private dialog: Dialog
  ) {
    this.form = this.travelControlService.transportExpensesStep;
  }

  get nextStep() {
    const meeting = this.travelControlService.meetingStep.controls.type.value;
    return meeting === 'committee' ? 'auslagen-gremium' : 'zusammenfassung';
  }

  get total() {
    const travel = this.travelControlService.getTravel();
    return this.travelService.getSummary(travel).transport;
  }

  getAllowedModes(direction: Direction) {
    let allowedModes: TransportMode[] = ['car', 'train'];

    if (direction !== 'onsite') {
      allowedModes.push('bike');

      const expenses =
        this.travelControlService.getTransportExpenses(direction);
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
    return (expense?: FormGroup<TransportExpenseForm>) => {
      const form = expense || this.expenseControlService.createTransportForm();
      const sub = form.controls.mode.valueChanges.subscribe(() =>
        this.travelControlService.completeTransportExpense(direction, form)
      );

      const allowedModes = this.getAllowedModes(direction);
      const data: TransportExpenseDialogData = { form, allowedModes };

      const dialogRef = this.dialog.open<FormGroup>(
        TransportExpenseModalComponent,
        { data }
      );
      dialogRef.closed.subscribe(() => sub.unsubscribe());
      return dialogRef;
    };
  }

  getPredicateFn(direction: Direction) {
    return (item: CdkDrag<FormGroup>) => {
      const modes = this.getAllowedModes(direction);
      return modes.includes(item.data.value.mode);
    };
  }

  completeReturnTrip() {
    this.travelControlService.completeReturnTrip();
  }
}
