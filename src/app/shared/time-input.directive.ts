import {
  Directive,
  ElementRef,
  Renderer2,
  forwardRef,
  inject
} from '@angular/core';
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

export const TIME_PATTERN = /^([0-9]{1,2})(?::([0-9]{2})?)?$/;

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
  private readonly renderer = inject(Renderer2);
  private readonly elementRef = inject(ElementRef);

  onChange: (val: number) => void = () => {
    // do nothing
  };
  onTouched: () => void = () => {
    // do nothing
  };

  disabled = false;
  lastValueValid = false;

  writeValue(value: number): void {
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

  registerOnChange(fn: (val: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
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

  validate: ValidatorFn = () => {
    return this.lastValueValid ? null : { invalidTime: true };
  };
}
