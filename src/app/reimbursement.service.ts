import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { validateIBAN } from 'ngx-iban-validator';
import {
  BikeExpense,
  CarExpense,
  ExpenseType,
  IExpense,
  PublicTransportPlanExpense,
  TrainExpense
} from 'src/domain/expense';
import { IReimbursement } from 'src/domain/reimbursement';
import { PlzService } from './plz.service';

export type FormDirection = 'inbound' | 'outbound' | 'onsite';

@Injectable({
  providedIn: 'root'
})
export class ReimbursementService {
  travelExpensesForm = this.formBuilder.group({
    personalInformation: this.formBuilder.nonNullable.group({
      name: ['', Validators.required],
      street: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
      city: ['', Validators.required],
      course: this.formBuilder.nonNullable.group({
        code: ['', Validators.required],
        name: ['', Validators.required],
        date: ['', Validators.required],
        location: ['', Validators.required]
      })
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

  get personalInformationStep() {
    return this.travelExpensesForm.get('personalInformation') as FormGroup;
  }

  get expensesStep() {
    return this.travelExpensesForm.get('expenses') as FormGroup;
  }

  get overviewStep() {
    return this.travelExpensesForm.get('overview') as FormGroup;
  }

  getExpenses(direction: FormDirection): FormArray {
    return this.travelExpensesForm.get(`expenses.${direction}`) as FormArray;
  }

  getExpenseFormGroup(type: ExpenseType): FormGroup {
    const commonControls = {
      type: [type, Validators.required],
      from: ['', Validators.required],
      to: ['', Validators.required]
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
          distance: v.distance,
          startLocation: v.from,
          endLocation: v.to,
          carType: v.carType,
          passengers
        });
      case 'train':
        return new TrainExpense({
          startLocation: v.from,
          endLocation: v.to,
          priceWithDiscount: Number(v.price.replace(',', '.').trim()),
          discountCard: v.discountCard
        });
      case 'plan':
        return new PublicTransportPlanExpense({
          startLocation: v.from,
          endLocation: v.to
        });
      case 'bike':
        return new BikeExpense({
          distance: v.distance,
          startLocation: v.from,
          endLocation: v.to
        });
      default:
        throw new Error(`Unknown expense type: ${v.type}`);
    }
  }

  loadForm() {
    const travelExpensesData = localStorage.getItem('travelExpenses') || '{}';
    const travelExpenses = JSON.parse(travelExpensesData);
    this.travelExpensesForm.patchValue(travelExpenses);

    // create controls for form arrays
    for (let direction of [
      'inbound',
      'onsite',
      'outbound'
    ] as FormDirection[]) {
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
    const plzInfo = this.plzService.search(v.personalInformation.zipCode);

    return {
      id: 0,
      formDate: new Date(),
      courseDetails: {
        id: v.personalInformation.course.code,
        courseName: v.personalInformation.course.name,
        courseDate: v.personalInformation.course.date,
        courseLocation: v.personalInformation.course.location
      },
      participantDetails: {
        name: v.personalInformation.name,
        street: v.personalInformation.street,
        zipCode: v.personalInformation.zipCode,
        city: v.personalInformation.city,
        isBavaria: plzInfo.length > 0 ? plzInfo[0].isBavaria : false,
        iban: v.overview.iban,
        bic: v.overview.bic
      },
      expenses: {
        to: v.expenses.inbound.map(this.getExpense),
        at: v.expenses.onsite.map(this.getExpense),
        from: v.expenses.outbound.map(this.getExpense)
      },
      note: v.overview.note
    };
  }

  private getAllExpenses() {
    const expenses = this.getReimbursment().expenses;
    return [...expenses.from, ...expenses.at, ...expenses.to];
  }

  getSum() {
    const reducer = (sum: number, expense: IExpense) =>
      sum + expense.totalReimbursement();
    return this.getAllExpenses().reduce(reducer, 0);
  }

  getDestinationCompletion(direction: FormDirection): string {
    const expenses = this.getExpenses(direction);

    if (expenses.length === 0) {
      return direction === 'inbound'
        ? ''
        : this.getDestinationCompletion('inbound');
    }

    const lastExpense = expenses.value[expenses.length - 1];
    return lastExpense.to;
  }

  getCarTypeCompletion(): string {
    for (let direction of [
      'inbound',
      'onsite',
      'outbound'
    ] as FormDirection[]) {
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
      let temp = value.from;
      value.from = value.to;
      value.to = temp;

      let control = this.getExpenseFormGroup(value.type);
      control.patchValue(value);
      outbound.push(control);
    }

    this.saveForm();
  }
}
