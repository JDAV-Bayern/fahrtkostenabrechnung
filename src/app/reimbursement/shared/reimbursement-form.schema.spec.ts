import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FieldTree, form } from '@angular/forms/signals';
import { TransportMode } from 'src/domain/expense.model';
import { buildTransportExpense, emptyTransportDraft } from './expense-draft';
import {
  initialFormModel,
  ReimbursementFormModel,
} from './reimbursement-form.model';
import { reimbursementSchema } from './reimbursement-form.schema';

const DE_IBAN = 'DE02120300000000202051';
const CH_IBAN = 'CH9300762011623852957';

const transport = (mode: TransportMode) =>
  buildTransportExpense({
    ...emptyTransportDraft(),
    mode,
    origin: 'A',
    destination: 'B',
  });

function setup(initialTotal = 1) {
  const total = signal(initialTotal);
  const model = signal<ReimbursementFormModel>(initialFormModel());
  const f = TestBed.runInInjectionContext(() =>
    form(model, reimbursementSchema({ total })),
  );
  return { f, model, total };
}

const kinds = (field: FieldTree<unknown>) =>
  field()
    .errors()
    .map((error) => error.kind);

describe('reimbursementSchema', () => {
  describe('meeting', () => {
    it('should require a name and, for courses, a code', () => {
      const { f } = setup();
      expect(kinds(f.meeting.name)).toEqual(['required']);
      expect(kinds(f.meeting.code)).toEqual(['required']);
      expect(f.meeting().valid()).toBe(false);

      f.meeting.name().value.set('Kurs');
      f.meeting.code().value.set('B123FB');
      expect(f.meeting().valid()).toBe(true);
    });

    it('should hide location and time for courses', () => {
      const { f } = setup();
      expect(f.meeting.location().hidden()).toBe(true);
      expect(f.meeting.time().hidden()).toBe(true);
      expect(f.meeting.code().hidden()).toBe(false);
    });

    it('should hide the course code for committees', () => {
      const { f } = setup();
      f.meeting.type().value.set('committee');
      expect(f.meeting.code().hidden()).toBe(true);
      expect(f.meeting.location().hidden()).toBe(false);
      expect(f.meeting.time().hidden()).toBe(false);
    });

    it('should not count hidden fields', () => {
      const { f } = setup();
      f.meeting.name().value.set('Kurs');
      f.meeting.code().value.set('B123FB');
      // location and time are empty, but hidden for courses
      expect(f.meeting().valid()).toBe(true);

      f.meeting.type().value.set('committee');
      // the empty course code is hidden now
      expect(f.meeting().valid()).toBe(false);
      f.meeting.location().value.set('München');
      f.meeting.time().value.set({
        start: new Date(2025, 0, 1, 10),
        end: new Date(2025, 0, 1, 20),
      });
      expect(f.meeting().valid()).toBe(true);
    });

    it.each([
      ['J123', ['federalCourse']],
      ['B12FB', ['unknownCourse']],
      ['B123FB', []],
      ['LJV', []],
      ['VERANSTALTUNG', []],
    ])('should validate the course code %s', (code, expected) => {
      const { f } = setup();
      f.meeting.code().value.set(code);
      expect(kinds(f.meeting.code)).toEqual(expected);
    });

    it('should keep the meeting data when the type changes', () => {
      const { f, model } = setup();
      f.meeting.code().value.set('B123FB');
      f.meeting.type().value.set('committee');
      expect(model().meeting.code).toBe('B123FB');
    });

    describe('committee times', () => {
      const committee = () => {
        const result = setup();
        result.f.meeting.type().value.set('committee');
        return result;
      };

      it('should require start and end', () => {
        const { f } = committee();
        expect(kinds(f.meeting.time.start)).toEqual(['required']);
        expect(kinds(f.meeting.time.end)).toEqual(['required']);
      });

      it('should reject an end before the start', () => {
        const { f } = committee();
        f.meeting.time().value.set({
          start: new Date(2025, 0, 3),
          end: new Date(2025, 0, 1),
        });
        expect(kinds(f.meeting.time)).toEqual(['dateRangeOrder']);
      });

      it('should reject times in the future', () => {
        const { f } = committee();
        f.meeting.time().value.set({
          start: new Date(2025, 0, 1),
          end: new Date(2999, 0, 1),
        });
        expect(kinds(f.meeting.time)).toEqual(['dateRangePast']);
      });

      it('should accept an ordered range in the past', () => {
        const { f } = committee();
        f.meeting.time().value.set({
          start: new Date(2025, 0, 1),
          end: new Date(2025, 0, 3),
        });
        expect(kinds(f.meeting.time)).toEqual([]);
      });
    });
  });

  describe('participant', () => {
    it.each([
      ['8033', true],
      ['80331', true],
      ['803', false],
      ['803312', false],
      ['abcde', false],
    ])('should validate zip code %s', (zipCode, valid) => {
      const { f } = setup();
      f.participant.zipCode().value.set(zipCode);
      expect(f.participant.zipCode().valid()).toBe(valid);
    });

    it('should report a missing zip code as required only', () => {
      const { f } = setup();
      expect(kinds(f.participant.zipCode)).toEqual(['required']);
      f.participant.zipCode().value.set('abc');
      expect(kinds(f.participant.zipCode)).toEqual(['pattern']);
    });

    it('should require the other personal data', () => {
      const { f } = setup();
      for (const field of [
        f.participant.givenName,
        f.participant.familyName,
        f.participant.sectionId,
        f.participant.city,
        f.participant.iban,
      ]) {
        expect(kinds(field)).toEqual(['required']);
      }
    });

    describe('IBAN', () => {
      it('should accept valid IBANs', () => {
        const { f } = setup();
        f.participant.iban().value.set(DE_IBAN);
        expect(kinds(f.participant.iban)).toEqual([]);
      });

      it('should reject invalid IBANs', () => {
        const { f } = setup();
        f.participant.iban().value.set('DE00');
        expect(kinds(f.participant.iban)).toEqual(['ibanInvalid']);
      });
    });

    describe('BIC', () => {
      const setIban = (f: ReturnType<typeof setup>['f'], iban: string) =>
        f.participant.iban().value.set(iban);

      it('should be hidden initially', () => {
        const { f } = setup();
        expect(f.participant.bic().hidden()).toBe(true);
      });

      it('should stay hidden for SEPA IBANs', () => {
        const { f } = setup();
        setIban(f, DE_IBAN);
        expect(f.participant.bic().hidden()).toBe(true);
      });

      it('should stay hidden for invalid IBANs', () => {
        const { f } = setup();
        setIban(f, 'XX123');
        expect(f.participant.bic().hidden()).toBe(true);
      });

      it.each([
        ['Switzerland', CH_IBAN],
        ['Monaco', 'MC5811222000010123456789030'],
        ['San Marino', 'SM86U0322509800000000270100'],
        ['Saudi Arabia', 'SA0380000000608010167519'],
      ])('should be required for %s', (_, iban) => {
        const { f } = setup();
        setIban(f, iban);
        expect(f.participant.iban().valid()).toBe(true);
        expect(f.participant.bic().hidden()).toBe(false);
        expect(kinds(f.participant.bic)).toEqual(['required']);
      });

      it('should be hidden again after switching to a SEPA IBAN', () => {
        const { f } = setup();
        setIban(f, CH_IBAN);
        setIban(f, DE_IBAN);
        expect(f.participant.bic().hidden()).toBe(true);
      });

      it('should not make the participant invalid while hidden', () => {
        const { f } = setup();
        f.participant.givenName().value.set('Max');
        f.participant.familyName().value.set('Mustermann');
        f.participant.sectionId().value.set(1002);
        f.participant.zipCode().value.set('80331');
        f.participant.city().value.set('München');
        setIban(f, DE_IBAN);
        expect(f.participant().valid()).toBe(true);

        setIban(f, CH_IBAN);
        expect(f.participant().valid()).toBe(false);
        f.participant.bic().value.set('UBSWCHZH80A');
        expect(f.participant().valid()).toBe(true);
      });

      it('should validate the BIC format', () => {
        const { f } = setup();
        setIban(f, CH_IBAN);
        const bic = f.participant.bic;
        bic().value.set('invalid');
        expect(kinds(bic)).toEqual(['pattern']);
        bic().value.set('UBSWCHZH80A');
        expect(bic().valid()).toBe(true);
        bic().value.set('UBSWCHZH');
        expect(bic().valid()).toBe(true);
      });
    });
  });

  describe('transport expenses', () => {
    const setTransport = (
      f: ReturnType<typeof setup>['f'],
      direction: 'inbound' | 'onsite' | 'outbound',
      ...modes: TransportMode[]
    ) => f.expenses.transport[direction]().value.set(modes.map(transport));

    it.each(['inbound', 'outbound'] as const)(
      'should allow one plan expense for %s',
      (direction) => {
        const { f } = setup();
        setTransport(f, direction, 'plan', 'car');
        expect(kinds(f.expenses.transport[direction])).toEqual([]);
      },
    );

    it.each(['inbound', 'outbound'] as const)(
      'should limit the plan expenses for %s',
      (direction) => {
        const { f } = setup();
        setTransport(f, direction, 'plan', 'car', 'plan');
        expect(kinds(f.expenses.transport[direction])).toEqual([
          'transportModeLimited',
        ]);
      },
    );

    it('should only allow car and public transport onsite', () => {
      const { f } = setup();
      setTransport(f, 'onsite', 'car', 'public');
      expect(kinds(f.expenses.transport.onsite)).toEqual([]);

      setTransport(f, 'onsite', 'car', 'bike');
      expect(kinds(f.expenses.transport.onsite)).toEqual([
        'transportModesAllowed',
      ]);
    });

    it('should make the transport step invalid', () => {
      const { f } = setup();
      setTransport(f, 'onsite', 'plan');
      expect(f.expenses.transport().invalid()).toBe(true);
      setTransport(f, 'onsite', 'car');
      expect(f.expenses.transport().valid()).toBe(true);
    });
  });

  describe('expenses guard', () => {
    it('should require a total above 0', () => {
      const { f, total } = setup(0);
      expect(kinds(f.expenses)).toEqual(['totalRequired']);

      total.set(12);
      expect(kinds(f.expenses)).toEqual([]);
    });

    it('should follow any signal read by the total', () => {
      const { f, total } = setup(5);
      expect(f.expenses().valid()).toBe(true);
      total.set(0);
      expect(f.expenses().invalid()).toBe(true);
    });

    it('should not affect the transport step', () => {
      const { f } = setup(0);
      expect(f.expenses.transport().valid()).toBe(true);
    });
  });
});
