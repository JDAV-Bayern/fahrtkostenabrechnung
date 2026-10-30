import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { of } from 'rxjs';
import {
  FoodExpense,
  MaterialExpense,
  TransportExpense,
} from 'src/domain/expense.model';
import { ExpenseConfig } from '../expenses/expense.config';
import { ExpenseConfigService } from '../expenses/shared/expense-config.service';
import { ReimbursementControlService } from './reimbursement-control.service';

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

// The expense config is stubbed, so the service never touches the network.
function createService() {
  TestBed.configureTestingModule({
    providers: [
      {
        provide: ExpenseConfigService,
        useValue: { getConfig: () => of(config) },
      },
    ],
  });
  return TestBed.inject(ReimbursementControlService);
}

describe('ReimbursementControlService', () => {
  let service: ReimbursementControlService;

  const addTransport = (
    direction: 'inbound' | 'onsite' | 'outbound',
    ...expenses: TransportExpense[]
  ) => {
    for (const expense of expenses) {
      service
        .getTransportExpenses(direction)
        .push(new FormControl(expense, { nonNullable: true }));
    }
  };

  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
    service = createService();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('BIC', () => {
    const setIban = (iban: string) =>
      service.participantStep.controls.iban.setValue(iban);

    it('should be disabled initially', () => {
      expect(service.participantStep.controls.bic.disabled).toBe(true);
    });

    it('should stay disabled for SEPA IBANs', () => {
      setIban(DE_IBAN);
      expect(service.participantStep.controls.bic.disabled).toBe(true);
    });

    it('should stay disabled for invalid IBANs', () => {
      setIban('XX123');
      expect(service.participantStep.controls.bic.disabled).toBe(true);
    });

    it.each([
      ['Switzerland', 'CH9300762011623852957'],
      ['Monaco', 'MC5811222000010123456789030'],
      ['San Marino', 'SM86U0322509800000000270100'],
      ['Saudi Arabia', 'SA0380000000608010167519'],
    ])('should be enabled for %s', (_, iban) => {
      setIban(iban);
      expect(service.participantStep.controls.iban.valid).toBe(true);
      expect(service.participantStep.controls.bic.enabled).toBe(true);
    });

    it('should be disabled again after switching to a SEPA IBAN', () => {
      setIban('CH9300762011623852957');
      setIban(DE_IBAN);
      expect(service.participantStep.controls.bic.disabled).toBe(true);
    });

    it('should be part of the reimbursement for non-SEPA IBANs', () => {
      setIban('CH9300762011623852957');
      service.participantStep.controls.bic.setValue('UBSWCHZH80A');
      expect(service.getReimbursement().participant.bic).toBe('UBSWCHZH80A');
    });

    it('should validate the BIC format', () => {
      setIban('CH9300762011623852957');
      const bic = service.participantStep.controls.bic;
      bic.setValue('invalid');
      expect(bic.valid).toBe(false);
      bic.setValue('UBSWCHZH80A');
      expect(bic.valid).toBe(true);
      bic.setValue('UBSWCHZH');
      expect(bic.valid).toBe(true);
    });
  });

  describe('participant validation', () => {
    it.each([
      ['8033', true],
      ['80331', true],
      ['803', false],
      ['803312', false],
      ['abcde', false],
    ])('should validate zip code %s', (zipCode, valid) => {
      const control = service.participantStep.controls.zipCode;
      control.setValue(zipCode);
      expect(control.valid).toBe(valid);
    });
  });

  describe('meeting type', () => {
    it('should add the course code control for courses', () => {
      service.meetingStep.controls.type.setValue('committee');
      expect(service.meetingStep.contains('code')).toBe(false);

      service.meetingStep.controls.type.setValue('course');
      expect(service.meetingStep.contains('code')).toBe(true);
    });

    it('should disable location and time for courses', () => {
      const meeting = service.meetingStep;
      meeting.controls.type.setValue('committee');
      expect(meeting.controls.location.enabled).toBe(true);
      expect(meeting.controls.time.enabled).toBe(true);

      meeting.controls.type.setValue('course');
      expect(meeting.controls.location.disabled).toBe(true);
      expect(meeting.controls.time.disabled).toBe(true);
    });

    it('should disable food reimbursement for courses', () => {
      service.meetingStep.controls.type.setValue('committee');
      service.foodSettings.controls.isEnabled.setValue(true);
      service.meetingStep.controls.type.setValue('course');
      expect(service.foodExpenses.disabled).toBe(true);
    });

    it('should enable food reimbursement for committees if selected', () => {
      service.foodSettings.controls.isEnabled.setValue(true);
      service.meetingStep.controls.type.setValue('committee');
      expect(service.foodExpenses.enabled).toBe(true);
    });

    it('should keep food reimbursement disabled for committees if not selected', () => {
      service.meetingStep.controls.type.setValue('committee');
      expect(service.foodExpenses.disabled).toBe(true);
    });
  });

  describe('getMeeting', () => {
    it('should return the course data', () => {
      service.meetingStep.patchValue({ name: 'Kurs', code: 'B123FB' });
      const meeting = service.getMeeting();
      expect(meeting.type).toBe('course');
      expect(meeting).toMatchObject({ name: 'Kurs', code: 'B123FB' });
    });

    it('should return the committee times', () => {
      const start = new Date(2025, 0, 1, 10);
      const end = new Date(2025, 0, 1, 20);
      service.meetingStep.controls.type.setValue('committee');
      service.meetingStep.controls.time.setValue({ start, end });

      expect(service.getMeeting()).toMatchObject({
        type: 'committee',
        time: { start, end },
      });
    });

    it('should return invalid dates for incomplete committee times', () => {
      service.meetingStep.controls.type.setValue('committee');
      const meeting = service.getMeeting();
      if (meeting.type !== 'committee') {
        throw new Error('expected committee');
      }
      expect(Number.isNaN(meeting.time.start.getTime())).toBe(true);
      expect(Number.isNaN(meeting.time.end.getTime())).toBe(true);
    });
  });

  describe('getReimbursement', () => {
    it('should use 0 for a missing section', () => {
      expect(service.getReimbursement().participant.sectionId).toBe(0);
    });

    it('should return the participant section', () => {
      service.participantStep.controls.sectionId.setValue(1002);
      expect(service.getReimbursement().participant.sectionId).toBe(1002);
    });

    it('should include transport expenses of all directions', () => {
      addTransport('inbound', car('A', 'B'));
      addTransport('outbound', car('B', 'A'));
      const { transport } = service.getReimbursement().expenses;
      expect(transport.inbound).toHaveLength(1);
      expect(transport.onsite).toHaveLength(0);
      expect(transport.outbound).toHaveLength(1);
    });

    it('should return the note', () => {
      service.overviewStep.controls.note.setValue('Hallo');
      expect(service.getReimbursement().note).toBe('Hallo');
    });
  });

  describe('food expenses', () => {
    const day = (d: number, h = 0) => new Date(2025, 0, d, h);

    const setTime = (start: Date, end: Date) =>
      service.meetingStep.controls.time.setValue({ start, end });

    const absences = () =>
      service.foodExpenses.getRawValue().map((e) => e.absence);

    beforeEach(() => {
      service.meetingStep.controls.type.setValue('committee');
    });

    it('should be generated from the meeting time', () => {
      setTime(day(1, 12), day(3, 12));
      expect(absences()).toEqual(['arrival', 'intermediate', 'return']);
    });

    it('should be regenerated when the meeting time changes', () => {
      setTime(day(1, 12), day(3, 12));
      setTime(day(1, 12), day(5, 12));
      expect(service.foodExpenses.length).toBe(5);
    });

    it('should be empty for meetings shorter than 8 hours', () => {
      setTime(day(1, 10), day(1, 12));
      expect(service.foodExpenses.length).toBe(0);
    });

    it('should only be part of the reimbursement when enabled', () => {
      setTime(day(1, 12), day(3, 12));
      expect(service.foodExpenses.disabled).toBe(true);
      expect(service.getReimbursement().expenses.food).toEqual([]);

      service.foodSettings.controls.isEnabled.setValue(true);
      expect(service.foodExpenses.enabled).toBe(true);
      expect(service.getReimbursement().expenses.food).toHaveLength(3);

      service.foodSettings.controls.isEnabled.setValue(false);
      expect(service.foodExpenses.disabled).toBe(true);
      expect(service.getReimbursement().expenses.food).toEqual([]);
    });

    it('should not be part of the reimbursement for courses', () => {
      service.foodSettings.controls.isEnabled.setValue(true);
      setTime(day(1, 12), day(3, 12));
      service.meetingStep.controls.type.setValue('course');
      expect(service.getReimbursement().expenses.food).toEqual([]);
    });

    describe('overnight stay', () => {
      const overnight = () => service.foodSettings.controls.isOvernight;

      it('should only be available for meetings spanning two days', () => {
        setTime(day(1, 20), day(2, 10));
        expect(overnight().enabled).toBe(true);

        setTime(day(1, 12), day(3, 12));
        expect(overnight().disabled).toBe(true);

        setTime(day(1, 10), day(1, 20));
        expect(overnight().disabled).toBe(true);
      });

      it('should change the generated expenses for two-day meetings', () => {
        setTime(day(1, 20), day(2, 10));
        expect(absences()).toEqual(['single']);

        overnight().setValue(true);
        expect(absences()).toEqual(['arrival', 'return']);

        overnight().setValue(false);
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

        expect(service.getTransportExpenses('outbound').getRawValue()).toEqual([
          { ...second, origin: 'C', destination: 'B' },
          { ...first, origin: 'B', destination: 'A' },
        ]);
      });

      it('should replace existing outbound expenses', () => {
        addTransport('inbound', car('A', 'B'));
        addTransport('outbound', car('X', 'Y'), car('Y', 'Z'));

        service.completeReturnTrip();

        const outbound = service.getTransportExpenses('outbound').getRawValue();
        expect(outbound).toHaveLength(1);
        expect(outbound[0]).toMatchObject({ origin: 'B', destination: 'A' });
      });

      it('should clear the outbound trip if there is no inbound trip', () => {
        addTransport('outbound', car('X', 'Y'));
        service.completeReturnTrip();
        expect(service.getTransportExpenses('outbound').length).toBe(0);
      });
    });
  });

  describe('expenses step guard', () => {
    it('should be invalid without any reimbursable expense', () => {
      expect(service.expensesExtraStepGuard.errors).toEqual({
        totalRequired: true,
      });
    });

    it('should become valid with a reimbursable expense', () => {
      service.materialExpenses.push(
        new FormControl(material(10), { nonNullable: true }),
      );
      expect(service.expensesExtraStepGuard.valid).toBe(true);
    });

    it('should become invalid again when the expenses are removed', () => {
      service.materialExpenses.push(
        new FormControl(material(10), { nonNullable: true }),
      );
      service.materialExpenses.clear();
      expect(service.expensesExtraStepGuard.valid).toBe(false);
    });

    it('should count transport expenses', () => {
      addTransport('inbound', car('A', 'B'));
      expect(service.expensesExtraStepGuard.valid).toBe(true);
    });
  });

  describe('local storage', () => {
    it('should save the form on changes', () => {
      service.participantStep.controls.givenName.setValue('Max');
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(stored.participant.givenName).toBe('Max');
    });

    it('should save the food settings', () => {
      service.foodSettings.controls.isEnabled.setValue(true);
      expect(JSON.parse(localStorage.getItem(SETTINGS_KEY)!)).toMatchObject({
        isEnabled: true,
      });
    });

    it('should restore the form in a new instance', () => {
      const start = new Date(2025, 0, 1, 10);
      const end = new Date(2025, 0, 3, 18);

      service.meetingStep.controls.type.setValue('committee');
      service.meetingStep.patchValue({ name: 'Sitzung', location: 'Bamberg' });
      service.meetingStep.controls.time.setValue({ start, end });
      service.participantStep.patchValue({
        givenName: 'Max',
        familyName: 'Mustermann',
        zipCode: '80331',
      });
      addTransport('inbound', car('A', 'B'), publicTransport('B', 'C'));
      service.materialExpenses.push(
        new FormControl(material(12.5), { nonNullable: true }),
      );
      service.overviewStep.controls.note.setValue('Notiz');

      TestBed.resetTestingModule();
      const restored = createService();

      expect(restored.meetingStep.controls.type.value).toBe('committee');
      expect(restored.meetingStep.controls.name.value).toBe('Sitzung');
      expect(restored.meetingStep.controls.location.value).toBe('Bamberg');
      expect(restored.participantStep.controls.givenName.value).toBe('Max');
      expect(restored.participantStep.controls.zipCode.value).toBe('80331');
      expect(restored.overviewStep.controls.note.value).toBe('Notiz');

      const time = restored.meetingStep.controls.time.value;
      expect(time.start).toEqual(start);
      expect(time.end).toEqual(end);

      const inbound = restored.getTransportExpenses('inbound').getRawValue();
      expect(inbound.map((e) => [e.mode, e.origin, e.destination])).toEqual([
        ['car', 'A', 'B'],
        ['public', 'B', 'C'],
      ]);

      const [restoredMaterial] = restored.materialExpenses.getRawValue();
      expect(restoredMaterial.amount).toBe(12.5);
      expect(restoredMaterial.date).toEqual(new Date(2025, 0, 1));
    });

    const storeFoodExpenses = () => {
      service.meetingStep.controls.type.setValue('committee');
      service.foodSettings.controls.isEnabled.setValue(true);
      service.meetingStep.controls.time.setValue({
        start: new Date(2025, 0, 1, 10),
        end: new Date(2025, 0, 3, 18),
      });
      service.foodExpenses.at(1).setValue({
        ...(service.foodExpenses.at(1).value as FoodExpense),
        breakfast: true,
      });

      TestBed.resetTestingModule();
      return createService();
    };

    it('should restore food expenses and settings', () => {
      const restored = storeFoodExpenses();

      expect(restored.foodSettings.controls.isEnabled.value).toBe(true);
      expect(restored.foodExpenses.enabled).toBe(true);
      expect(restored.foodExpenses.getRawValue().map((e) => e.absence)).toEqual(
        ['arrival', 'intermediate', 'return'],
      );
    });

    it('should restore the overnight stay', () => {
      service.meetingStep.controls.type.setValue('committee');
      service.foodSettings.controls.isEnabled.setValue(true);
      service.meetingStep.controls.time.setValue({
        start: new Date(2025, 0, 1, 20),
        end: new Date(2025, 0, 2, 10),
      });
      service.foodSettings.controls.isOvernight.setValue(true);

      TestBed.resetTestingModule();
      const restored = createService();

      expect(restored.foodSettings.controls.isOvernight.value).toBe(true);
      expect(restored.foodExpenses.getRawValue().map((e) => e.absence)).toEqual(
        ['arrival', 'return'],
      );
    });

    it('should restore the selected meals', () => {
      const restored = storeFoodExpenses();

      expect(
        restored.foodExpenses.getRawValue().map((e) => e.breakfast),
      ).toEqual([false, true, false]);
    });

    it('should mark restored values as dirty', () => {
      service.participantStep.controls.givenName.setValue('Max');

      TestBed.resetTestingModule();
      const restored = createService();

      expect(restored.participantStep.controls.givenName.dirty).toBe(true);
      expect(restored.participantStep.controls.givenName.touched).toBe(true);
    });

    it('should not overwrite the stored form before restoring it', () => {
      localStorage.setItem(STORAGE_KEY, '{invalid');
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ isEnabled: true }));

      TestBed.resetTestingModule();
      expect(() => createService()).toThrow();
      expect(localStorage.getItem(STORAGE_KEY)).toBe('{invalid');
    });

    it('should not restore attached files', () => {
      service.participantStep.controls.givenName.setValue('Max');
      service.overviewStep.controls.files.setValue([new File(['x'], 'a.pdf')]);

      TestBed.resetTestingModule();
      const restored = createService();

      expect(restored.overviewStep.controls.files.value).toEqual([]);
    });

    it('should start with an empty form without stored data', () => {
      expect(service.participantStep.controls.givenName.value).toBe('');
      expect(service.getTransportExpenses('inbound').length).toBe(0);
    });

    it('should remove stored data and reset the form', () => {
      service.participantStep.controls.givenName.setValue('Max');
      service.meetingStep.controls.type.setValue('committee');
      addTransport('inbound', car('A', 'B'));
      service.materialExpenses.push(
        new FormControl(material(5), { nonNullable: true }),
      );
      service.foodSettings.controls.isEnabled.setValue(true);

      service.deleteStoredData();

      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
      expect(localStorage.getItem(SETTINGS_KEY)).toBeNull();
      expect(service.participantStep.controls.givenName.value).toBe('');
      expect(service.meetingStep.controls.type.value).toBe('course');
      expect(service.getTransportExpenses('inbound').length).toBe(0);
      expect(service.materialExpenses.length).toBe(0);
      expect(service.foodExpenses.length).toBe(0);
      expect(service.foodSettings.controls.isEnabled.value).toBe(false);
    });
  });
});
