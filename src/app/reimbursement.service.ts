import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { validateIBAN } from 'ngx-iban-validator';
import {
  BikeExpense,
  CarExpense,
  Direction,
  ExpenseType,
  IExpense,
  PublicTransportPlanExpense,
  TrainExpense
} from 'src/domain/expense';
import { IReimbursement } from 'src/domain/reimbursement';
import { PlzService } from './plz.service';

@Injectable({
  providedIn: 'root'
})
export class ReimbursementService {
  travelExpensesForm = this.formBuilder.group({
    course: this.formBuilder.nonNullable.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      date: ['', Validators.required],
      location: ['', Validators.required]
    }),
    participant: this.formBuilder.nonNullable.group({
      name: ['', Validators.required],
      street: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
      city: ['', Validators.required]
    }),
    expenses: this.formBuilder.group({
      inbound: this.formBuilder.array<IExpense>([]),
      onsite: this.formBuilder.array<IExpense>([]),
      outbound: this.formBuilder.array<IExpense>([])
    }),
    overview: this.formBuilder.nonNullable.group({
      iban: ['', [Validators.required, validateIBAN]],
      bic: [''],
      note: [''],
      file: [undefined]
    })
  });

  constructor(
    private formBuilder: FormBuilder,
    private plzService: PlzService
  ) {}

  get participantStep() {
    return this.travelExpensesForm.get('participant') as FormGroup;
  }

  get courseStep() {
    return this.travelExpensesForm.get('course') as FormGroup;
  }

  get expensesStep() {
    return this.travelExpensesForm.get('expenses') as FormGroup;
  }

  get overviewStep() {
    return this.travelExpensesForm.get('overview') as FormGroup;
  }

  getExpenses(direction: Direction): FormArray {
    return this.travelExpensesForm.get(`expenses.${direction}`) as FormArray;
  }

  getExpenseFormGroup(type: ExpenseType): FormGroup {
    const commonControls = {
      type: [type, Validators.required],
      origin: ['', Validators.required],
      destination: ['', Validators.required]
    };

    switch (type) {
      case 'car':
        return this.formBuilder.group({
          ...commonControls,
          distance: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
          carType: ['', [Validators.required]],
          passengers: ['']
        });
      case 'train':
        return this.formBuilder.group({
          ...commonControls,
          price: ['', [Validators.required, Validators.min(0)]],
          discountCard: ['', [Validators.required]]
        });
      case 'plan':
        return this.formBuilder.group(commonControls);
      case 'bike':
        return this.formBuilder.group({
          ...commonControls,
          distance: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]]
        });
    }
  }

  getExpense(v: any): IExpense {
    switch (v.type) {
      case 'car':
        const passengers = v.passengers
          ? (v.passengers as string)
              .split(',')
              .map(passenger => passenger.trim())
          : [];
        return new CarExpense({
          ...v,
          passengers
        });
      case 'train':
        return new TrainExpense({
          ...v,
          priceWithDiscount: Number(v.price.replace(',', '.').trim())
        });
      case 'plan':
        return new PublicTransportPlanExpense(v);
      case 'bike':
        return new BikeExpense(v);
      default:
        throw new Error(`Unknown expense type: ${v.type}`);
    }
  }

  loadForm() {
    const travelExpensesData = localStorage.getItem('travelExpenses') || '{}';
    const travelExpenses = JSON.parse(travelExpensesData);
    this.travelExpensesForm.patchValue(travelExpenses);

    // create controls for form arrays
    for (let direction of ['inbound', 'onsite', 'outbound'] as Direction[]) {
      const expenses = travelExpenses.expenses[direction];
      if (expenses) {
        const formArray = this.getExpenses(direction);
        for (let expense of expenses) {
          const formRecord = this.getExpenseFormGroup(expense.type);
          formRecord.patchValue(expense);
          formArray.push(formRecord);
        }
      }
    }
  }

  saveForm() {
    // TODO: exclude file field?
    const travelExpensesData = JSON.stringify(this.travelExpensesForm.value);
    localStorage.setItem('travelExpenses', travelExpensesData);
  }

  deleteStoredData(): void {
    localStorage.removeItem('travelExpenses');
  }

  getReimbursment(): IReimbursement {
    const v = this.travelExpensesForm.getRawValue();
    const plzInfo = this.plzService.search(v.participant.zipCode);

    return {
      course: v.course,
      participant: {
        ...v.participant,
        isBavaria: plzInfo.length > 0 ? plzInfo[0].isBavaria : false,
        iban: v.overview.iban,
        bic: v.overview.bic
      },
      expenses: {
        inbound: v.expenses.inbound.map(this.getExpense),
        onsite: v.expenses.onsite.map(this.getExpense),
        outbound: v.expenses.outbound.map(this.getExpense)
      },
      note: v.overview.note
    };
  }

  private getAllExpenses() {
    const expenses = this.getReimbursment().expenses;
    return [...expenses.outbound, ...expenses.onsite, ...expenses.inbound];
  }

  getSum() {
    const reducer = (sum: number, expense: IExpense) =>
      sum + expense.totalReimbursement();
    return this.getAllExpenses().reduce(reducer, 0);
  }

  getDestinationCompletion(direction: Direction): string {
    const expenses = this.getExpenses(direction);

    if (expenses.length === 0) {
      return direction === 'inbound'
        ? ''
        : this.getDestinationCompletion('inbound');
    }

    const lastExpense = expenses.value[expenses.length - 1];
    return lastExpense.destination;
  }

  getCarTypeCompletion(): string {
    for (let direction of ['inbound', 'onsite', 'outbound'] as Direction[]) {
      const expenses = this.getExpenses(direction).getRawValue();
      const carExpense = expenses.find(expense => 'carType' in expense);
      if (carExpense) {
        return carExpense.carType;
      }
    }
    return '';
  }

  completeReturnTrip(): void {
    const values = this.getExpenses('inbound').getRawValue();
    const outbound = this.getExpenses('outbound');
    outbound.clear();

    for (let i = values.length - 1; i >= 0; i--) {
      const value = values[i];

      // swap origin and destination
      let temp = value.origin;
      value.origin = value.destination;
      value.destination = temp;

      let control = this.getExpenseFormGroup(value.type);
      control.patchValue(value);
      outbound.push(control);
    }

    this.saveForm();
  }
}
