import { inject, Injectable } from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  Validators
} from '@angular/forms';
import { validateIBAN } from 'ngx-iban-validator';
import { map, Observable, startWith } from 'rxjs';
import { deepMarkAsDirty, reviveFormArrays } from 'src/app/shared/form-util';
import { anyRequired } from 'src/app/shared/validators/any-required.validator';
import { Address } from 'src/domain/address.model';
import {
  Direction,
  Discount,
  EngineType,
  FoodExpense,
  MaterialExpense,
  TransportExpense
} from 'src/domain/expense.model';
import { Committee, MeetingType } from 'src/domain/meeting.model';
import { Reimbursement } from 'src/domain/reimbursement.model';
import {
  orderedDateRange,
  pastDateRange,
  toInterval
} from '../../shared/validators/date-range.validator';
import {
  getFoodOptions,
  validateFoodExpenseInterval,
  validateFoodExpenseUnique,
  validateFoodExpenseWorkDay
} from './food.validator';
import { ReimbursementService } from './reimbursement.service';
import {
  allowedTransportModes,
  limitedTransportMode
} from './transport-mode.validator';

const BIC_PATTERN = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;

const SEPA_CODES =
  /^(BE|BG|DK|DE|EE|FI|FR|GR|GB|IE|IS|IT|HR|LV|LI|LT|LU|MT|MC|NL|NO|AT|PL|PT|RO|SM|SE|CH|SK|SI|ES|CZ|HU|CY)/;
const BIC_REQUIRED = /^(MC|SM|CH)/;

const DATE_KEYS = ['date', 'startDate', 'endDate'];

export interface TransportExpenseCompletion {
  origin?: string;
  engineType?: EngineType;
  discount?: Discount;
}

@Injectable({
  providedIn: 'root'
})
export class ReimbursementControlService {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly reimbursementService = inject(ReimbursementService);

  form = this.formBuilder.group(
    {
      meeting: this.formBuilder.group({
        type: this.formBuilder.control<MeetingType>(
          'course',
          Validators.required
        ),
        course: new FormControl<number | null>(null, Validators.required),
        committee: this.formBuilder.group({
          name: this.formBuilder.control('', Validators.required),
          location: this.formBuilder.control('', Validators.required),
          time: this.formBuilder.group(
            {
              startDate: new FormControl<Date | null>(
                null,
                Validators.required
              ),
              startTime: [0, Validators.required],
              endDate: new FormControl<Date | null>(null, Validators.required),
              endTime: [0, Validators.required]
            },
            { validators: [orderedDateRange, pastDateRange] }
          )
        })
      }),
      participant: this.formBuilder.group({
        givenName: ['', Validators.required],
        familyName: ['', Validators.required],
        sectionId: new FormControl<number | null>(null, Validators.required),
        email: ['', [Validators.required, Validators.email]],
        address: {} as Address,
        bankAccount: this.formBuilder.group({
          iban: ['', [Validators.required, validateIBAN]],
          bic: [
            { value: '', disabled: true },
            [Validators.required, Validators.pattern(BIC_PATTERN)]
          ]
        })
      }),
      expenses: this.formBuilder.group(
        {
          transport: this.formBuilder.group(
            {
              inbound: this.formBuilder.array<TransportExpense>(
                [],
                limitedTransportMode('plan', 1)
              ),
              onsite: this.formBuilder.array<TransportExpense>(
                [],
                allowedTransportModes(['car', 'public'])
              ),
              outbound: this.formBuilder.array<TransportExpense>(
                [],
                limitedTransportMode('plan', 1)
              )
            },
            { validators: anyRequired }
          ),
          food: this.formBuilder.array<FoodExpense>(
            [],
            [validateFoodExpenseUnique, validateFoodExpenseWorkDay]
          ),
          material: this.formBuilder.array<MaterialExpense>([])
        },
        { validators: anyRequired }
      ),
      overview: this.formBuilder.group({
        note: [''],
        file: [undefined]
      })
    },
    { validators: validateFoodExpenseInterval }
  );

  constructor() {
    this.form.valueChanges.subscribe(() => this.saveForm());

    const iban = this.participantStep.controls.bankAccount.controls.iban;
    iban.valueChanges.subscribe(value => this.onIbanChanged(value));

    const meetingType = this.meetingStep.controls.type;
    meetingType.valueChanges.subscribe(value => {
      this.onMeetingTypeChanged(value);
      this.reimbursementService.meetingType = value;
    });

    this.loadForm();
  }

  get meetingStep() {
    return this.form.controls.meeting;
  }

  get participantStep() {
    return this.form.controls.participant;
  }

  get expensesStep() {
    return this.form.controls.expenses;
  }

  get transportExpensesStep() {
    return this.form.controls.expenses.controls.transport;
  }

  get foodExpenses() {
    return this.form.controls.expenses.controls.food;
  }

  get materialExpenses() {
    return this.form.controls.expenses.controls.material;
  }

  get overviewStep() {
    return this.form.controls.overview;
  }

  getTransportExpenses(direction: Direction) {
    return this.transportExpensesStep.controls[direction];
  }

  loadForm() {
    console.log('Loading form values from local storage...');

    // parse JSON from local storage
    const storedData = localStorage.getItem('reimbursement') || '{}';
    const storedValue = JSON.parse(storedData, (key, value) =>
      DATE_KEYS.includes(key) ? new Date(value) : value
    );

    // add controls for form arrays
    reviveFormArrays(this.form, storedValue, () =>
      this.formBuilder.control({})
    );

    this.form.patchValue(storedValue);

    // mark controls with values as touched
    deepMarkAsDirty(this.form);
  }

  saveForm() {
    // TODO: exclude file field?
    const data = JSON.stringify(this.form.value);
    localStorage.setItem('reimbursement', data);
  }

  deleteStoredData(): void {
    this.form.reset();
    Object.values(this.transportExpensesStep.controls).forEach(expenses =>
      expenses.clear()
    );
    this.foodExpenses.clear();
    this.materialExpenses.clear();
    localStorage.removeItem('reimbursement');
  }

  private getCommittee(): Committee {
    const form = this.meetingStep.controls.committee;
    const interval = toInterval(form.controls.time);

    return {
      ...form.getRawValue(),
      startDate: (interval?.start as Date) || new Date(),
      endDate: (interval?.end as Date) || new Date()
    };
  }

  get reimbursement$(): Observable<Reimbursement> {
    return this.form.valueChanges.pipe(
      startWith(this.getReimbursement()),
      map(() => this.getReimbursement())
    );
  }

  getReimbursement(): Reimbursement {
    const participant = this.participantStep.getRawValue();

    const reimbursement = {
      participant: {
        ...participant,
        sectionId: participant.sectionId || 0
      },
      expenses: this.expensesStep.getRawValue(),
      note: this.overviewStep.controls.note.value
    };

    const type = this.meetingStep.controls.type.value;
    switch (type) {
      case 'course':
        return {
          ...reimbursement,
          type,
          course: this.meetingStep.controls.course.value || 0
        };
      case 'committee':
        return {
          ...reimbursement,
          type,
          committee: this.getCommittee()
        };
    }
  }

  completeTransportExpense(direction: Direction): TransportExpenseCompletion {
    const transport = this.transportExpensesStep.getRawValue();
    const expenses = Object.values(transport).flat();

    const origin = this.completeOrigin(direction);
    const engineType = expenses.find(e => e.mode === 'car')?.carTrip.engineType;
    const discount = expenses.find(e => e.mode === 'public')?.ticket.discount;

    return { origin, engineType, discount };
  }

  completeReturnTrip(): void {
    const values = this.getTransportExpenses('inbound').getRawValue();
    const outbound = this.getTransportExpenses('outbound');
    outbound.clear();

    for (let i = values.length - 1; i >= 0; i--) {
      const value = values[i];

      // swap origin and destination
      const control = this.formBuilder.control({} as TransportExpense);
      control.setValue({
        ...value,
        origin: value.destination,
        destination: value.origin
      });

      outbound.push(control);
    }
  }

  completeFood(): void {
    this.foodExpenses.clear();
    const committee = this.meetingStep.controls.committee;
    const interval = toInterval(committee.controls.time);
    const foodOpts = interval ? getFoodOptions(interval) : [];

    for (const foodOpt of foodOpts) {
      if (foodOpt.absence !== null) {
        const form = this.formBuilder.control({} as FoodExpense);
        form.setValue({
          type: 'food',
          date: foodOpt.date,
          absence: foodOpt.absence,
          breakfast: false,
          lunch: false,
          dinner: false
        });
        this.foodExpenses.push(form);
      }
    }
  }

  private completeOrigin(direction: Direction): string {
    const expenses = this.getTransportExpenses(direction);

    if (expenses.length === 0) {
      return direction === 'inbound' ? '' : this.completeOrigin('inbound');
    }

    const lastExpense = expenses.getRawValue()[expenses.length - 1];
    return lastExpense.destination;
  }

  private onMeetingTypeChanged(value: MeetingType) {
    const form = this.meetingStep;
    const transport = this.transportExpensesStep;
    switch (value) {
      case 'course':
        form.controls.course.enable();
        form.controls.committee.disable();
        transport.setValidators(anyRequired);
        break;
      case 'committee':
        form.controls.course.disable();
        form.controls.committee.enable();
        transport.clearValidators();
        break;
    }

    transport.updateValueAndValidity();
  }

  private onIbanChanged(value: string) {
    const iban = this.participantStep.controls.bankAccount.controls.iban;
    const bic = this.participantStep.controls.bankAccount.controls.bic;
    const enable =
      iban.valid && (value.match(BIC_REQUIRED) || !value.match(SEPA_CODES));

    if (enable) {
      bic.enable();
    } else {
      bic.disable();
    }
  }
}
