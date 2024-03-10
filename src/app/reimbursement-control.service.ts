import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators
} from '@angular/forms';
import { validateIBAN } from 'ngx-iban-validator';
import { Direction, ExpenseType, Expense } from 'src/domain/expense';
import { Reimbursement } from 'src/domain/reimbursement';
import { anyRequired } from './forms/validators/any-required.validator';
import { maxPlanExpenses } from './forms/validators/max-plan-expenses.validator';
import { validateCourseCode } from './forms/validators/course-code.validator';

const PLZ_PATTERN = /^[0-9]{5}$/;
const BIC_PATTERN = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;

const SEPA_CODES =
  /^(BE|BG|DK|DE|EE|FI|FR|GR|GB|IE|IS|IT|HR|LV|LI|LT|LU|MT|MC|NL|NO|AT|PL|PT|RO|SM|SE|CH|SK|SI|ES|CZ|HU|CY)/;
const BIC_REQUIRED = /^(MC|SM|CH)/;

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

export type ExpenseFormValue = {
  [K in keyof ExpenseForm]: Exclude<
    ExpenseForm[K],
    undefined
  > extends FormControl<infer T>
    ? T
    : Exclude<ExpenseForm[K], undefined> extends FormArray<FormControl<infer T>>
      ? T[]
      : never;
};

@Injectable({
  providedIn: 'root'
})
export class ReimbursementControlService {
  form = this.formBuilder.group({
    course: this.formBuilder.group({
      code: ['', [Validators.required, validateCourseCode]],
      name: ['', Validators.required]
    }),
    participant: this.formBuilder.group({
      givenName: ['', Validators.required],
      familyName: ['', Validators.required],
      sectionId: new FormControl<number | null>(null, Validators.required),
      zipCode: ['', [Validators.required, Validators.pattern(PLZ_PATTERN)]],
      city: ['', Validators.required],
      iban: ['', [Validators.required, validateIBAN]],
      bic: ['', [Validators.required, Validators.pattern(BIC_PATTERN)]]
    }),
    expenses: this.formBuilder.group(
      {
        inbound: this.formBuilder.array<FormGroup<ExpenseForm>>(
          [],
          maxPlanExpenses
        ),
        onsite: this.formBuilder.array<FormGroup<ExpenseForm>>([]),
        outbound: this.formBuilder.array<FormGroup<ExpenseForm>>(
          [],
          maxPlanExpenses
        )
      },
      { validators: anyRequired }
    ),
    overview: this.formBuilder.group({
      note: [''],
      file: [undefined]
    })
  });

  constructor(private formBuilder: NonNullableFormBuilder) {
    this.form.valueChanges.subscribe(() => this.saveForm());

    const iban = this.participantStep.controls.iban;
    iban.valueChanges.subscribe(value => this.onIbanChanged(value));

    this.loadForm();
  }

  get participantStep() {
    return this.form.controls.participant;
  }

  get courseStep() {
    return this.form.controls.course;
  }

  get expensesStep() {
    return this.form.controls.expenses;
  }

  get overviewStep() {
    return this.form.controls.overview;
  }

  getExpenses(direction: Direction) {
    return this.expensesStep.controls[direction];
  }

  getExpenseFormGroup(type?: ExpenseType | '') {
    const form = new FormGroup<ExpenseForm>({
      type: this.formBuilder.control(type || '', Validators.required),
      origin: this.formBuilder.control('', Validators.required),
      destination: this.formBuilder.control('', Validators.required)
    });

    // predefine controls - these must only be added once!
    const positiveNumber = this.formBuilder.control(0, [
      Validators.required,
      Validators.min(0)
    ]);
    const requiredString = this.formBuilder.control('', Validators.required);

    switch (type) {
      case 'car':
        form.addControl('distance', positiveNumber);
        form.addControl('carType', requiredString);
        form.addControl('passengers', this.formBuilder.array([] as string[]));
        break;
      case 'train':
        form.addControl('price', positiveNumber);
        form.addControl('discountCard', requiredString);
        break;
      case 'plan':
        break;
      case 'bike':
        form.addControl('distance', positiveNumber);
        break;
    }

    return form;
  }

  loadForm() {
    console.log('Loading form values from local storage...');

    // parse JSON from local storage
    const storedData = localStorage.getItem('travelExpenses') || '{}';
    const storedValue = JSON.parse(storedData);
    this.form.patchValue(storedValue);

    // create controls for form arrays
    if (storedValue.expenses) {
      for (let direction of ['inbound', 'onsite', 'outbound'] as Direction[]) {
        const expenses = storedValue.expenses[direction];
        if (expenses) {
          const formArray = this.getExpenses(direction);
          formArray.clear();
          for (let expense of expenses) {
            const formRecord = this.getExpenseFormGroup(expense.type);
            formRecord.patchValue(expense);
            if (expense.type === 'car') {
              formRecord.setControl(
                'passengers',
                this.formBuilder.array(expense.passengers)
              );
            }
            formArray.push(formRecord);
          }
        }
      }
    }

    // mark controls with values as touched
    this.deepMarkAsDirty(this.form);
  }

  saveForm() {
    // TODO: exclude file field?
    const data = JSON.stringify(this.form.value);
    localStorage.setItem('travelExpenses', data);
  }

  deleteStoredData(): void {
    localStorage.removeItem('travelExpenses');
    this.form.reset();
  }

  getExpense(value: ExpenseFormValue): Expense {
    return value as Expense;
  }

  getReimbursement(): Reimbursement {
    const v = this.form.getRawValue();

    return {
      course: v.course,
      participant: {
        ...v.participant,
        sectionId: v.participant.sectionId || 0
      },
      expenses: {
        inbound: v.expenses.inbound.map(this.getExpense),
        onsite: v.expenses.onsite.map(this.getExpense),
        outbound: v.expenses.outbound.map(this.getExpense)
      },
      note: v.overview.note
    };
  }

  getOriginCompletion(direction: Direction): string {
    const expenses = this.getExpenses(direction);

    if (expenses.length === 0) {
      return direction === 'inbound' ? '' : this.getOriginCompletion('inbound');
    }

    const lastExpense = expenses.getRawValue()[expenses.length - 1];
    return lastExpense.destination;
  }

  getCarTypeCompletion(): string {
    for (let direction of ['inbound', 'onsite', 'outbound'] as Direction[]) {
      const expenses = this.getExpenses(direction).getRawValue();
      const carExpense = expenses.find(
        expense => expense.carType !== undefined
      );
      if (carExpense) {
        return carExpense.carType || '';
      }
    }
    return '';
  }

  deepMarkAsDirty(parent: AbstractControl) {
    if (parent instanceof FormGroup) {
      Object.values(parent.controls).forEach(child =>
        this.deepMarkAsDirty(child)
      );
    } else if (parent instanceof FormArray) {
      parent.controls.forEach(child => this.deepMarkAsDirty(child));
    } else if (parent.value) {
      parent.markAsDirty();
      parent.markAsTouched();
    }
  }

  getDiscountCompletion(): string {
    for (let direction of ['inbound', 'onsite', 'outbound'] as Direction[]) {
      const expenses = this.getExpenses(direction).getRawValue();
      const trainExpense = expenses.find(
        expense => expense.discountCard !== undefined
      );
      if (trainExpense) {
        return trainExpense.discountCard || '';
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
      if (value.type === 'car') {
        control.setControl(
          'passengers',
          this.formBuilder.array(value.passengers!)
        );
      }
      outbound.push(control);
    }
  }

  private onIbanChanged(value: string) {
    const iban = this.participantStep.controls.iban;
    const bic = this.participantStep.controls.bic;
    const enable =
      iban.valid && (value.match(BIC_REQUIRED) || !value.match(SEPA_CODES));
    enable ? bic.enable() : bic.disable();
  }
}
