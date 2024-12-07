import { Injectable, inject } from '@angular/core';
import {
  ExpenseType,
  TransportExpense,
  FoodExpense,
  MaterialExpense,
  EngineType,
  Discount,
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
      carTrip: this.formBuilder.group({
        engineType: ['combustion' as EngineType, Validators.required],
        passengers: this.formBuilder.array<string>([])
      }),
      ticket: this.formBuilder.group({
        price: [0, [Validators.required, Validators.min(0)]],
        discount: ['none' as Discount, Validators.required]
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
      breakfast: false as boolean,
      lunch: false as boolean,
      dinner: false as boolean
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
          carTrip: {
            engineType: value.carTrip!.engineType,
            passengers: value.carTrip!.passengers
          }
        };
      case 'public':
        return {
          type: 'transport',
          mode: 'public',
          origin: value.origin,
          destination: value.destination,
          ticket: {
            price: value.ticket!.price,
            discount: value.ticket!.discount
          }
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
    return {
      type: 'food',
      ...value,
      date: value.date || new Date()
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
        form.removeControl('ticket');
        break;
      case 'public':
        form.removeControl('distance');
        form.removeControl('carTrip');
        break;
      case 'plan':
        form.removeControl('distance');
        form.removeControl('carTrip');
        form.removeControl('ticket');
        break;
      case 'bike':
        form.removeControl('carTrip');
        form.removeControl('ticket');
        break;
    }
  }
}
