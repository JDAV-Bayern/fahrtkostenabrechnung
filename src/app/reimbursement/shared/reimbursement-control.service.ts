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
import { Direction } from 'src/domain/expense.model';
import { Reimbursement } from 'src/domain/reimbursement.model';
import { maxPlanExpenses } from './max-plan-expenses.validator';
import { validateCourseCode } from './course-code.validator';
import { Meeting, MeetingType } from 'src/domain/meeting.model';
import { MeetingForm } from './meeting-form';
import { ReimbursementService } from './reimbursement.service';
import { ExpenseControlService } from 'src/app/expenses/shared/expense-control.service';
import {
  TransportExpenseForm,
  FoodExpenseForm,
  MaterialExpenseForm
} from 'src/app/expenses/shared/expense-form';
import { anyRequired } from 'src/app/shared/any-required.validator';
import { FormValue } from 'src/app/shared/form-value';

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
      time: this.formBuilder.group({
        startDate: new FormControl<Date | null>(null, Validators.required),
        startTime: [0, Validators.required],
        endDate: new FormControl<Date | null>(null, Validators.required),
        endTime: [0, Validators.required]
      }),
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
            inbound: this.formBuilder.array<FormGroup<TransportExpenseForm>>(
              [],
              maxPlanExpenses
            ),
            onsite: this.formBuilder.array<FormGroup<TransportExpenseForm>>([]),
            outbound: this.formBuilder.array<FormGroup<TransportExpenseForm>>(
              [],
              maxPlanExpenses
            )
          },
          { validators: anyRequired }
        ),
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
    private expenseControlService: ExpenseControlService,
    private reimbursementService: ReimbursementService
  ) {
    this.form.valueChanges.subscribe(() => this.saveForm());

    const iban = this.participantStep.controls.iban;
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
    const storedValue: FormValue<typeof this.form> = JSON.parse(storedData, (key, value) => {
      if (key === 'date' || key === 'startDate' || key === 'endDate') {
        return new Date(value);
      }
      return value;
    });

    // add transport expense controls
    if (storedValue.expenses?.transport) {
      for (let direction of ['inbound', 'onsite', 'outbound'] as Direction[]) {
        const expenses = storedValue.expenses.transport[direction];
        if (expenses) {
          this.transportExpensesStep.setControl(
            direction,
            this.formBuilder.array<FormGroup<TransportExpenseForm>>(
              expenses.map(expense => this.copyTransportForm(expense))
            )
          );
        }
      }
    }

    // add food expense controls
    if (storedValue.expenses?.food) {
      const expenses = storedValue.expenses.food;
      this.form.controls.expenses.setControl(
        'food',
        this.formBuilder.array<FormGroup<FoodExpenseForm>>(
          expenses.map(() => this.expenseControlService.createFoodForm())
        )
      );
    }

    // add material expense controls
    if (storedValue.expenses?.material) {
      const expenses = storedValue.expenses.material;
      this.form.controls.expenses.setControl(
        'material',
        this.formBuilder.array<FormGroup<MaterialExpenseForm>>(
          expenses.map(() => this.expenseControlService.createMaterialForm())
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
    localStorage.setItem('reimbursement', data);
  }

  deleteStoredData(): void {
    this.form.reset();
    Object.values(this.transportExpensesStep.controls).forEach(expenses =>
      expenses.clear()
    );
    localStorage.removeItem('reimbursement');
  }

  getReimbursement(): Reimbursement {
    const meetingValue = this.meetingStep.value;
    const participant = this.participantStep.getRawValue();
    const transport = this.transportExpensesStep.getRawValue();
    const food = this.foodExpenses.getRawValue();
    const material = this.materialExpenses.getRawValue();

    let meeting;
    if (meetingValue.time) {
      const time = this.meetingStep.controls.time.getRawValue();

      let start = time.startDate || new Date();
      let end = time.endDate || new Date();
      start = new Date(start.getTime() + time.startTime);
      end = new Date(end.getTime() + time.endTime);

      meeting = {
        ...meetingValue,
        time: { start, end }
      };
    } else {
      meeting = meetingValue;
    }


    return {
      meeting: meeting as Meeting,
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

  completeTransportExpense(
    direction: Direction,
    form: FormGroup<TransportExpenseForm>
  ) {
    const transport = this.transportExpensesStep.getRawValue();
    const expenses = Object.values(transport).flat();

    // auto-complete origin
    const origin = this.completeOrigin(direction);
    form.controls.origin.setValue(origin);

    // auto-complete car type
    const car = form.controls.car;
    if (car) {
      for (let expense of expenses) {
        if (expense.car) {
          car.controls.type.setValue(expense.car.type);
          break;
        }
      }
    }

    // auto-complete discount card
    const train = form.controls.train;
    if (train) {
      for (let expense of expenses) {
        if (expense.train) {
          train.controls.discountCard.setValue(expense.train.discountCard);
          break;
        }
      }
    }
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

      const control = this.copyTransportForm(value);
      control.patchValue(value);
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
  }

  private onIbanChanged(value: string) {
    const iban = this.participantStep.controls.iban;
    const bic = this.participantStep.controls.bic;
    const enable =
      iban.valid && (value.match(BIC_REQUIRED) || !value.match(SEPA_CODES));
    enable ? bic.enable() : bic.disable();
  }

  private copyTransportForm(original: FormValue<TransportExpenseForm>) {
    const form = this.expenseControlService.createTransportForm();

    // create passenger controls
    if (original.mode === 'car' && original.car?.passengers) {
      form.controls.car?.setControl(
        'passengers',
        this.formBuilder.array(
          original.car.passengers.map(() =>
            this.formBuilder.control('', Validators.required)
          )
        )
      );
    }

    return form;
  }
}
