import {
  computed,
  effect,
  inject,
  Injectable,
  signal,
  untracked,
} from '@angular/core';
import { form, hidden } from '@angular/forms/signals';
import { eachDayOfInterval } from 'date-fns';
import {
  CarExpense,
  Direction,
  Discount,
  EngineType,
  FoodExpense,
  PublicTransportExpense,
} from 'src/domain/expense.model';
import { MeetingType } from 'src/domain/meeting.model';
import { markFilledAsTouched, mergeDefaults } from './form-restore';
import { toReimbursement } from './reimbursement-form.mapper';
import {
  FoodSettings,
  initialFoodSettings,
  initialFormModel,
} from './reimbursement-form.model';
import { reimbursementSchema } from './reimbursement-form.schema';
import { ReimbursementService } from './reimbursement.service';

const LOCAL_STORAGE_KEY_REIMBURSEMENT = 'reimbursement';
const LOCAL_STORAGE_KEY_SETTINGS = 'settings';

const DATE_KEYS = ['date', 'start', 'end'];

export interface TransportExpenseCompletion {
  origin?: string;
  engineType?: EngineType;
  discount?: Discount;
}

/**
 * The state of the reimbursement wizard: the form model, the form on top of
 * it, local settings and everything that is derived from them.
 */
@Injectable({
  providedIn: 'root',
})
export class ReimbursementFormService {
  private readonly reimbursementService = inject(ReimbursementService);

  readonly model = signal(initialFormModel());

  // local state not included in the final data
  readonly foodSettings = signal(initialFoodSettings());
  readonly files = signal<File[]>([]);

  readonly foodEnabled = computed(
    () =>
      this.model().meeting.type === 'committee' &&
      this.foodSettings().isEnabled,
  );

  readonly reimbursement = computed(() =>
    toReimbursement(this.model(), this.foodEnabled()),
  );
  readonly report = computed(() =>
    this.reimbursementService.getReport(this.reimbursement()),
  );
  readonly total = computed(() => this.report().total);

  readonly form = form(this.model, reimbursementSchema({ total: this.total }));

  private readonly meetingType = computed(() => this.model().meeting.type);
  private readonly meetingTime = computed(() => this.model().meeting.time, {
    equal: (a, b) =>
      a.start?.getTime() === b.start?.getTime() &&
      a.end?.getTime() === b.end?.getTime(),
  });
  private readonly isOvernight = computed(
    () => this.foodSettings().isOvernight,
  );

  /** A stay overnight only makes a difference for meetings spanning two days. */
  private readonly overnightPossible = computed(() => {
    const { start, end } = this.meetingTime();
    return !start || !end || eachDayOfInterval({ start, end }).length === 2;
  });

  readonly foodSettingsForm = form(this.foodSettings, (settings) =>
    hidden(settings.isOvernight, { when: () => !this.overnightPossible() }),
  );

  constructor() {
    // the data has to be restored before the changes are stored
    this.load();

    effect(() => this.persist(this.model(), this.foodSettings()));

    // the expense config depends on the meeting type
    let configuredType: MeetingType = 'course'; // loaded by the ReimbursementService
    effect(() => {
      const type = this.meetingType();
      if (type !== configuredType) {
        configuredType = type;
        this.reimbursementService.meetingType = type;
      }
    });

    effect(() => {
      const { start, end } = this.meetingTime();
      const isOvernight = this.isOvernight();
      untracked(() => this.updateFoodExpenses(start, end, isOvernight));
    });
  }

  transportExpenses(direction: Direction) {
    return this.form.expenses.transport[direction];
  }

  completeTransportExpense(direction: Direction): TransportExpenseCompletion {
    const expenses = Object.values(this.model().expenses.transport).flat();

    const origin = this.completeOrigin(direction);
    const engineType = expenses.find(
      (expense): expense is CarExpense => expense.mode === 'car',
    )?.carTrip.engineType;
    const discount = expenses.find(
      (expense): expense is PublicTransportExpense => expense.mode === 'public',
    )?.ticket.discount;

    return { origin, engineType, discount };
  }

  completeReturnTrip(): void {
    this.model.update((model) => {
      const outbound = [...model.expenses.transport.inbound]
        .reverse()
        // swap origin and destination
        .map((expense) => ({
          ...expense,
          origin: expense.destination,
          destination: expense.origin,
        }));

      return {
        ...model,
        expenses: {
          ...model.expenses,
          transport: { ...model.expenses.transport, outbound },
        },
      };
    });
  }

  deleteStoredData(): void {
    this.model.set(initialFormModel());
    this.foodSettings.set(initialFoodSettings());
    this.files.set([]);
    this.form().reset();
    this.foodSettingsForm().reset();

    localStorage.removeItem(LOCAL_STORAGE_KEY_REIMBURSEMENT);
    localStorage.removeItem(LOCAL_STORAGE_KEY_SETTINGS);
  }

  private load() {
    console.log('Loading form values from local storage...');

    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY_REIMBURSEMENT);
    const settingsData = localStorage.getItem(LOCAL_STORAGE_KEY_SETTINGS);

    if (settingsData) {
      this.foodSettings.set(
        mergeDefaults(initialFoodSettings(), JSON.parse(settingsData)),
      );
    }

    if (storedData) {
      // parse JSON from local storage
      const storedValue = JSON.parse(storedData, (key, value) =>
        value && DATE_KEYS.includes(key) ? new Date(value) : value,
      );

      const restored = mergeDefaults(initialFormModel(), storedValue);
      this.model.set(restored);

      // show the errors of the restored values
      markFilledAsTouched(this.form.meeting, restored.meeting);
      markFilledAsTouched(this.form.participant, restored.participant);
      markFilledAsTouched(this.form.overview, restored.overview);
    }
  }

  /** Stores the data, or removes it if nothing was entered. */
  private persist(model: unknown, settings: FoodSettings) {
    const store = (key: string, value: unknown, initial: unknown) => {
      const data = JSON.stringify(value);
      if (data === JSON.stringify(initial)) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, data);
      }
    };

    store(LOCAL_STORAGE_KEY_REIMBURSEMENT, model, initialFormModel());
    store(LOCAL_STORAGE_KEY_SETTINGS, settings, initialFoodSettings());
  }

  private completeOrigin(direction: Direction): string {
    const expenses = this.model().expenses.transport[direction];

    if (expenses.length === 0) {
      return direction === 'inbound' ? '' : this.completeOrigin('inbound');
    }

    return expenses[expenses.length - 1].destination;
  }

  private updateFoodExpenses(
    start: Date | null,
    end: Date | null,
    isOvernight: boolean,
  ) {
    if (!start || !end) {
      return;
    }

    const expenses = this.reimbursementService.getFoodExpenses(
      { start, end },
      isOvernight,
    );

    // keep the selected meals if nothing changed (e.g. after the stored form
    // was restored)
    if (!this.foodExpensesMatch(expenses)) {
      this.model.update((model) => ({
        ...model,
        expenses: { ...model.expenses, food: expenses },
      }));
    }
  }

  private foodExpensesMatch(expenses: FoodExpense[]): boolean {
    const current = this.model().expenses.food;

    return (
      current.length === expenses.length &&
      current.every(
        (value, i) =>
          new Date(value.date).getTime() === expenses[i].date.getTime() &&
          value.absence === expenses[i].absence,
      )
    );
  }
}
