import { Injectable, inject } from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  Validators
} from '@angular/forms';
import { eachDayOfInterval } from 'date-fns';
import { validateIBAN } from 'ngx-iban-validator';
import { deepMarkAsDirty, reviveFormArrays } from 'src/app/shared/form-util';
import { anyRequired } from 'src/app/shared/validators/any-required.validator';
import {
  Direction,
  Discount,
  EngineType,
  FoodExpense,
  MaterialExpense,
  TransportExpense
} from 'src/domain/expense.model';
import { Meeting, MeetingType } from 'src/domain/meeting.model';
import { Reimbursement } from 'src/domain/reimbursement.model';
import { validateCourseCode } from '../../shared/validators/course-code.validator';
import {
  orderedDateRange,
  pastDateRange
} from '../../shared/validators/date-range.validator';
import { MeetingForm } from './meeting-form';
import { ReimbursementService } from './reimbursement.service';
import {
  allowedTransportModes,
  limitedTransportMode
} from './transport-mode.validator';

const LOCAL_STORAGE_KEY_REIMBURSEMENT = 'reimbursement';
const LOCAL_STORAGE_KEY_SETTINGS = 'settings';

const PLZ_PATTERN = /^[0-9]{4,5}$/;
const BIC_PATTERN = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;

const SEPA_CODES =
  /^(BE|BG|DK|DE|EE|FI|FR|GR|GB|IE|IS|IT|HR|LV|LI|LT|LU|MT|MC|NL|NO|AT|PL|PT|RO|SM|SE|CH|SK|SI|ES|CZ|HU|CY)/;
const BIC_REQUIRED = /^(MC|SM|CH)/;

const DATE_KEYS = ['date', 'start', 'end'];

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

  private courseCodeControl = this.formBuilder.control('', [
    Validators.required,
    validateCourseCode
  ]);
  form = this.formBuilder.group({
    meeting: this.formBuilder.group<MeetingForm>({
      type: this.formBuilder.control<MeetingType>(
        'course',
        Validators.required
      ),
      name: this.formBuilder.control('', Validators.required),
      location: this.formBuilder.control('', Validators.required),
      time: this.formBuilder.group(
        {
          start: new FormControl<Date | null>(null, Validators.required),
          end: new FormControl<Date | null>(null, Validators.required)
        },
        { validators: [orderedDateRange, pastDateRange] }
      ),
      code: this.courseCodeControl
    }),
    participant: this.formBuilder.group({
      givenName: ['', Validators.required],
      familyName: ['', Validators.required],
      sectionId: new FormControl<number | null>(null, Validators.required),
      zipCode: ['', [Validators.required, Validators.pattern(PLZ_PATTERN)]],
      city: ['', Validators.required],
      iban: ['', [Validators.required, validateIBAN]],
      bic: [
        { value: '', disabled: true },
        [Validators.required, Validators.pattern(BIC_PATTERN)]
      ]
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
        food: this.formBuilder.array<FoodExpense>([]),
        material: this.formBuilder.array<MaterialExpense>([])
      },
      { validators: anyRequired }
    ),
    overview: this.formBuilder.group({
      note: [''],
      file: [undefined]
    })
  });

  // local state not included in the final data
  foodSettings = this.formBuilder.group({
    isEnabled: [false],
    isOvernight: [false]
  });

  constructor() {
    this.form.valueChanges.subscribe(() => this.saveForm());

    const iban = this.participantStep.controls.iban;
    iban.valueChanges.subscribe(value => this.onIbanChanged(value));

    const meetingType = this.meetingStep.controls.type;
    meetingType.valueChanges.subscribe(value => {
      this.onMeetingTypeChanged(value);
      this.reimbursementService.meetingType = value;
    });

    const meetingTime = this.meetingStep.controls.time;
    meetingTime.valueChanges.subscribe(value =>
      this.onMeetingTimeChanged(value)
    );

    this.foodSettings.valueChanges.subscribe(value =>
      this.onFoodSettingsChanged(value)
    );

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

    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY_REIMBURSEMENT);
    const settingsData = localStorage.getItem(LOCAL_STORAGE_KEY_SETTINGS);

    if (storedData) {
      // parse JSON from local storage
      const storedValue = JSON.parse(storedData, (key, value) =>
        value && DATE_KEYS.includes(key) ? new Date(value) : value
      );

      // add controls for form arrays
      reviveFormArrays(this.form, storedValue, () =>
        this.formBuilder.control({})
      );

      this.form.patchValue(storedValue);

      // mark controls with values as touched
      deepMarkAsDirty(this.form);
    }

    if (settingsData) {
      const settingsValue = JSON.parse(settingsData);
      this.foodSettings.patchValue(settingsValue);
    }
  }

  saveForm() {
    // TODO: exclude file field?
    const data = JSON.stringify(this.form.value);
    localStorage.setItem(LOCAL_STORAGE_KEY_REIMBURSEMENT, data);

    // save food settings
    const foodSettingsData = JSON.stringify(this.foodSettings.value);
    localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, foodSettingsData);
  }

  deleteStoredData(): void {
    this.form.reset();
    Object.values(this.transportExpensesStep.controls).forEach(expenses =>
      expenses.clear()
    );
    this.foodExpenses.clear();
    this.materialExpenses.clear();
    this.foodSettings.reset();
    localStorage.removeItem(LOCAL_STORAGE_KEY_REIMBURSEMENT);
    localStorage.removeItem(LOCAL_STORAGE_KEY_SETTINGS);
  }

  getMeeting(): Meeting {
    const meeting = this.meetingStep.value as Meeting;

    if (meeting.type === 'committee') {
      meeting.time = {
        start: meeting.time.start || new Date(NaN),
        end: meeting.time.end || new Date(NaN)
      };
    }

    return meeting;
  }

  getReimbursement(): Reimbursement {
    const participant = this.participantStep.getRawValue();

    return {
      meeting: this.getMeeting(),
      participant: {
        ...participant,
        sectionId: participant.sectionId || 0
      },
      expenses: {
        transport: this.transportExpensesStep.getRawValue(),
        food: this.foodExpenses.enabled ? this.foodExpenses.value : [],
        material: this.materialExpenses.enabled
          ? this.materialExpenses.value
          : []
      },
      note: this.overviewStep.controls.note.value
    };
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
        form.addControl('code', this.courseCodeControl);
        form.controls.location.disable();
        form.controls.time.disable();
        transport.setValidators(anyRequired);
        break;
      case 'assembly':
        form.removeControl('code');
        form.controls.location.disable();
        form.controls.time.disable();
        transport.setValidators(anyRequired);

        form.controls.name.setValue('Landesjugendversammlung');
        break;
      case 'committee':
        form.removeControl('code');
        form.controls.location.enable();
        form.controls.time.enable();
        transport.clearValidators();
        break;
    }

    transport.updateValueAndValidity();
  }

  private onIbanChanged(value: string) {
    const iban = this.participantStep.controls.iban;
    const bic = this.participantStep.controls.bic;
    const enable =
      iban.valid && (value.match(BIC_REQUIRED) || !value.match(SEPA_CODES));

    if (enable) {
      bic.enable();
    } else {
      bic.disable();
    }
  }

  private onMeetingTimeChanged(value: {
    start?: Date | null;
    end?: Date | null;
  }) {
    const overnightControl = this.foodSettings.controls.isOvernight;
    // update overnight checkbox visibility
    if (value.start && value.end) {
      const days = eachDayOfInterval({ start: value.start, end: value.end });
      if (days.length === 2) {
        overnightControl.enable();
      } else {
        overnightControl.disable();
      }
    }

    this.updateFoodExpenses(value, overnightControl.value);
  }

  private onFoodSettingsChanged(value: {
    isEnabled?: boolean;
    isOvernight?: boolean;
  }) {
    this.updateFoodExpenses(
      this.meetingStep.controls.time.value,
      value.isOvernight
    );
    this.saveForm();
  }

  private updateFoodExpenses(
    time: {
      start?: Date | null;
      end?: Date | null;
    },
    isOvernight?: boolean
  ) {
    // update food expenses
    if (!time.start || !time.end) {
      return;
    }

    const expenses = this.reimbursementService.getFoodExpenses(
      { start: time.start, end: time.end },
      isOvernight || false
    );
    this.foodExpenses.clear();

    for (const expense of expenses) {
      const form = this.formBuilder.control(expense);
      this.foodExpenses.push(form);
    }

    if (this.foodSettings.controls.isEnabled.value) {
      this.foodExpenses.enable();
    } else {
      this.foodExpenses.disable();
    }
  }
}
