import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule
} from '@danielmoncada/angular-datetime-picker';
import { FoodExpenseForm } from 'src/app/expenses/shared/expense-form';
import { RawFormValue } from 'src/app/shared/form-value';

@Component({
  selector: 'app-food-expense-modal',
  templateUrl: './food-expense-modal.component.html',
  styleUrls: ['./food-expense-modal.component.css'],
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ]
})
export class FoodExpenseModalComponent {
  form: FormGroup<FoodExpenseForm>;

  initialFormValue: RawFormValue<FoodExpenseForm>;

  constructor(
    private dialogRef: DialogRef<FormGroup<FoodExpenseForm>>,
    @Inject(DIALOG_DATA) data: { form: FormGroup<FoodExpenseForm> }
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

  get absence() {
    return this.form.controls.absence;
  }

  get meals() {
    return this.form.controls.meals;
  }

  submitForm() {
    if (this.form.valid) {
      this.dialogRef.close(this.form);
    }
  }
}
