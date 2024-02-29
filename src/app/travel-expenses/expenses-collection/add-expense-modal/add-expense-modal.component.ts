import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReimbursementControlService } from 'src/app/reimbursement-control.service';
import { Direction, ExpenseType } from 'src/domain/expense';

export interface ExpenseDialogData {
  direction: Direction;
  form?: FormGroup;
}

@Component({
  selector: 'app-add-expense-modal',
  templateUrl: './add-expense-modal.component.html',
  styleUrls: ['./add-expense-modal.component.css']
})
export class AddExpenseModalComponent {
  direction: Direction;
  form: FormGroup;

  constructor(
    private controlService: ReimbursementControlService,
    private dialogRef: MatDialogRef<AddExpenseModalComponent>,
    formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: ExpenseDialogData
  ) {
    this.direction = data.direction;
    this.form =
      data.form ||
      formBuilder.nonNullable.group({
        type: ['', Validators.required]
      });
  }

  get type() {
    return this.form.get('type') as FormControl<string>;
  }

  get origin() {
    return this.form.get('origin') as FormControl<string> | null;
  }

  get destination() {
    return this.form.get('destination') as FormControl<string> | null;
  }

  // for car and bike expenses
  get distance() {
    return this.form.get('distance') as FormControl | null;
  }

  // for train expenses
  get price() {
    return this.form.get('price') as FormControl | null;
  }

  // for train expenses
  get discount() {
    return this.form.get('discountCard') as FormControl | null;
  }

  // for car expenses
  get carType() {
    return this.form.get('carType') as FormControl | null;
  }

  // for car expenses
  get passengers() {
    return this.form.get('passengers') as FormControl | null;
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
