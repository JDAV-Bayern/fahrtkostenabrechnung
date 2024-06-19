import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  Absence,
  CarType,
  DiscountCard,
  TransportMode
} from 'src/domain/expense.model';

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
