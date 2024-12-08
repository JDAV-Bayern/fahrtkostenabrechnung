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

@Component({
  selector: 'app-material-expense-modal',
  templateUrl: './material-expense-modal.component.html',
  styleUrls: ['./material-expense-modal.component.css'],
  imports: [ReactiveFormsModule, MatDatepickerModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: MaterialExpenseModalComponent,
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: MaterialExpenseModalComponent,
      multi: true
    }
  ]
})
export class MaterialExpenseModalComponent
  implements ControlValueAccessor, Validator
{
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly dialogRef = inject(DialogRef);

  form = this.formBuilder.group({
    date: new FormControl<Date | null>(null, Validators.required),
    purpose: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(0)]]
  });

  onChange: (val: any) => void = () => {};
  onTouched: () => void = () => {};

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

  writeValue(val: any): void {
    val && this.form.patchValue(val, { emitEvent: false });
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
    return this.form.valid ? null : { materialExpense: true };
  }

  submitForm() {
    const date = this.form.controls.date.value || new Date(NaN);
    this.onChange({ type: 'material', ...this.form.value, date });
    this.dialogRef.close();
  }
}
