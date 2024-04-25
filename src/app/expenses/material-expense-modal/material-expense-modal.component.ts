import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { MaterialExpenseForm } from 'src/app/expenses/shared/expense-form';
import { RawFormValue } from 'src/app/shared/form-value';

@Component({
  selector: 'app-material-expense-modal',
  templateUrl: './material-expense-modal.component.html',
  styleUrls: ['./material-expense-modal.component.css'],
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, OwlDateTimeModule]
})
export class MaterialExpenseModalComponent {
  form: FormGroup<MaterialExpenseForm>;

  initialFormValue: RawFormValue<MaterialExpenseForm>;

  constructor(
    private dialogRef: DialogRef<FormGroup<MaterialExpenseForm>>,
    @Inject(DIALOG_DATA) data: { form: FormGroup<MaterialExpenseForm> }
  ) {
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

  submitForm() {
    if (this.form.valid) {
      this.dialogRef.close(this.form);
    }
  }
}
