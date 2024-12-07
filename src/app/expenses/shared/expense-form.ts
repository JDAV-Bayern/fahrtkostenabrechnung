import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  Absence,
  EngineType,
  Discount,
  TransportMode
} from 'src/domain/expense.model';

export type TransportExpenseForm = {
  mode: FormControl<TransportMode | ''>;
  origin: FormControl<string>;
  destination: FormControl<string>;
  distance?: FormControl<number>;
  carTrip?: FormGroup<CarTripForm>;
  ticket?: FormGroup<TicketForm>;
};

export type TicketForm = {
  price: FormControl<number>;
  discount: FormControl<Discount>;
};

export type CarTripForm = {
  engineType: FormControl<EngineType>;
  passengers: FormArray<FormControl<string>>;
};

export type FoodExpenseForm = {
  date: FormControl<Date | null>;
  absence: FormControl<Absence>;
  breakfast: FormControl<boolean>;
  lunch: FormControl<boolean>;
  dinner: FormControl<boolean>;
};

export type MaterialExpenseForm = {
  date: FormControl<Date | null>;
  purpose: FormControl<string>;
  amount: FormControl<number>;
};
