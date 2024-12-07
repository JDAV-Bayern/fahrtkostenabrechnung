import { Injectable, inject } from '@angular/core';
import {
  ExpenseType,
  TransportExpense,
  FoodExpense,
  MaterialExpense,
  CarType,
  DiscountCard,
  TransportMode,
  Meal,
  Absence
} from 'src/domain/expense.model';
import {
  TransportExpenseForm,
  FoodExpenseForm,
  MaterialExpenseForm
} from './expense-form';
import {
  FormGroup,
  Validators,
  FormControl,
  NonNullableFormBuilder
} from '@angular/forms';
import { RawFormValue } from 'src/app/shared/form-value';

@Injectable({
  providedIn: 'root'
})
export class ExpenseControlService {
  private readonly formBuilder = inject(NonNullableFormBuilder);

  createForm(type: ExpenseType): FormGroup {
    switch (type) {
      case 'transport':
        return this.createTransportForm();
      case 'food':
        return this.createFoodForm();
      case 'material':
        return this.createMaterialForm();
    }
  }

  createTransportForm(): FormGroup<TransportExpenseForm> {
    const form = this.formBuilder.group({
      mode: ['' as TransportMode | '', Validators.required],
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      distance: [0, [Validators.required, Validators.min(0)]],
      car: this.formBuilder.group({
        type: ['combustion' as CarType, Validators.required],
        passengers: this.formBuilder.array<string>([])
      }),
      train: this.formBuilder.group({
        price: [0, [Validators.required, Validators.min(0)]],
        discountCard: ['none' as DiscountCard, Validators.required]
      })
    }) as FormGroup<TransportExpenseForm>;

    form.controls.mode.valueChanges.subscribe(value =>
      this.onTransportModeChanged(form, value)
    );
    return form;
  }

  createFoodForm(): FormGroup<FoodExpenseForm> {
    return this.formBuilder.group({
      date: new FormControl<Date | null>(null, Validators.required),
      absence: ['workDay' as Absence, [Validators.required, Validators.min(0)]],
      meals: this.formBuilder.group({
        breakfast: false as boolean,
        lunch: false as boolean,
        dinner: false as boolean
      })
    });
  }

  createMaterialForm(): FormGroup<MaterialExpenseForm> {
    return this.formBuilder.group({
      date: new FormControl<Date | null>(null, Validators.required),
      purpose: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]]
    });
  }

  getExpense(type: ExpenseType, value: any) {
    switch (type) {
      case 'transport':
        return this.getTransportExpense(value);
      case 'food':
        return this.getFoodExpense(value);
      case 'material':
        return this.getMaterialExpense(value);
    }
  }

  getTransportExpense(
    value: RawFormValue<TransportExpenseForm>
  ): TransportExpense {
    switch (value.mode) {
      case 'car':
        return {
          type: 'transport',
          mode: 'car',
          origin: value.origin,
          destination: value.destination,
          distance: value.distance!,
          carType: value.car!.type,
          passengers: value.car!.passengers
        };
      case 'train':
        return {
          type: 'transport',
          mode: 'train',
          origin: value.origin,
          destination: value.destination,
          price: value.train!.price,
          discountCard: value.train!.discountCard
        };
      case 'plan':
        return {
          type: 'transport',
          mode: 'plan',
          origin: value.origin,
          destination: value.destination
        };
      case 'bike':
        return {
          type: 'transport',
          mode: 'bike',
          origin: value.origin,
          destination: value.destination,
          distance: value.distance!
        };
      case '':
        throw new Error();
    }
  }

  getFoodExpense(value: RawFormValue<FoodExpenseForm>): FoodExpense {
    let meals: Meal[] = [];
    for (let entry of Object.entries(value.meals)) {
      if (entry[1] === true) {
        meals.push(entry[0] as Meal);
      }
    }

    return {
      type: 'food',
      date: value.date || new Date(),
      absence: value.absence,
      meals: meals
    };
  }

  getMaterialExpense(
    value: RawFormValue<MaterialExpenseForm>
  ): MaterialExpense {
    return {
      type: 'material',
      ...value,
      date: value.date || new Date()
    };
  }

  private onTransportModeChanged(
    form: FormGroup<TransportExpenseForm>,
    value: TransportMode | ''
  ) {
    switch (value) {
      case 'car':
        form.removeControl('train');
        break;
      case 'train':
        form.removeControl('distance');
        form.removeControl('car');
        break;
      case 'plan':
        form.removeControl('distance');
        form.removeControl('car');
        form.removeControl('train');
        break;
      case 'bike':
        form.removeControl('car');
        form.removeControl('train');
        break;
    }
  }
}
