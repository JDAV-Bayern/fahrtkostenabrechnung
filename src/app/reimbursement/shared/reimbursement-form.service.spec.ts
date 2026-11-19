import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import {
  Direction,
  MaterialExpense,
  TransportExpense,
} from 'src/domain/expense.model';
import { ExpenseConfig } from '../expenses/expense.config';
import { ExpenseConfigService } from '../expenses/shared/expense-config.service';
import { ReimbursementFormService } from './reimbursement-form.service';

const STORAGE_KEY = 'reimbursement';
const SETTINGS_KEY = 'settings';

const config: ExpenseConfig = {
  allowed: ['transport', 'food', 'material'],
  transport: {
    car: [0.3],
    public: { none: 1, BC25: 0.75, BC50: 0.5 },
    plan: 10,
    bike: 0.1,
  },
  food: { arrival: 14, return: 14, intermediate: 28, single: 14 },
};

const DE_IBAN = 'DE02120300000000202051';

const car = (
  origin: string,
  destination: string,
  engineType: 'combustion' | 'electric' = 'combustion',
): TransportExpense => ({
  type: 'transport',
  mode: 'car',
  origin,
  destination,
  distance: 10,
  carTrip: { engineType, passengers: [] },
});

const publicTransport = (
  origin: string,
  destination: string,
  discount: 'none' | 'BC25' | 'BC50' = 'none',
): TransportExpense => ({
  type: 'transport',
  mode: 'public',
  origin,
  destination,
  ticket: { discount, price: 20 },
});

const material = (amount: number): MaterialExpense => ({
  type: 'material',
  date: new Date(2025, 0, 1),
  purpose: 'Material',
  amount,
});

const getConfig = vi.fn<(type: string) => Observable<ExpenseConfig>>(() =>
  of(config),
);

// The expense config is stubbed, so the service never touches the network.
function createService() {
  TestBed.configureTestingModule({
    providers: [{ provide: ExpenseConfigService, useValue: { getConfig } }],
  });
  return TestBed.inject(ReimbursementFormService);
}

/** Runs the effects (storing the data, regenerating food expenses, ...). */
const settle = () => TestBed.tick();

describe('ReimbursementFormService', () => {
  let service: ReimbursementFormService;

  const addTransport = (
    direction: Direction,
    ...expenses: TransportExpense[]
  ) =>
    service
      .transportExpenses(direction)()
      .value.update((list) => [...list, ...expenses]);

  const absences = () =>
    service.model().expenses.food.map((expense) => expense.absence);

  beforeEach(() => {
    localStorage.clear();
    getConfig.mockClear();
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
    service = createService();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('BIC', () => {
    it('should be part of the reimbursement for non-SEPA IBANs', () => {
      service.form.participant.iban().value.set('CH9300762011623852957');
      service.form.participant.bic().value.set('UBSWCHZH80A');
      expect(service.reimbursement().participant.bic).toBe('UBSWCHZH80A');
    });

    it('should be empty in the reimbursement for SEPA IBANs', () => {
      service.form.participant.iban().value.set(DE_IBAN);
      expect(service.reimbursement().participant.bic).toBe('');
    });
  });

  describe('meeting type', () => {
    it('should load the expense config of the meeting type', () => {
      // the services load the config of courses on their own
      const callsAtStart = getConfig.mock.calls.length;
      settle();
      expect(getConfig).toHaveBeenCalledTimes(callsAtStart);

      service.form.meeting.type().value.set('committee');
      settle();
      expect(getConfig).toHaveBeenCalledWith('committee');
    });

    it('should not enable food reimbursement for courses', () => {
      service.form.meeting.type().value.set('committee');
      service.foodSettingsForm.isEnabled().value.set(true);
      expect(service.foodEnabled()).toBe(true);

      service.form.meeting.type().value.set('course');
      expect(service.foodEnabled()).toBe(false);
    });

    it('should enable food reimbursement for committees if selected', () => {
      service.foodSettingsForm.isEnabled().value.set(true);
      service.form.meeting.type().value.set('committee');
      expect(service.foodEnabled()).toBe(true);
    });

    it('should keep food reimbursement disabled for committees if not selected', () => {
      service.form.meeting.type().value.set('committee');
      expect(service.foodEnabled()).toBe(false);
    });
  });

  describe('food expenses', () => {
    const day = (d: number, h = 0) => new Date(2025, 0, d, h);

    const setTime = (start: Date, end: Date) => {
      service.form.meeting.time().value.set({ start, end });
      settle();
    };

    beforeEach(() => {
      service.form.meeting.type().value.set('committee');
    });

    it('should be generated from the meeting time', () => {
      setTime(day(1, 12), day(3, 12));
      expect(absences()).toEqual(['arrival', 'intermediate', 'return']);
    });

    it('should be regenerated when the meeting time changes', () => {
      setTime(day(1, 12), day(3, 12));
      setTime(day(1, 12), day(5, 12));
      expect(service.model().expenses.food).toHaveLength(5);
    });

    it('should be empty for meetings shorter than 8 hours', () => {
      setTime(day(1, 10), day(1, 12));
      expect(service.model().expenses.food).toHaveLength(0);
    });

    it('should keep the selected meals if the time stays the same', () => {
      setTime(day(1, 12), day(3, 12));
      service.form.expenses.food[1].breakfast().value.set(true);

      setTime(day(1, 12), day(3, 12));
      service.form.meeting.time().value.set({
        start: new Date(day(1, 12)),
        end: new Date(day(3, 12)),
      });
      settle();

      expect(service.model().expenses.food.map((e) => e.breakfast)).toEqual([
        false,
        true,
        false,
      ]);
    });

    it('should only be part of the reimbursement when enabled', () => {
      setTime(day(1, 12), day(3, 12));
      expect(service.reimbursement().expenses.food).toEqual([]);

      service.foodSettingsForm.isEnabled().value.set(true);
      expect(service.reimbursement().expenses.food).toHaveLength(3);

      service.foodSettingsForm.isEnabled().value.set(false);
      expect(service.reimbursement().expenses.food).toEqual([]);
    });

    it('should not be part of the reimbursement for courses', () => {
      service.foodSettingsForm.isEnabled().value.set(true);
      setTime(day(1, 12), day(3, 12));
      service.form.meeting.type().value.set('course');
      expect(service.reimbursement().expenses.food).toEqual([]);
    });

    describe('overnight stay', () => {
      const overnight = () => service.foodSettingsForm.isOvernight;

      it('should only be available for meetings spanning two days', () => {
        setTime(day(1, 20), day(2, 10));
        expect(overnight()().hidden()).toBe(false);

        setTime(day(1, 12), day(3, 12));
        expect(overnight()().hidden()).toBe(true);

        setTime(day(1, 10), day(1, 20));
        expect(overnight()().hidden()).toBe(true);
      });

      it('should change the generated expenses for two-day meetings', () => {
        setTime(day(1, 20), day(2, 10));
        expect(absences()).toEqual(['single']);

        overnight()().value.set(true);
        settle();
        expect(absences()).toEqual(['arrival', 'return']);

        overnight()().value.set(false);
        settle();
        expect(absences()).toEqual(['single']);
      });
    });
  });

  describe('trip completion', () => {
    describe('completeTransportExpense', () => {
      it('should suggest nothing for the first expense', () => {
        expect(service.completeTransportExpense('inbound')).toEqual({
          origin: '',
          engineType: undefined,
          discount: undefined,
        });
      });

      it('should continue from the last destination of the direction', () => {
        addTransport('inbound', car('A', 'B'), car('B', 'C'));
        expect(service.completeTransportExpense('inbound').origin).toBe('C');
      });

      it('should start onsite trips at the end of the inbound trip', () => {
        addTransport('inbound', car('A', 'B'), car('B', 'C'));
        expect(service.completeTransportExpense('onsite').origin).toBe('C');
      });

      it('should start the outbound trip at the end of the outbound trips so far', () => {
        addTransport('inbound', car('A', 'B'));
        addTransport('outbound', car('B', 'D'));
        expect(service.completeTransportExpense('outbound').origin).toBe('D');
      });

      it('should start the outbound trip at the inbound destination without outbound trips', () => {
        addTransport('inbound', car('A', 'B'));
        expect(service.completeTransportExpense('outbound').origin).toBe('B');
      });

      it('should reuse the engine type and discount from earlier expenses', () => {
        addTransport('inbound', car('A', 'B', 'electric'));
        addTransport('onsite', publicTransport('B', 'C', 'BC25'));

        expect(service.completeTransportExpense('outbound')).toMatchObject({
          engineType: 'electric',
          discount: 'BC25',
        });
      });
    });

    describe('completeReturnTrip', () => {
      it('should reverse the inbound trip', () => {
        const first = car('A', 'B');
        const second = publicTransport('B', 'C', 'BC50');
        addTransport('inbound', first, second);

        service.completeReturnTrip();

        expect(service.model().expenses.transport.outbound).toEqual([
          { ...second, origin: 'C', destination: 'B' },
          { ...first, origin: 'B', destination: 'A' },
        ]);
      });

      it('should replace existing outbound expenses', () => {
        addTransport('inbound', car('A', 'B'));
        addTransport('outbound', car('X', 'Y'), car('Y', 'Z'));

        service.completeReturnTrip();

        const { outbound } = service.model().expenses.transport;
        expect(outbound).toHaveLength(1);
        expect(outbound[0]).toMatchObject({ origin: 'B', destination: 'A' });
      });

      it('should clear the outbound trip if there is no inbound trip', () => {
        addTransport('outbound', car('X', 'Y'));
        service.completeReturnTrip();
        expect(service.model().expenses.transport.outbound).toHaveLength(0);
      });

      it('should not modify the inbound trip', () => {
        addTransport('inbound', car('A', 'B'));
        service.completeReturnTrip();
        expect(service.model().expenses.transport.inbound).toEqual([
          car('A', 'B'),
        ]);
      });
    });
  });

  describe('expenses step guard', () => {
    const guard = () => service.form.expenses().getError('totalRequired');

    it('should be invalid without any reimbursable expense', () => {
      expect(guard()).toBeDefined();
      expect(service.total()).toBe(0);
    });

    it('should become valid with a reimbursable expense', () => {
      service.form.expenses.material().value.set([material(10)]);
      expect(guard()).toBeUndefined();
    });

    it('should become invalid again when the expenses are removed', () => {
      service.form.expenses.material().value.set([material(10)]);
      service.form.expenses.material().value.set([]);
      expect(guard()).toBeDefined();
    });

    it('should count transport expenses', () => {
      addTransport('inbound', car('A', 'B'));
      expect(guard()).toBeUndefined();
    });

    it('should not affect the transport step', () => {
      expect(service.form.expenses.transport().valid()).toBe(true);
    });
  });

  describe('local storage', () => {
    it('should not store anything before data was entered', () => {
      settle();
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
      expect(localStorage.getItem(SETTINGS_KEY)).toBeNull();
    });

    it('should save the form on changes', () => {
      service.form.participant.givenName().value.set('Max');
      settle();
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(stored.participant.givenName).toBe('Max');
    });

    it('should save the food settings', () => {
      service.foodSettingsForm.isEnabled().value.set(true);
      settle();
      expect(JSON.parse(localStorage.getItem(SETTINGS_KEY)!)).toMatchObject({
        isEnabled: true,
      });
    });

    it('should not store the attached files', () => {
      service.files.set([new File(['x'], 'a.pdf')]);
      service.form.participant.givenName().value.set('Max');
      settle();
      expect(localStorage.getItem(STORAGE_KEY)).not.toContain('a.pdf');
    });

    it('should restore the form in a new instance', () => {
      const start = new Date(2025, 0, 1, 10);
      const end = new Date(2025, 0, 3, 18);

      service.form.meeting.type().value.set('committee');
      service.form.meeting.name().value.set('Sitzung');
      service.form.meeting.location().value.set('Bamberg');
      service.form.meeting.time().value.set({ start, end });
      service.form.participant.givenName().value.set('Max');
      service.form.participant.familyName().value.set('Mustermann');
      service.form.participant.zipCode().value.set('80331');
      addTransport('inbound', car('A', 'B'), publicTransport('B', 'C'));
      service.form.expenses.material().value.set([material(12.5)]);
      service.form.overview.note().value.set('Notiz');
      settle();

      TestBed.resetTestingModule();
      const restored = createService();
      const { meeting, participant, expenses, overview } = restored.model();

      expect(meeting.type).toBe('committee');
      expect(meeting.name).toBe('Sitzung');
      expect(meeting.location).toBe('Bamberg');
      expect(participant.givenName).toBe('Max');
      expect(participant.zipCode).toBe('80331');
      expect(overview.note).toBe('Notiz');

      expect(meeting.time.start).toEqual(start);
      expect(meeting.time.end).toEqual(end);

      expect(
        expenses.transport.inbound.map((e) => [
          e.mode,
          e.origin,
          e.destination,
        ]),
      ).toEqual([
        ['car', 'A', 'B'],
        ['public', 'B', 'C'],
      ]);

      expect(expenses.material[0].amount).toBe(12.5);
      expect(expenses.material[0].date).toEqual(new Date(2025, 0, 1));
    });

    const storeFoodExpenses = () => {
      service.form.meeting.type().value.set('committee');
      service.foodSettingsForm.isEnabled().value.set(true);
      service.form.meeting.time().value.set({
        start: new Date(2025, 0, 1, 10),
        end: new Date(2025, 0, 3, 18),
      });
      settle();
      service.form.expenses.food[1].breakfast().value.set(true);
      settle();

      TestBed.resetTestingModule();
      const restored = createService();
      settle();
      return restored;
    };

    it('should restore food expenses and settings', () => {
      const restored = storeFoodExpenses();

      expect(restored.foodSettings().isEnabled).toBe(true);
      expect(restored.foodEnabled()).toBe(true);
      expect(restored.model().expenses.food.map((e) => e.absence)).toEqual([
        'arrival',
        'intermediate',
        'return',
      ]);
    });

    it('should restore the overnight stay', () => {
      service.form.meeting.type().value.set('committee');
      service.foodSettingsForm.isEnabled().value.set(true);
      service.form.meeting.time().value.set({
        start: new Date(2025, 0, 1, 20),
        end: new Date(2025, 0, 2, 10),
      });
      service.foodSettingsForm.isOvernight().value.set(true);
      settle();

      TestBed.resetTestingModule();
      const restored = createService();
      settle();

      expect(restored.foodSettings().isOvernight).toBe(true);
      expect(restored.model().expenses.food.map((e) => e.absence)).toEqual([
        'arrival',
        'return',
      ]);
    });

    it('should restore the selected meals', () => {
      const restored = storeFoodExpenses();

      expect(restored.model().expenses.food.map((e) => e.breakfast)).toEqual([
        false,
        true,
        false,
      ]);
    });

    it('should mark restored values as touched', () => {
      service.form.participant.givenName().value.set('Max');
      settle();

      TestBed.resetTestingModule();
      const restored = createService();

      expect(restored.form.participant.givenName().touched()).toBe(true);
      expect(restored.form.participant.familyName().touched()).toBe(false);
    });

    it('should restore drafts stored by older versions', () => {
      // fields of other meeting types and disabled fields were not stored
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          meeting: { type: 'course', name: 'Kurs', code: 'B123FB' },
          participant: { givenName: 'Max', sectionId: 1002 },
          expenses: {
            transport: { inbound: [car('A', 'B')], onsite: [], outbound: [] },
            material: [],
          },
          overview: { note: 'Notiz', files: [{}] },
        }),
      );

      TestBed.resetTestingModule();
      const restored = createService();
      const model = restored.model();

      expect(model.meeting).toMatchObject({
        type: 'course',
        name: 'Kurs',
        code: 'B123FB',
        location: '',
        time: { start: null, end: null },
      });
      expect(model.participant).toMatchObject({
        givenName: 'Max',
        sectionId: 1002,
        familyName: '',
        bic: '',
      });
      expect(model.expenses.transport.inbound).toHaveLength(1);
      expect(model.expenses.food).toEqual([]);
      expect(model.overview).toEqual({ note: 'Notiz' });
    });

    it('should not overwrite the stored form before restoring it', () => {
      localStorage.setItem(STORAGE_KEY, '{invalid');
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ isEnabled: true }));

      TestBed.resetTestingModule();
      expect(() => createService()).toThrow();
      expect(localStorage.getItem(STORAGE_KEY)).toBe('{invalid');
    });

    it('should not restore attached files', () => {
      service.form.participant.givenName().value.set('Max');
      service.files.set([new File(['x'], 'a.pdf')]);
      settle();

      TestBed.resetTestingModule();
      const restored = createService();

      expect(restored.files()).toEqual([]);
    });

    it('should start with an empty form without stored data', () => {
      expect(service.model().participant.givenName).toBe('');
      expect(service.model().expenses.transport.inbound).toHaveLength(0);
    });

    it('should remove stored data and reset the form', () => {
      service.form.participant.givenName().value.set('Max');
      service.form.meeting.type().value.set('committee');
      addTransport('inbound', car('A', 'B'));
      service.form.expenses.material().value.set([material(5)]);
      service.foodSettingsForm.isEnabled().value.set(true);
      service.files.set([new File(['x'], 'a.pdf')]);
      settle();
      expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();

      service.deleteStoredData();

      const expectEmpty = () => {
        expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
        expect(localStorage.getItem(SETTINGS_KEY)).toBeNull();
        expect(service.model().participant.givenName).toBe('');
        expect(service.model().meeting.type).toBe('course');
        expect(service.model().expenses.transport.inbound).toHaveLength(0);
        expect(service.model().expenses.material).toHaveLength(0);
        expect(service.model().expenses.food).toHaveLength(0);
        expect(service.foodSettings().isEnabled).toBe(false);
        expect(service.files()).toEqual([]);
      };
      expectEmpty();

      // the effects must not store the empty form again
      settle();
      expectEmpty();
    });

    it('should clear the touched state when the data is deleted', () => {
      service.form.participant().markAsTouched();
      service.deleteStoredData();
      expect(service.form.participant.givenName().touched()).toBe(false);
    });
  });
});
