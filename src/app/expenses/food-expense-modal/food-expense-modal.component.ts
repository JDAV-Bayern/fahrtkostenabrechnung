import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  Validators
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';
import { Absence } from 'src/domain/expense.model';
import { AbsencePipe } from '../shared/expense-data.pipe';
import { toInterval } from 'src/app/shared/validators/date-range.validator';
import { getFoodOptions } from 'src/app/reimbursement/shared/food.validator';

@Component({
  selector: 'app-food-expense-modal',
  templateUrl: './food-expense-modal.component.html',
  styleUrls: ['./food-expense-modal.component.css'],
  imports: [ReactiveFormsModule, MatDatepickerModule, AbsencePipe],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FoodExpenseModalComponent,
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: FoodExpenseModalComponent,
      multi: true
    }
  ]
})
export class FoodExpenseModalComponent
  implements ControlValueAccessor, Validator
{
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly controlService = inject(ReimbursementControlService);
  private readonly dialogRef = inject(DialogRef);

  form = this.formBuilder.group({
    date: new FormControl<Date | null>(null, Validators.required),
    absence: ['workDay' as Absence, [Validators.required, Validators.min(0)]],
    breakfast: false,
    lunch: false,
    dinner: false
  });

  onChange: (val: any) => void = () => {};
  onTouched: () => void = () => {};

  initialDate: Date | null = null;
  options: Absence[] = [];

  filterDates = (date: Date | null): boolean =>
    this.initialDate?.getTime() === date?.getTime() ||
    !this.controlService.foodExpenses.value.some(
      expense => expense.date?.getTime() === date?.getTime()
    );

  get date() {
    return this.form.controls.date;
  }

  get absence() {
    return this.form.controls.absence;
  }

  get meetingTime() {
    return this.controlService.meetingStep.controls.time.getRawValue();
  }

  writeValue(val: any): void {
    val && this.form.patchValue(val, { emitEvent: false });
    if (val?.date) {
      this.initialDate = val.date;
      this.onDateChange();
    }
  }

  registerOnChange(fn: (val: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.form.disable() : this.form.enable();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.form.valid ? null : { foodExpense: true };
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
    const date = this.form.controls.date.value || new Date(NaN);
    this.onChange({ type: 'food', ...this.form.value, date });
    this.dialogRef.close();
  }
}
