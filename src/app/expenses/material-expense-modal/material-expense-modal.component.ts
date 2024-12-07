import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MaterialExpenseForm } from 'src/app/expenses/shared/expense-form';
import { RawFormValue } from 'src/app/shared/form-value';

@Component({
  selector: 'app-material-expense-modal',
  templateUrl: './material-expense-modal.component.html',
  styleUrls: ['./material-expense-modal.component.css'],
  imports: [ReactiveFormsModule, MatDatepickerModule]
})
export class MaterialExpenseModalComponent {
  private readonly dialogRef =
    inject<DialogRef<FormGroup<MaterialExpenseForm>>>(DialogRef);

  form: FormGroup<MaterialExpenseForm>;

  initialFormValue: RawFormValue<MaterialExpenseForm>;

  constructor() {
    const data = inject<{ form: FormGroup<MaterialExpenseForm> }>(DIALOG_DATA);

    this.form = data.form;

    this.initialFormValue = this.form.getRawValue();

    this.dialogRef.closed.subscribe(() => {
      if (!this.form.valid) {
        this.form.reset(this.initialFormValue);
      }
    });
  }

  get date() {
    return this.form.controls.date;
  }

  get purpose() {
    return this.form.controls.purpose;
  }

  get amount() {
    return this.form.controls.amount;
  }

  get now() {
    return new Date();
  }

  submitForm() {
    if (this.form.valid) {
      this.dialogRef.close(this.form);
    }
  }
}
