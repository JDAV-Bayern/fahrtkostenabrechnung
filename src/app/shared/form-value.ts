import {
  FormControl,
  FormGroup,
  FormArray,
  AbstractControl
} from '@angular/forms';

export type RawFormValue<T> =
  Exclude<T, undefined> extends FormControl<infer F>
    ? F
    : Exclude<T, undefined> extends FormGroup<infer F>
      ? { [K in keyof F]: RawFormValue<F[K]> }
      : Exclude<T, undefined> extends FormArray<infer T>
        ? RawFormValue<T>[]
        : T extends { [key: string]: AbstractControl }
          ? { [K in keyof T]: RawFormValue<T[K]> }
          : never;

export type FormValue<T> =
  Exclude<T, undefined> extends FormControl<infer F>
    ? F
    : Exclude<T, undefined> extends FormGroup<infer F>
      ? Partial<{ [K in keyof F]: FormValue<F[K]> }>
      : Exclude<T, undefined> extends FormArray<infer T>
        ? FormValue<T>[]
        : T extends { [key: string]: AbstractControl }
          ? Partial<{ [K in keyof T]: FormValue<T[K]> }>
          : never;
