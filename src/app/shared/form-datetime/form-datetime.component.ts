import { Platform } from '@angular/cdk/platform';
import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validator,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {
  MatCalendarCellClassFunction,
  MatDatepickerModule
} from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import {
  interval,
  isAfter,
  isSameDay,
  isWithinInterval,
  startOfDay
} from 'date-fns';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form-datetime',
  templateUrl: './form-datetime.component.html',
  styleUrl: './form-datetime.component.css',
  host: { class: 'form-group' },
  imports: [ReactiveFormsModule, MatDatepickerModule, MatTimepickerModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FormDatetimeComponent,
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: FormDatetimeComponent,
      multi: true
    }
  ]
})
export class FormDatetimeComponent
  implements ControlValueAccessor, OnDestroy, OnInit, Validator
{
  private readonly platform = inject(Platform);

  readonly min = input<Date | null>(null);
  readonly max = input<Date | null>(null);
  readonly comparisonStart = input<Date | null>(null);
  readonly comparisonEnd = input<Date | null>(null);
  readonly legend = input<string>();

  /*
   * MatDatepicker and MatTimepicker can be used together on a single control,
   * but this behavior is currently very buggy. Therefore, we handle combining
   * date and time ourselves.
   */
  form = new FormGroup({
    date: new FormControl<Date | null>(null, Validators.required),
    time: new FormControl<Date | null>(null, Validators.required)
  });
  isMobile = this.platform.ANDROID || this.platform.IOS;

  onDateChangeSub?: Subscription;
  onTimeChangeSub?: Subscription;
  onTouched: () => void = () => {
    // do nothing
  };

  get date() {
    return this.form.controls.date;
  }

  get time() {
    return this.form.controls.time;
  }

  ngOnInit() {
    this.onDateChangeSub = this.date.valueChanges.subscribe(date =>
      this.time.setValue(date)
    );
  }

  ngOnDestroy() {
    this.onDateChangeSub?.unsubscribe();
    this.onTimeChangeSub?.unsubscribe();
  }

  writeValue(val: Date | null): void {
    const date = val ? startOfDay(val) : null;
    this.date.setValue(date, { emitEvent: false });
    this.time.setValue(val, { emitEvent: false });
  }

  registerOnChange(fn: (val: Date | null) => void): void {
    this.onTimeChangeSub?.unsubscribe();
    this.onTimeChangeSub = this.time.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable({ emitEvent: false });
    } else {
      this.form.enable({ emitEvent: false });
    }
  }

  validate: ValidatorFn = () => {
    if (this.date.errors || this.time.errors) {
      return {
        ...(this.date.errors ?? {}),
        ...(this.time.errors ?? {})
      };
    }

    return null;
  };

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    // Only highlight dates inside the month view.
    if (view !== 'month') {
      return '';
    }

    const start = this.comparisonStart();
    const end = this.comparisonEnd();

    if (start && end) {
      if (isAfter(start, end)) {
        return '';
      }

      return {
        'comparison-start': isSameDay(cellDate, start),
        'comparison-end': isSameDay(cellDate, end),
        'in-comparison-range': isWithinInterval(
          cellDate,
          interval(startOfDay(start), startOfDay(end))
        )
      };
    }

    const comparison = start || end;
    return comparison && isSameDay(cellDate, comparison)
      ? 'comparison-start comparison-end in-comparison-range'
      : '';
  };
}
