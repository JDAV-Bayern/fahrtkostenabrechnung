import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  Absence,
  CarType,
  DiscountCard,
  TransportMode
} from 'src/domain/expense';
import { MeetingType } from 'src/domain/meeting';

export type DateRange = [Date | null, Date | null];

export type MeetingForm = {
  type: FormControl<MeetingType>;
  name: FormControl<string>;
  location: FormControl<string>;
  period: FormControl<DateRange>;
  code?: FormControl<string>;
};

export type TransportExpenseForm = {
  mode: FormControl<TransportMode | ''>;
  origin: FormControl<string>;
  destination: FormControl<string>;
  distance?: FormControl<number>;
  car?: FormGroup<CarForm>;
  train?: FormGroup<TrainForm>;
};

export type TrainForm = {
  price: FormControl<number>;
  discountCard: FormControl<DiscountCard>;
};

export type CarForm = {
  type: FormControl<CarType>;
  passengers: FormArray<FormControl<string>>;
};

export type FoodExpenseForm = {
  date: FormControl<Date | null>;
  absence: FormControl<Absence>;
  meals: FormGroup<MealForm>;
};

export type MealForm = {
  breakfast: FormControl<boolean>;
  lunch: FormControl<boolean>;
  dinner: FormControl<boolean>;
};

export type MaterialExpenseForm = {
  date: FormControl<Date | null>;
  purpose: FormControl<string>;
  amount: FormControl<number>;
};

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
