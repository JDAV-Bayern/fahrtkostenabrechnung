import { FormArray, FormControl } from '@angular/forms';
import { ExpenseType } from 'src/domain/expense';
import { MeetingType } from 'src/domain/meeting';

export type DateRange = [Date | null, Date | null];

export type MeetingForm = {
  type: FormControl<MeetingType>;
  name: FormControl<string>;
  location: FormControl<string>;
  period: FormControl<DateRange>;
  code?: FormControl<string>;
};

export type ExpenseForm = {
  type: FormControl<ExpenseType | ''>;
  origin: FormControl<string>;
  destination: FormControl<string>;
  distance?: FormControl<number>;
  price?: FormControl<number>;
  discountCard?: FormControl<string>;
  carType?: FormControl<string>;
  passengers?: FormArray<FormControl<string>>;
};

export type FormValue<T> = {
  [K in keyof T]: Exclude<T[K], undefined> extends FormControl<infer T>
    ? T
    : Exclude<T[K], undefined> extends FormArray<FormControl<infer T>>
      ? T[]
      : never;
};
