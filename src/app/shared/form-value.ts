import { FormControl, FormGroup, FormArray } from '@angular/forms';

export type FormValue<T> = {
  [K in keyof T]: Exclude<T[K], undefined> extends FormControl<infer T>
    ? T
    : Exclude<T[K], undefined> extends FormGroup<infer T>
      ? FormValue<T>
      : Exclude<T[K], undefined> extends FormArray<FormControl<infer T>>
        ? T[]
        : Exclude<T[K], undefined> extends FormArray<FormGroup<infer T>>
          ? FormValue<T>[]
          : never;
};
