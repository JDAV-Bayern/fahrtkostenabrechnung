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
import {
  CarType,
  Direction,
  DiscountCard,
  TransportMode
} from 'src/domain/expense';
import { Reimbursement } from 'src/domain/reimbursement';
import { anyRequired } from './forms/validators/any-required.validator';
import { maxPlanExpenses } from './forms/validators/max-plan-expenses.validator';
import { validateCourseCode } from './forms/validators/course-code.validator';
import {
  DateRange,
  FoodExpenseForm,
  MaterialExpenseForm,
  MeetingForm,
  TransportExpenseForm
} from './reimbursement-forms';
import { Meeting, MeetingType } from 'src/domain/meeting';
import { ExpenseControlService } from './expense-control.service';

const PLZ_PATTERN = /^[0-9]{5}$/;
const BIC_PATTERN = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;

const SEPA_CODES =
  /^(BE|BG|DK|DE|EE|FI|FR|GR|GB|IE|IS|IT|HR|LV|LI|LT|LU|MT|MC|NL|NO|AT|PL|PT|RO|SM|SE|CH|SK|SI|ES|CZ|HU|CY)/;
const BIC_REQUIRED = /^(MC|SM|CH)/;

@Injectable({
  providedIn: 'root'
})
export class ReimbursementControlService {
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
      period: this.formBuilder.control<DateRange>(
        [null, null],
        Validators.required
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
        transport: this.formBuilder.group({
          inbound: this.formBuilder.array<FormGroup<TransportExpenseForm>>(
            [],
            maxPlanExpenses
          ),
          onsite: this.formBuilder.array<FormGroup<TransportExpenseForm>>([]),
          outbound: this.formBuilder.array<FormGroup<TransportExpenseForm>>(
            [],
            maxPlanExpenses
          )
        }),
        food: this.formBuilder.array<FormGroup<FoodExpenseForm>>([]),
        material: this.formBuilder.array<FormGroup<MaterialExpenseForm>>([])
      },
      { validators: anyRequired }
    ),
    overview: this.formBuilder.group({
      note: [''],
      file: [undefined]
    })
  });

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private expenseControlService: ExpenseControlService
  ) {
    this.form.valueChanges.subscribe(() => this.saveForm());

    const iban = this.participantStep.controls.iban;
    iban.valueChanges.subscribe(value => this.onIbanChanged(value));

    this.loadForm();
  }

  get participantStep() {
    return this.form.controls.participant;
  }

  get meetingStep() {
    return this.form.controls.meeting;
  }

  get transportExpensesStep() {
    return this.form.controls.expenses.controls.transport;
  }

  get foodExpensesStep() {
    return this.form.controls.expenses.controls.food;
  }

  get materialExpensesStep() {
    return this.form.controls.expenses.controls.material;
  }

  get overviewStep() {
    return this.form.controls.overview;
  }

  getTransportExpenses(direction: Direction) {
    return this.transportExpensesStep.controls[direction];
  }

  updateMeetingFormGroup(type: MeetingType) {
    const form = this.meetingStep;
    form.controls.type.setValue(type);

    switch (type) {
      case 'course':
        form.addControl('code', this.courseCodeControl);
        form.controls.location.disable();
        form.controls.period.disable();
        break;
      case 'assembly':
        form.removeControl('code');
        form.controls.location.disable();
        form.controls.period.disable();

        form.controls.name.setValue('Landesjugendversammlung');
        break;
      case 'committee':
        form.removeControl('code');
        form.controls.location.enable();
        form.controls.period.enable();
        break;
    }
  }

  loadForm() {
    console.log('Loading form values from local storage...');

    // parse JSON from local storage
    const storedData = localStorage.getItem('travelExpenses') || '{}';
    const storedValue = JSON.parse(storedData);

    // update meeting form group
    if (storedValue.meeting?.type) {
      this.updateMeetingFormGroup(storedValue.meeting.type);
    }

    // transport expenses
    if (storedValue.expenses?.transport) {
      for (let direction of ['inbound', 'onsite', 'outbound'] as Direction[]) {
        const expenses = storedValue.expenses.transport[direction];
        if (expenses) {
          this.transportExpensesStep.setControl(
            direction,
            this.formBuilder.array<FormGroup<TransportExpenseForm>>(
              expenses.map((expense: any) => {
                const formRecord =
                  this.expenseControlService.createTransportForm();
                this.expenseControlService.updateTransportForm(
                  formRecord,
                  expense.mode
                );
                formRecord.patchValue(expense);
                if (expense.mode === 'car' && expense.car?.passengers) {
                  formRecord.controls.car?.setControl(
                    'passengers',
                    this.formBuilder.array(
                      expense.car.passengers.map(
                        (passenger: string) =>
                          new FormControl(passenger, Validators.required)
                      )
                    )
                  );
                }
                return formRecord;
              })
            )
          );
        }
      }
    }

    // food expenses
    if (storedValue.expenses?.food) {
      const expenses = storedValue.expenses.food;
      this.form.controls.expenses.setControl(
        'food',
        this.formBuilder.array<FormGroup<FoodExpenseForm>>(
          expenses.map((expense: any) =>
            this.expenseControlService.createFoodForm()
          )
        )
      );
    }

    // material expenses
    if (storedValue.expenses?.material) {
      const expenses = storedValue.expenses.material;
      this.form.controls.expenses.setControl(
        'material',
        this.formBuilder.array<FormGroup<MaterialExpenseForm>>(
          expenses.map((expense: any) =>
            this.expenseControlService.createMaterialForm()
          )
        )
      );
    }

    this.form.patchValue(storedValue);

    // mark controls with values as touched
    this.deepMarkAsDirty(this.form);
  }

  saveForm() {
    // TODO: exclude file field?
    const data = JSON.stringify(this.form.value);
    localStorage.setItem('travelExpenses', data);
  }

  deleteStoredData(): void {
    this.form.reset();
    Object.values(this.transportExpensesStep.controls).forEach(expenses =>
      expenses.clear()
    );
    localStorage.removeItem('travelExpenses');
  }

  getReimbursement(): Reimbursement {
    const participant = this.participantStep.getRawValue();
    const transport = this.transportExpensesStep.getRawValue();
    const food = this.foodExpensesStep.getRawValue();
    const material = this.materialExpensesStep.getRawValue();

    return {
      meeting: this.meetingStep.value as Meeting,
      participant: {
        ...participant,
        sectionId: participant.sectionId || 0
      },
      expenses: {
        transport: {
          inbound: transport.inbound.map(value =>
            this.expenseControlService.getTransportExpense(value)
          ),
          onsite: transport.onsite.map(value =>
            this.expenseControlService.getTransportExpense(value)
          ),
          outbound: transport.outbound.map(value =>
            this.expenseControlService.getTransportExpense(value)
          )
        },
        food: food.map(value =>
          this.expenseControlService.getFoodExpense(value)
        ),
        material: material.map(value =>
          this.expenseControlService.getMaterialExpense(value)
        )
      },
      note: this.overviewStep.controls.note.value
    };
  }

  getOriginCompletion(direction: Direction): string {
    const expenses = this.getTransportExpenses(direction);

    if (expenses.length === 0) {
      return direction === 'inbound' ? '' : this.getOriginCompletion('inbound');
    }

    const lastExpense = expenses.getRawValue()[expenses.length - 1];
    return lastExpense.destination;
  }

  getCarTypeCompletion(): CarType {
    const transport = this.transportExpensesStep.getRawValue();
    for (let direction of Object.values(transport)) {
      for (let expense of direction) {
        if (expense.car) {
          return expense.car.type;
        }
      }
    }
    return 'combustion';
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

  getDiscountCompletion(): DiscountCard {
    const transport = this.transportExpensesStep.getRawValue();
    for (let direction of Object.values(transport)) {
      for (let expense of direction) {
        if (expense.train) {
          return expense.train.discountCard;
        }
      }
    }
    return 'none';
  }

  completeReturnTrip(): void {
    const values = this.getTransportExpenses('inbound').getRawValue();
    const outbound = this.getTransportExpenses('outbound');
    outbound.clear();

    for (let i = values.length - 1; i >= 0; i--) {
      const value = values[i];

      // swap origin and destination
      let temp = value.origin;
      value.origin = value.destination;
      value.destination = temp;

      const control = this.expenseControlService.createTransportForm();
      this.expenseControlService.updateTransportForm(
        control,
        value.mode as TransportMode
      );
      control.patchValue(value);

      if (value.mode === 'car') {
        control.controls.car?.setControl(
          'passengers',
          this.formBuilder.array(value.car?.passengers!)
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
