import { Directive, ElementRef, Renderer2, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator,
  ValidatorFn
} from '@angular/forms';

export const TIME_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TimeInputDirective),
  multi: true
};

export const TIME_VALIDATORS = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => TimeInputDirective),
  multi: true
};

export const TIME_PATTERN = /^([0-9]{1,2})(?:\:([0-9]{2})?)?$/;

@Directive({
  selector: 'input[appTimeInput]',
  standalone: true,
  host: {
    '[disabled]': 'disabled',
    '(input)': 'handleInput($event.target.value)',
    '(blur)': 'onTouched()'
  },
  providers: [TIME_VALUE_ACCESSOR, TIME_VALIDATORS]
})
export class TimeInputDirective implements ControlValueAccessor, Validator {
  onChange = (_: any) => {};
  onTouched = () => {};

  disabled = false;
  lastValueValid = false;

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {}

  writeValue(value: any): void {
    const hours = Math.floor(value / 60 / 60 / 1000);
    const minutes = Math.floor(value / 60 / 1000) - hours * 60;
    const formatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    this.lastValueValid = true;
    this.renderer.setProperty(
      this.elementRef.nativeElement,
      'value',
      formatted
    );
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  handleInput(value: string) {
    const match = value.match(TIME_PATTERN);
  
    if (match) {
      const hours = parseInt(match[1]);
      const minutes = match[2] ? parseInt(match[2]) : 0;
      
      if (0 <= hours && hours < 24 && 0 <= minutes && minutes < 60) {
        this.lastValueValid = true;
        this.onChange((hours * 60 + minutes) * 60 * 1000);
        return;
      }
    }

    this.lastValueValid = false;
    this.onChange(0);
  }

  validate: ValidatorFn = control => {
    return this.lastValueValid ? null : { invalidTime: true };
  };
}
