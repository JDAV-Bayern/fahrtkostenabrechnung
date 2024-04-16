import { NgFor, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormGroup,
  FormArray,
  Validators,
  NonNullableFormBuilder,
  ReactiveFormsModule
} from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ReimbursementControlService } from 'src/app/reimbursement-control.service';
import { ExpenseForm, FormValue } from 'src/app/reimbursement-forms';
import { Direction, ExpenseType } from 'src/domain/expense';

export interface ExpenseDialogData {
  direction: Direction;
  showPlan: boolean;
  form?: FormGroup;
}

@Component({
  selector: 'app-add-expense-modal',
  templateUrl: './add-expense-modal.component.html',
  styleUrls: ['./add-expense-modal.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule]
})
export class AddExpenseModalComponent {
  direction: Direction;
  form: FormGroup<ExpenseForm>;
  showPlan: boolean;

  initialFormValue: FormValue<ExpenseForm>;

  constructor(
    private controlService: ReimbursementControlService,
    private dialogRef: DialogRef<FormGroup<ExpenseForm>>,
    @Inject(DIALOG_DATA) data: ExpenseDialogData,
    private formBuilder: NonNullableFormBuilder
  ) {
    this.direction = data.direction;
    this.showPlan = data.showPlan;
    this.form = data.form || this.controlService.getExpenseFormGroup();

    this.initialFormValue = this.form.getRawValue();

    this.dialogRef.closed.subscribe(() => {
      if (!this.form.valid) {
        this.form.reset(this.initialFormValue);
      }
    });
  }

  get type() {
    return this.form.controls.type;
  }

  get origin() {
    return this.form.controls.origin;
  }

  get destination() {
    return this.form.controls.destination;
  }

  // for car and bike expenses
  get distance() {
    return this.form.controls.distance;
  }

  // for train expenses
  get price() {
    return this.form.controls.price;
  }

  // for train expenses
  get discount() {
    return this.form.controls.discountCard;
  }

  // for car expenses
  get carType() {
    return this.form.controls.carType;
  }

  // for car expenses
  get passengers() {
    return this.form.controls.passengers;
  }

  addPassenger() {
    const passengersControl = this.form.controls.passengers;
    if (!passengersControl) {
      return;
    }
    const newForm = this.formBuilder.control('', Validators.required);
    passengersControl.push(newForm);
  }

  removePassenger(index: number) {
    const passengersControl = <FormArray>this.form.get('passengers');
    passengersControl.removeAt(index);
  }

  getDirectionName() {
    switch (this.direction) {
      case 'inbound':
        return 'Hinfahrt';
      case 'outbound':
        return 'Rückfahrt';
      case 'onsite':
        return 'Vor Ort';
    }
  }

  getExpenseName() {
    switch (this.type.value) {
      case 'car':
        return 'Autofahrt';
      case 'train':
        return 'Zugfahrt';
      case 'plan':
        return 'Abonutzung';
      case 'bike':
        return 'Fahrradfahrt';
      default:
        return;
    }
  }

  chooseExpense(type: ExpenseType) {
    this.type.setValue(type);
    this.form = this.controlService.getExpenseFormGroup(type);

    // autofill some fields
    const origin = this.controlService.getOriginCompletion(this.direction);
    const carType = this.controlService.getCarTypeCompletion();
    const discountCard = this.controlService.getDiscountCompletion();
    this.form.patchValue({ origin, carType, discountCard });
  }

  submitForm() {
    if (this.form.valid) {
      this.dialogRef.close(this.form);
    }
  }
}
