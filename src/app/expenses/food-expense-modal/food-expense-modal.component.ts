import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FoodExpenseForm } from 'src/app/expenses/shared/expense-form';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';
import { RawFormValue } from 'src/app/shared/form-value';
import { Absence } from 'src/domain/expense.model';
import { AbsencePipe } from '../shared/expense-data.pipe';
import { toInterval } from 'src/app/shared/validators/date-range.validator';
import { getFoodOptions } from 'src/app/reimbursement/shared/food.validator';

@Component({
  selector: 'app-food-expense-modal',
  templateUrl: './food-expense-modal.component.html',
  styleUrls: ['./food-expense-modal.component.css'],
  imports: [ReactiveFormsModule, MatDatepickerModule, AbsencePipe]
})
export class FoodExpenseModalComponent {
  private readonly controlService = inject(ReimbursementControlService);
  private readonly dialogRef =
    inject<DialogRef<FormGroup<FoodExpenseForm>>>(DialogRef);

  form: FormGroup<FoodExpenseForm>;
  initialFormValue: RawFormValue<FoodExpenseForm>;
  options: Absence[] = [];

  filterDates = (date: Date | null): boolean =>
    this.initialFormValue.date?.getTime() === date?.getTime() ||
    !this.controlService.foodExpenses.value.some(
      expense => expense.date?.getTime() === date?.getTime()
    );

  constructor() {
    const data = inject<{ form: FormGroup<FoodExpenseForm> }>(DIALOG_DATA);

    this.form = data.form;

    this.initialFormValue = this.form.getRawValue();
    this.onDateChange();

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

  get meetingTime() {
    return this.controlService.meetingStep.controls.time.getRawValue();
  }

  onDateChange() {
    const time = this.controlService.meetingStep.controls.time;
    const interval = toInterval(time);
    const foodOpts = interval ? getFoodOptions(interval) : [];
    const entry = foodOpts.find(
      opt => opt.date.getTime() === this.date.value?.getTime()
    );

    if (!entry) {
      return;
    }

    // update absence options
    if (entry.options) {
      this.options = entry.options;
    } else {
      this.options = entry.absence ? [entry.absence] : [];
    }

    // autofill the absence field
    if (entry.absence) {
      this.absence.setValue(entry.absence);
    } else {
      this.absence.setValue(this.options[0]);
    }
  }

  submitForm() {
    if (this.form.valid) {
      this.dialogRef.close(this.form);
    }
  }
}
