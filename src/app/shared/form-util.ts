import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

export type ControlFactory = (key?: string) => AbstractControl | undefined;

export function reviveDate(dateKeys: string[]) {
  return (key: string, value: any) =>
    dateKeys.includes(key) ? new Date(value) : value;
}

export function reviveFormArrays(
  control: AbstractControl,
  value: any,
  factory: ControlFactory,
  key?: string
) {
  if (!value) {
    return;
  }

  if (control instanceof FormGroup && typeof value === 'object') {
    Object.entries(control.controls).forEach(([key, control]) =>
      reviveFormArrays(control, value[key], factory, key)
    );
  } else if (control instanceof FormArray && Array.isArray(value)) {
    reviveFormArray(key, control, value, factory);

    control.controls.forEach((control, i) =>
      reviveFormArrays(control, value[i], factory)
    );
  }
}

export function reviveFormArray(
  key: string | undefined,
  control: FormArray,
  value: Array<any>,
  factory: ControlFactory
) {
  control.clear();

  for (let i = 0; i < value.length; i++) {
    const child = factory(key);
    if (child) {
      control.push(child);
    }
  }
}

export function deepMarkAsDirty(control: AbstractControl) {
  if (control instanceof FormGroup) {
    Object.values(control.controls).forEach(child => deepMarkAsDirty(child));
  } else if (control instanceof FormArray) {
    control.controls.forEach(child => deepMarkAsDirty(child));
  } else if (control.value) {
    control.markAsDirty();
    control.markAsTouched();
  }
}
