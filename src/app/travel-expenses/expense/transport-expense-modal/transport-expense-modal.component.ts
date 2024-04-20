import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { NgFor, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ExpenseControlService } from 'src/app/expense-control.service';
import { DirectionPipe } from 'src/app/pipes/direction.pipe';
import { ExpenseTypePipe, TransportModePipe } from 'src/app/pipes/expense.pipe';
import { ReimbursementControlService } from 'src/app/reimbursement-control.service';
import { FormValue, TransportExpenseForm } from 'src/app/reimbursement-forms';
import { Direction, TransportMode } from 'src/domain/expense';

export interface TransportExpenseDialogData {
  form?: FormGroup;
  direction: Direction;
  allowedModes: TransportMode[];
}

@Component({
    selector: 'app-transport-expense-modal',
    templateUrl: './transport-expense-modal.component.html',
    styleUrls: ['./transport-expense-modal.component.css'],
    standalone: true,
    imports: [
        NgIf,
        NgFor,
        ReactiveFormsModule,
        DirectionPipe,
        ExpenseTypePipe,
        TransportModePipe
    ]
})
export class TransportExpenseModalComponent {
  form: FormGroup<TransportExpenseForm>;
  direction: Direction;
  allowedModes: TransportMode[];
  initialFormValue: FormValue<TransportExpenseForm>;

  constructor(
    private reimbursementControlService: ReimbursementControlService,
    private expenseControlService: ExpenseControlService,
    private dialogRef: DialogRef<FormGroup<TransportExpenseForm>>,
    @Inject(DIALOG_DATA) data: TransportExpenseDialogData
  ) {
    this.direction = data.direction;
    this.allowedModes = data.allowedModes;
    this.form = data.form || this.expenseControlService.createTransportForm();

    this.initialFormValue = this.form.getRawValue();

    this.dialogRef.closed.subscribe(() => {
      if (!this.form.valid) {
        this.form.reset(this.initialFormValue);
      }
    });
  }

  get mode() {
    return this.form.controls.mode;
  }

  get origin() {
    return this.form.controls.origin;
  }

  get destination() {
    return this.form.controls.destination;
  }

  get distance() {
    return this.form.controls.distance;
  }

  get train() {
    return this.form.controls.train;
  }

  get car() {
    return this.form.controls.car;
  }

  chooseExpense(mode: TransportMode) {
    this.mode.setValue(mode);
    this.expenseControlService.updateTransportForm(this.form, mode);

    // autofill applicable fields
    const origin = this.reimbursementControlService.getOriginCompletion(
      this.direction
    );
    this.origin.setValue(origin);

    if (this.train) {
      const discountCard =
        this.reimbursementControlService.getDiscountCompletion();
      this.train.controls.discountCard.setValue(discountCard);
    } else if (this.car) {
      const carType = this.reimbursementControlService.getCarTypeCompletion();
      this.car.controls.type.setValue(carType);
    }
  }

  addPassenger() {
    const control = new FormControl('', {
      nonNullable: true,
      validators: Validators.required
    });

    const passengers = this.car?.controls.passengers;
    passengers?.push(control);
  }

  removePassenger(index: number) {
    const passengers = this.car?.controls.passengers;
    passengers?.removeAt(index);
  }

  submitForm() {
    if (this.form.valid) {
      this.dialogRef.close(this.form);
    }
  }
}
